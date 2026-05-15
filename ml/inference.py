"""
ml/inference.py
===============
Unified inference module used by the FastAPI server.

Load priority:
  1. XLM-R model (ml/artifacts/xlmr_model/) if present
  2. Classical LinearSVC model (ml/artifacts/model.pkl) if present
  3. Keyword fallback (always available, no external files needed)

Output schema (all callers receive):
  {
    "mood":         str,   # happy | sad | angry | neutral
    "confidence":   float, # 0.0 – 1.0
    "subMood":      str | None,
    "modelVersion": str,
    "fallbackUsed": bool
  }
"""

from __future__ import annotations
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from label_map import override_submood, LABEL_MAP, DEFAULT_MOOD

PROJECT_ROOT = Path(__file__).parent.parent
MODEL_PKL_PATH = PROJECT_ROOT / "ml" / "artifacts" / "model.pkl"
XLMR_PATH = PROJECT_ROOT / "ml" / "artifacts" / "xlmr_model"

LABEL2ID = {"happy": 0, "sad": 1, "angry": 2, "neutral": 3}
ID2LABEL = {v: k for k, v in LABEL2ID.items()}

# ── Keyword Fallback Engine ───────────────────────────────────────────────────
KEYWORD_RULES: dict[str, list[str]] = {
    "happy": [
        "happy", "joy", "joyful", "great", "excited", "wonderful", "love it",
        "amazing", "fantastic", "excellent", "smile", "smiling", "laugh", "blessed",
        "thrilled", "pumped", "glad", "cheerful", "elated", "can't stop smiling",
        # Hinglish
        "khush", "khushi", "bohat khush", "bahut khush", "maza", "mazaa",
        "maja", "maja aa raha", "achha lag raha", "accha lag raha",
    ],
    "sad": [
        "sad", "unhappy", "down", "depressed", "upset", "lonely", "cry",
        "miss", "hurt", "lost", "grief", "grief-stricken", "heartbroken",
        "sorrow", "feeling low", "not okay", "not ok", "broken",
        # loss / grief triggers → map to sad
        "died", "passed away", "funeral", "death", "lost my", "no more",
        # breakup triggers → map to sad
        "she left", "he left", "left me", "broke up", "breakup", "dumped",
        "my ex", "chhod gaya", "chhod gayi",
        # stress / anxiety → map to sad
        "stressed", "stress", "anxious", "anxiety", "tension", "nervous",
        "worried", "pareshan", "fikar",
        # Hinglish
        "udaas", "udaas hoon", "dukhi", "rona", "bura lag raha", "mood off",
        "mood off hai", "dil dukhi", "toot gaya", "dil toot", "dard",
    ],
    "angry": [
        "angry", "mad", "furious", "annoyed", "frustrated", "hate", "rage",
        "irritated", "livid", "outraged", "fed up",
        # Hinglish
        "ghussa", "ghussa aa raha", "gussa", "krodh", "chidchida",
        "bahut gussa", "ghusse mein",
    ],
}

def keyword_predict(text: str) -> dict:
    text_lower = text.lower()
    scores = {mood: 0 for mood in KEYWORD_RULES}
    for mood, kws in KEYWORD_RULES.items():
        for kw in kws:
            if kw in text_lower:
                scores[mood] += 1
    best_mood = max(scores, key=scores.get)
    best_score = scores[best_mood]
    if best_score == 0:
        best_mood = "neutral"
        confidence = 0.40
    else:
        # Rough confidence heuristic
        total = sum(scores.values())
        confidence = min(0.75, 0.45 + (best_score / max(total, 1)) * 0.30)
    submood = override_submood(text)
    return {
        "mood": best_mood,
        "confidence": round(confidence, 3),
        "subMood": submood,
        "modelVersion": "keyword-fallback-v1",
        "fallbackUsed": True,
    }

# ── Classical Model ───────────────────────────────────────────────────────────
_classical_model = None
_classical_version = "linearSVC-v1"

def _load_classical():
    global _classical_model
    if _classical_model is None and MODEL_PKL_PATH.exists():
        import joblib
        meta = joblib.load(MODEL_PKL_PATH)
        _classical_model = meta
    return _classical_model

def classical_predict(text: str) -> dict | None:
    meta = _load_classical()
    if meta is None:
        return None
    model = meta["model"]
    probs = model.predict_proba([text])[0]
    classes = meta["classes"]
    best_idx = int(probs.argmax())
    mood = classes[best_idx]
    confidence = float(probs[best_idx])
    submood = override_submood(text)
    return {
        "mood": mood,
        "confidence": round(confidence, 3),
        "subMood": submood,
        "modelVersion": meta.get("version", _classical_version),
        "fallbackUsed": False,
    }

# ── Transformer Model ─────────────────────────────────────────────────────────
_xlmr_model = None
_xlmr_tokenizer = None

def _load_xlmr():
    global _xlmr_model, _xlmr_tokenizer
    if _xlmr_model is not None:
        return True
    if not XLMR_PATH.exists():
        return False
    try:
        from transformers import AutoTokenizer, AutoModelForSequenceClassification
        import torch
        _xlmr_tokenizer = AutoTokenizer.from_pretrained(str(XLMR_PATH))
        _xlmr_model = AutoModelForSequenceClassification.from_pretrained(str(XLMR_PATH))
        _xlmr_model.eval()
        return True
    except Exception as e:
        print(f"WARNING: Failed to load XLM-R model: {e}")
        return False

def xlmr_predict(text: str) -> dict | None:
    if not _load_xlmr():
        return None
    try:
        import torch
        import torch.nn.functional as F
        inputs = _xlmr_tokenizer(text, return_tensors="pt", truncation=True, max_length=128)
        with torch.no_grad():
            logits = _xlmr_model(**inputs).logits
        probs = F.softmax(logits, dim=-1)[0].numpy()
        best_idx = int(probs.argmax())
        mood = ID2LABEL[best_idx]
        confidence = float(probs[best_idx])
        submood = override_submood(text)
        return {
            "mood": mood,
            "confidence": round(confidence, 3),
            "subMood": submood,
            "modelVersion": "xlmr-v1",
            "fallbackUsed": False,
        }
    except Exception as e:
        print(f"WARNING: XLM-R inference failed: {e}")
        return None

# ── Public Interface ──────────────────────────────────────────────────────────
def predict(text: str) -> dict:
    """
    Predict mood for a given text string.
    Tries XLM-R → Classical → Keyword fallback in order.
    Always returns a valid result dict.
    """
    text = text.strip()
    if not text:
        return {
            "mood": "neutral",
            "confidence": 0.40,
            "subMood": None,
            "modelVersion": "keyword-fallback-v1",
            "fallbackUsed": True,
        }

    # 1. Try XLM-R (best for Hinglish)
    result = xlmr_predict(text)
    if result:
        return result

    # 2. Try classical model
    result = classical_predict(text)
    if result:
        return result

    # 3. Keyword fallback (always works)
    return keyword_predict(text)


if __name__ == "__main__":
    # Quick smoke test
    tests = [
        "my dog died",
        "feeling low today",
        "I can't stop smiling",
        "I am so angry right now",
        "mood off hai",
        "ghussa aa raha hai",
        "bohat khush hoon",
        "mera dil toot gaya",
        "tension ho rahi hai",
    ]
    for t in tests:
        r = predict(t)
        print(f"  [{r['modelVersion']}] '{t}' => {r['mood']} (conf={r['confidence']:.2f}, sub={r['subMood']})")
