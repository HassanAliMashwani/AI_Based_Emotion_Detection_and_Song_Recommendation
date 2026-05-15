# AI-Based Emotion Detection and Song Recommendation

A full-stack web application that detects your emotional state from text (English + Hinglish/Roman Urdu) and recommends matching music from both Bollywood and Hollywood across multiple genres.

---

## Architecture

```
┌─────────────────────────────────────────┐
│           React Web App (Vite)          │
│  ThoughtInput → emotionApi.ts → MoodCard│
│  SongFilters ← mockApi.ts ← catalog.json│
└────────────────┬────────────────────────┘
                 │ HTTP POST /predict
          ┌──────▼──────┐
          │  FastAPI API │  (optional, local)
          │  api/main.py │
          └──────┬───────┘
                 │
          ┌──────▼───────────────────────────┐
          │    ml/inference.py               │
          │  XLM-R → Classical → Keyword     │
          └──────────────────────────────────┘
```

---

## Quick Start

### 1. Run the Web App

```bash
pnpm install      # or: npm install
pnpm dev          # opens http://localhost:5173
```

The app works immediately using the **keyword fallback** — no Python needed.

### 2. Train the Classical Model (Recommended)

```bash
pip install scikit-learn datasets joblib
python ml/train.py
```

Expected output:
- **Accuracy: ~91–93%**
- **Macro-F1: ~90–92%**

Model saved to `ml/artifacts/model.pkl`

### 3. Start the Inference API

```bash
pip install -r api/requirements.txt
uvicorn api.main:app --reload --port 8000
```

The web app will now use the trained model automatically (with 3-second timeout fallback).

### 4. Train the Transformer Model (Optional — Requires GPU)

```bash
pip install transformers torch accelerate evaluate
python ml/train_transformer.py
```

Expected: **accuracy 93–96%, macro-F1 92–95%** (best for Hinglish).

---

## Evaluation

```bash
python ml/evaluate.py
```

Prints: accuracy, macro-F1, per-class precision/recall/F1, confusion matrix.

---

## Running Tests

```bash
pytest ml/tests/ -v
```

Tests cover:
- `"my dog died"` → sad (subMood: grief)
- `"feeling low today"` → sad (subMood: low)
- `"I can't stop smiling"` → happy
- `"I am so angry right now"` → angry
- `"mood off hai"` → sad (subMood: low) *(Hinglish)*
- `"ghussa aa raha hai"` → angry *(Hinglish)*
- `"bohat khush hoon"` → happy *(Hinglish)*
- `"mera dil toot gaya"` → sad (subMood: breakup) *(Hinglish)*
- `"tension ho rahi hai"` → sad (subMood: anxious) *(Hinglish)*

---

## Label Strategy

**Option A — 4 main moods + subMood:**

| Raw Label | Mood | SubMood |
|-----------|------|---------|
| joy | happy | joy |
| love | happy | love |
| surprise | happy | excitement |
| sadness | sad | general |
| fear | sad | anxious |
| anger | angry | anger |

SubMood overrides (keyword-based at inference time):
`grief, breakup, low, anxious, excitement, loneliness`

---

## Adding New Songs

Edit `data/song_catalog.json`. Each song must follow this schema:

```json
{
  "id": "unique-id",
  "title": "Song Title",
  "artist": "Artist Name",
  "language": "bollywood",
  "genre": "pop",
  "mood": "happy",
  "subMood": "joy",
  "year": 2023,
  "albumArt": "https://...",
  "link": "https://youtube.com/..."
}
```

**Language values:** `bollywood` | `hollywood`  
**Genre values:** `pop`, `rock`, `hip-hop`, `lo-fi`, `edm`, `acoustic`, `classical`, `ballad`, `ghazal`, `sufi`, `filmi`  
**Mood values:** `happy` | `sad` | `angry` | `neutral`

---

## Hinglish / Roman Urdu Support

The system supports code-mixed Hinglish/Roman Urdu inputs:

| Input | Detected | SubMood |
|-------|----------|---------|
| `mera dil toot gaya` | sad | breakup |
| `mood off hai` | sad | low |
| `bohat khush hoon` | happy | joy |
| `ghussa aa raha hai` | angry | anger |
| `tension ho rahi hai` | sad | anxious |

### Known Limitations
1. **Spelling variation**: `khush`, `khus`, `khushi` are all handled via char n-gram features in the classical model.
2. **No standard tokenization** for Hinglish — char n-grams (3–5) help significantly.
3. **Rare slang** may misclassify. Adding examples to `data/custom_dataset.jsonl` and retraining improves this.
4. **XLM-R** handles Hinglish far better than the classical model due to multilingual pretraining — use it when GPU is available.

---

## Confidence & Fallback

- **Confidence < 50%**: App shows a "Low confidence" warning and widens recommendations to `neutral/calm` mood.
- **Fallback mode**: If the FastAPI server is offline, the keyword fallback runs automatically. A banner is shown in the UI.
- **Model priority**: XLM-R → Classical (LinearSVC) → Keyword fallback

---

## Dataset

- **dair-ai/emotion**: 20,000 samples (16k train / 2k val / 2k test)
- **custom_dataset.jsonl**: 160+ real-life samples including Hinglish, grief, breakup, low, anxious, loneliness, anger, happy, neutral

---

## Diversity in Recommendations

- Last **10 played song IDs** are excluded from the next recommendation batch.
- Results are shuffled randomly within the filtered set.
- Configurable: change `DIVERSITY_WINDOW` in `src/app/services/mockApi.ts`.