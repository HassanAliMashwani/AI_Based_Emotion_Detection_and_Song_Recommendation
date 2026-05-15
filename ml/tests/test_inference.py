"""
ml/tests/test_inference.py
==========================
pytest suite for the inference module.

Run:
  pytest ml/tests/ -v

Tests cover English real-life phrasing + Hinglish/Roman Urdu samples.
Uses the keyword fallback so tests run without any trained model.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from ml.inference import predict

LOW_CONF_THRESHOLD = 0.50


def _assert_mood(text: str, expected_mood: str, min_conf: float = 0.0):
    result = predict(text)
    assert result["mood"] == expected_mood, (
        f"Expected '{expected_mood}' for text: '{text}'\n"
        f"  Got: {result}"
    )
    assert result["confidence"] >= min_conf, (
        f"Confidence too low ({result['confidence']:.2f} < {min_conf}) for: '{text}'"
    )
    return result


# ── English real-life phrasing ────────────────────────────────────────────────
class TestEnglishPhrasing:
    def test_dog_died(self):
        r = _assert_mood("my dog died", "sad")
        assert r["subMood"] == "grief", f"Expected subMood=grief, got {r['subMood']}"

    def test_feeling_low(self):
        r = _assert_mood("feeling low today", "sad")
        assert r["subMood"] == "low", f"Expected subMood=low, got {r['subMood']}"

    def test_cant_stop_smiling(self):
        _assert_mood("I can't stop smiling", "happy")

    def test_angry(self):
        _assert_mood("I am so angry right now", "angry")

    def test_excited(self):
        _assert_mood("I'm excited!", "happy")

    def test_breakup(self):
        r = _assert_mood("she left me", "sad")
        assert r["subMood"] == "breakup"

    def test_lonely(self):
        r = _assert_mood("I feel so lonely", "sad")

    def test_stressed(self):
        r = _assert_mood("I am stressed about exams", "sad")

    def test_neutral(self):
        r = predict("today was an ordinary day")
        # neutral OR any mood is acceptable here; just check it returns
        assert r["mood"] in ("happy", "sad", "angry", "neutral")
        assert 0 <= r["confidence"] <= 1.0


# ── Hinglish / Roman Urdu ─────────────────────────────────────────────────────
class TestHinglish:
    def test_mood_off(self):
        r = _assert_mood("mood off hai", "sad")
        assert r["subMood"] == "low", f"Expected subMood=low, got {r['subMood']}"

    def test_ghussa(self):
        _assert_mood("ghussa aa raha hai", "angry")

    def test_khush(self):
        _assert_mood("bohat khush hoon", "happy")

    def test_dil_toot_gaya(self):
        r = _assert_mood("mera dil toot gaya", "sad")
        assert r["subMood"] == "breakup"

    def test_udaas(self):
        _assert_mood("bohot udaas hoon aaj", "sad")

    def test_tension(self):
        r = _assert_mood("tension ho rahi hai", "sad")
        assert r["subMood"] == "anxious"

    def test_mazaa(self):
        _assert_mood("bahut maza aa raha hai", "happy")


# ── Result schema ─────────────────────────────────────────────────────────────
class TestResultSchema:
    def test_schema_keys(self):
        r = predict("hello")
        required = {"mood", "confidence", "subMood", "modelVersion", "fallbackUsed"}
        assert required.issubset(r.keys()), f"Missing keys: {required - r.keys()}"

    def test_confidence_range(self):
        for text in ["happy day", "sad times", "ghussa"]:
            r = predict(text)
            assert 0.0 <= r["confidence"] <= 1.0

    def test_fallback_bool(self):
        r = predict("test")
        assert isinstance(r["fallbackUsed"], bool)

    def test_empty_text(self):
        r = predict("")
        assert r["mood"] == "neutral"
        assert r["fallbackUsed"] is True
