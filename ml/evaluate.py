"""
ml/evaluate.py
==============
Standalone evaluation script. Loads the exported model and prints
a full report: accuracy, macro-F1, per-class PRF1, confusion matrix.

Usage:
  python ml/evaluate.py
"""

import sys, os, json
from pathlib import Path
from collections import Counter

sys.path.insert(0, str(Path(__file__).parent))
from label_map import map_label

PROJECT_ROOT = Path(__file__).parent.parent
MODEL_PKL_PATH = PROJECT_ROOT / "ml" / "artifacts" / "model.pkl"
CUSTOM_DATA_PATH = PROJECT_ROOT / "data" / "custom_dataset.jsonl"
CACHE_DIR = PROJECT_ROOT / "hf_cache"

os.environ["HF_DATASETS_CACHE"] = str(CACHE_DIR)

from datasets import load_dataset
from sklearn.metrics import (
    accuracy_score, f1_score, classification_report, confusion_matrix
)
import joblib

def main():
    if not MODEL_PKL_PATH.exists():
        print("ERROR: model.pkl not found. Run  python ml/train.py  first.")
        return

    print("Loading model...")
    meta = joblib.load(MODEL_PKL_PATH)
    model = meta["model"]
    print(f"  Model version : {meta.get('version', 'unknown')}")
    print(f"  Trained acc   : {meta.get('accuracy', 'N/A')}")
    print(f"  Trained F1    : {meta.get('macro_f1', 'N/A')}")

    print("\nLoading dair-ai/emotion test split...")
    ds = load_dataset("dair-ai/emotion")
    test_ds = ds["test"]

    texts, y_true = [], []
    for item in test_ds:
        raw = test_ds.features["label"].int2str(item["label"])
        mood, _ = map_label(raw)
        texts.append(item["text"])
        y_true.append(mood)

    # Optionally include custom test portion (load all, deduplicate with train not possible here)
    if CUSTOM_DATA_PATH.exists():
        with open(CUSTOM_DATA_PATH, "r", encoding="utf-8") as f:
            for line in f:
                obj = json.loads(line.strip())
                texts.append(obj["text"])
                y_true.append(obj["mood"])
        print(f"  +custom samples: {len(texts) - len(ds['test']):,}")

    y_pred = model.predict(texts)

    acc = accuracy_score(y_true, y_pred)
    macro_f1 = f1_score(y_true, y_pred, average="macro")

    print("\n" + "=" * 60)
    print("EVALUATION RESULTS")
    print("=" * 60)
    print(f"Accuracy  : {acc:.4f}  ({acc * 100:.2f}%)")
    print(f"Macro-F1  : {macro_f1:.4f}  ({macro_f1 * 100:.2f}%)")
    print("\nPer-class report:")
    print(classification_report(y_true, y_pred, digits=4))

    classes = sorted(set(y_true))
    cm = confusion_matrix(y_true, y_pred, labels=classes)
    print("Confusion matrix (rows=actual, cols=predicted):")
    header = f"{'':12s}" + "".join(f"{c:>10s}" for c in classes)
    print(header)
    for cls, row in zip(classes, cm):
        print(f"{cls:12s}" + "".join(f"{v:>10d}" for v in row))
    print("=" * 60)

if __name__ == "__main__":
    main()
