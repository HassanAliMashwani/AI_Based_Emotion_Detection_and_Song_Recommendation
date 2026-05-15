# ml/label_map.py
# Explicit label mapping: dair-ai/emotion raw labels -> (mood, subMood)
# Strategy: Option A — 4 main moods + subMood for recommendation granularity

LABEL_MAP = {
    "joy":      ("happy",   "joy"),
    "love":     ("happy",   "love"),
    "surprise": ("happy",   "excitement"),
    "sadness":  ("sad",     "general"),
    "fear":     ("sad",     "anxious"),
    "anger":    ("angry",   "anger"),
}
DEFAULT_MOOD = ("neutral", "calm")


def map_label(raw_label: str) -> tuple[str, str]:
    """Map a raw dair-ai/emotion label to (mood, subMood)."""
    return LABEL_MAP.get(raw_label, DEFAULT_MOOD)


# SubMood override keyword groups (checked at inference time on the raw input text)
# If any keyword matches, subMood is overridden regardless of model output.
SUBMOOD_KEYWORDS: dict[str, list[str]] = {
    "grief": [
        "dog died", "cat died", "pet died", "passed away", "funeral",
        "lost my", "she died", "he died", "they died", "death of",
        "died today", "kutta mar gaya", "billi mar gayi", "wafaat",
    ],
    "breakup": [
        "broke up", "she left", "he left", "breakup", "break up",
        "dil toot", "toot gaya", "dil toot gaya", "heartbreak",
        "my ex", "left me", "dumped", "chhod gaya", "chhod gayi",
    ],
    "low": [
        "feeling low", "mood off", "mood off hai", "udaas", "udaas hoon",
        "bohot bura", "feel empty", "not okay", "not ok", "feel hollow",
        "don't feel like", "nahi karna", "maan nahi", "dil nahi",
    ],
    "anxious": [
        "tension", "tension ho", "stressed", "anxiety", "anxious",
        "nervous", "darr", "darr lag", "worried", "pareshan",
        "pareshan hoon", "fikar", "stress ho rahi",
    ],
    "excitement": [
        "so excited", "can't wait", "thrilled", "pumped", "stoked",
        "bohat khush", "bahut khush", "khushi ho rahi", "mazaa aa raha",
    ],
    "loneliness": [
        "lonely", "alone", "no one", "nobody", "akela", "akeli",
        "akela hoon", "akeli hoon", "koi nahi", "sab chale gaye",
    ],
}


def override_submood(text: str) -> str | None:
    """
    Return a subMood override if any keyword from SUBMOOD_KEYWORDS
    is found in the input text (case-insensitive). Returns None otherwise.
    """
    text_lower = text.lower()
    for submood, keywords in SUBMOOD_KEYWORDS.items():
        for kw in keywords:
            if kw in text_lower:
                return submood
    return None
