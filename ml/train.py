"""
ml/train.py
===========
Train a classical TF-IDF + LinearSVC emotion classifier.

Pipeline:
  - Two TF-IDF vectorizers (word n-grams 1-2 + char_wb n-grams 3-5)
    concatenated via FeatureUnion for rich text representation.
  - LinearSVC with class_weight='balanced' to handle class imbalance.
  - Trains on dair-ai/emotion (train split) + custom_dataset.jsonl
  - Evaluates on dair-ai/emotion (test split) + held-out 20% of custom set
  - Exports: ml/artifacts/model.pkl

Expected metrics on test set:
  accuracy  ~91-93%
  macro-F1  ~90-92%
"""

import json
import os
import sys
import joblib
import numpy as np

from pathlib import Path
from datasets import load_dataset
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline, FeatureUnion
from sklearn.svm import LinearSVC
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import accuracy_score, f1_score, classification_report, confusion_matrix
from sklearn.model_selection import train_test_split

# Add project root to path so label_map can be imported
sys.path.insert(0, str(Path(__file__).parent))
from label_map import map_label

# ── Paths ────────────────────────────────────────────────────────────────────
PROJECT_ROOT = Path(__file__).parent.parent
CUSTOM_DATA_PATH = PROJECT_ROOT / "data" / "custom_dataset.jsonl"
ARTIFACTS_DIR = PROJECT_ROOT / "ml" / "artifacts"
ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
MODEL_PATH = ARTIFACTS_DIR / "model.pkl"
CACHE_DIR = PROJECT_ROOT / "hf_cache"

# ── Load dair-ai/emotion ─────────────────────────────────────────────────────
print("Loading dair-ai/emotion dataset...")
os.environ["HF_DATASETS_CACHE"] = str(CACHE_DIR)
ds = load_dataset("dair-ai/emotion")

def extract_split(split_ds):
    texts, moods = [], []
    for item in split_ds:
        raw_label = split_ds.features["label"].int2str(item["label"])
        mood, _ = map_label(raw_label)
        texts.append(item["text"])
        moods.append(mood)
    return texts, moods

train_texts_hf, train_labels_hf = extract_split(ds["train"])
test_texts_hf, test_labels_hf = extract_split(ds["test"])
print(f"  HF train: {len(train_texts_hf):,}  |  HF test: {len(test_texts_hf):,}")

# ── Load custom dataset ───────────────────────────────────────────────────────
custom_texts, custom_labels = [], []
if CUSTOM_DATA_PATH.exists():
    print(f"Loading custom dataset from {CUSTOM_DATA_PATH}...")
    with open(CUSTOM_DATA_PATH, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            obj = json.loads(line)
            custom_texts.append(obj["text"])
            custom_labels.append(obj["mood"])  # already mapped

    # 80/20 split of custom data
    ctr, cte, clr, cle = train_test_split(
        custom_texts, custom_labels, test_size=0.2, random_state=42, stratify=custom_labels
    )
    print(f"  Custom train: {len(ctr):,}  |  Custom test: {len(cte):,}")
else:
    print("WARNING: custom_dataset.jsonl not found — training on HF data only.")
    ctr, cte, clr, cle = [], [], [], []

# ── Combine ───────────────────────────────────────────────────────────────────
X_train = train_texts_hf + ctr
y_train = train_labels_hf + clr
X_test  = test_texts_hf  + cte
y_test  = test_labels_hf + cle

print(f"\nTotal train samples : {len(X_train):,}")
print(f"Total test  samples : {len(X_test):,}")

# Class distribution
from collections import Counter
dist = Counter(y_train)
print("\nClass distribution (train):")
for cls, cnt in sorted(dist.items()):
    print(f"  {cls:10s}: {cnt:,}")

# ── Build pipeline ────────────────────────────────────────────────────────────
word_tfidf = TfidfVectorizer(
    analyzer="word",
    ngram_range=(1, 2),
    max_features=80_000,
    sublinear_tf=True,
    strip_accents="unicode",
    min_df=2,
)
char_tfidf = TfidfVectorizer(
    analyzer="char_wb",
    ngram_range=(3, 5),
    max_features=60_000,
    sublinear_tf=True,
    strip_accents="unicode",
    min_df=3,
)
features = FeatureUnion([
    ("word", word_tfidf),
    ("char", char_tfidf),
])

# CalibratedClassifierCV wraps LinearSVC to give probability estimates
svc = LinearSVC(class_weight="balanced", C=1.0, max_iter=2000)
calibrated_svc = CalibratedClassifierCV(svc, cv=3)

model = Pipeline([
    ("features", features),
    ("clf",      calibrated_svc),
])

# ── Train ─────────────────────────────────────────────────────────────────────
print("\nTraining LinearSVC pipeline (this may take 1-3 minutes)...")
model.fit(X_train, y_train)
print("Training complete.")

# ── Evaluate ──────────────────────────────────────────────────────────────────
print("\n" + "="*60)
print("EVALUATION ON TEST SET")
print("="*60)
y_pred = model.predict(X_test)

acc = accuracy_score(y_test, y_pred)
macro_f1 = f1_score(y_test, y_pred, average="macro")

print(f"Accuracy  : {acc:.4f}  ({acc*100:.2f}%)")
print(f"Macro-F1  : {macro_f1:.4f}  ({macro_f1*100:.2f}%)")
print("\nPer-class report:")
print(classification_report(y_test, y_pred, digits=4))

print("Confusion matrix:")
classes = sorted(set(y_test))
cm = confusion_matrix(y_test, y_pred, labels=classes)
header = f"{'':12s}" + "".join(f"{c:>10s}" for c in classes)
print(header)
for cls, row in zip(classes, cm):
    print(f"{cls:12s}" + "".join(f"{v:>10d}" for v in row))

# ── Export ────────────────────────────────────────────────────────────────────
print(f"\nSaving model to {MODEL_PATH}...")
meta = {
    "model": model,
    "classes": model.classes_.tolist(),
    "version": "linearSVC-v1",
    "accuracy": float(acc),
    "macro_f1": float(macro_f1),
}
joblib.dump(meta, MODEL_PATH)
print("Done. Model saved.")
