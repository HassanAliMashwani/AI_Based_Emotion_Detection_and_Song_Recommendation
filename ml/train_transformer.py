"""
ml/train_transformer.py
========================
Fine-tune XLM-RoBERTa (xlm-roberta-base) for 4-class emotion detection.

Requirements:
  pip install transformers datasets torch accelerate

GPU is REQUIRED for reasonable training time (30-60 min on a T4).
On CPU this will be very slow (several hours).

Expected metrics after 3 epochs:
  accuracy  ~93-96%
  macro-F1  ~92-95%
  (especially better for Hinglish/Roman-Urdu than the classical model)

Exports:
  ml/artifacts/xlmr_model/  (HuggingFace format — loadable with AutoModel)
"""

import os
import sys
import json
import numpy as np
from pathlib import Path

try:
    import torch
    from transformers import (
        AutoTokenizer, AutoModelForSequenceClassification,
        TrainingArguments, Trainer, EarlyStoppingCallback,
    )
    from datasets import load_dataset as hf_load_dataset, Dataset, DatasetDict
    import evaluate
    HAS_TRANSFORMERS = True
except ImportError:
    HAS_TRANSFORMERS = False

sys.path.insert(0, str(Path(__file__).parent))
from label_map import map_label

PROJECT_ROOT = Path(__file__).parent.parent
CUSTOM_DATA_PATH = PROJECT_ROOT / "data" / "custom_dataset.jsonl"
ARTIFACTS_DIR = PROJECT_ROOT / "ml" / "artifacts"
MODEL_OUT = ARTIFACTS_DIR / "xlmr_model"
CACHE_DIR = PROJECT_ROOT / "hf_cache"

LABEL2ID = {"happy": 0, "sad": 1, "angry": 2, "neutral": 3}
ID2LABEL = {v: k for k, v in LABEL2ID.items()}

MODEL_NAME = "xlm-roberta-base"

def main():
    if not HAS_TRANSFORMERS:
        print("ERROR: transformers/torch not installed. Run:")
        print("  pip install transformers datasets torch accelerate")
        return

    device = "cuda" if torch.cuda.is_available() else "cpu"
    if device == "cpu":
        print("WARNING: No GPU detected. Training will be very slow on CPU.")
        print("Consider using Google Colab (free T4) or Kaggle notebooks.")

    print(f"Device: {device}")
    print(f"Loading {MODEL_NAME} tokenizer...")
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, cache_dir=str(CACHE_DIR))

    # ── Load HF dataset ───────────────────────────────────────────────────────
    print("Loading dair-ai/emotion...")
    os.environ["HF_DATASETS_CACHE"] = str(CACHE_DIR)
    ds = hf_load_dataset("dair-ai/emotion")

    def hf_to_rows(split_ds):
        rows = []
        for item in split_ds:
            raw = split_ds.features["label"].int2str(item["label"])
            mood, _ = map_label(raw)
            rows.append({"text": item["text"], "label": LABEL2ID[mood]})
        return rows

    train_rows = hf_to_rows(ds["train"])
    test_rows  = hf_to_rows(ds["test"])

    # ── Load custom dataset ───────────────────────────────────────────────────
    if CUSTOM_DATA_PATH.exists():
        with open(CUSTOM_DATA_PATH, "r", encoding="utf-8") as f:
            for line in f:
                obj = json.loads(line.strip())
                if obj["mood"] in LABEL2ID:
                    train_rows.append({"text": obj["text"], "label": LABEL2ID[obj["mood"]]})

    print(f"Train: {len(train_rows):,}  |  Test: {len(test_rows):,}")

    train_ds = Dataset.from_list(train_rows)
    test_ds  = Dataset.from_list(test_rows)

    def tokenize(batch):
        return tokenizer(batch["text"], truncation=True, max_length=128, padding="max_length")

    train_ds = train_ds.map(tokenize, batched=True)
    test_ds  = test_ds.map(tokenize, batched=True)
    train_ds.set_format("torch", columns=["input_ids", "attention_mask", "label"])
    test_ds.set_format("torch", columns=["input_ids", "attention_mask", "label"])

    # ── Model ─────────────────────────────────────────────────────────────────
    print(f"Loading {MODEL_NAME} model...")
    model = AutoModelForSequenceClassification.from_pretrained(
        MODEL_NAME,
        num_labels=4,
        id2label=ID2LABEL,
        label2id=LABEL2ID,
        cache_dir=str(CACHE_DIR),
    )

    # ── Metrics ───────────────────────────────────────────────────────────────
    accuracy_metric = evaluate.load("accuracy")
    f1_metric = evaluate.load("f1")

    def compute_metrics(eval_pred):
        logits, labels = eval_pred
        preds = np.argmax(logits, axis=-1)
        acc = accuracy_metric.compute(predictions=preds, references=labels)["accuracy"]
        f1  = f1_metric.compute(predictions=preds, references=labels, average="macro")["f1"]
        return {"accuracy": acc, "macro_f1": f1}

    # ── Training args ─────────────────────────────────────────────────────────
    MODEL_OUT.mkdir(parents=True, exist_ok=True)
    training_args = TrainingArguments(
        output_dir=str(MODEL_OUT),
        num_train_epochs=3,
        per_device_train_batch_size=16,
        per_device_eval_batch_size=32,
        learning_rate=2e-5,
        warmup_ratio=0.1,
        weight_decay=0.01,
        eval_strategy="epoch",
        save_strategy="epoch",
        load_best_model_at_end=True,
        metric_for_best_model="macro_f1",
        logging_steps=100,
        report_to="none",
        fp16=(device == "cuda"),
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_ds,
        eval_dataset=test_ds,
        compute_metrics=compute_metrics,
        callbacks=[EarlyStoppingCallback(early_stopping_patience=1)],
    )

    print("Starting training...")
    trainer.train()
    trainer.save_model(str(MODEL_OUT))
    tokenizer.save_pretrained(str(MODEL_OUT))
    print(f"Transformer model saved to {MODEL_OUT}")

    # Final evaluation
    print("\nFinal evaluation:")
    results = trainer.evaluate()
    print(results)

if __name__ == "__main__":
    main()
