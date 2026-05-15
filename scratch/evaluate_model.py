from datasets import load_dataset
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline
from sklearn.metrics import accuracy_score, classification_report
import os

# Set cache
os.environ["HF_DATASETS_CACHE"] = "./hf_cache"

# 1. Load dataset
print("Loading dataset...")
ds = load_dataset("dair-ai/emotion")
train_ds = ds["train"]
val_ds = ds["validation"]
test_ds = ds["test"]

# 2. Extract texts and labels
train_texts = list(train_ds["text"])
train_labels = [train_ds.features["label"].int2str(l) for l in train_ds["label"]]

test_texts = list(test_ds["text"])
test_labels = [test_ds.features["label"].int2str(l) for l in test_ds["label"]]

# 3. Label mapping (consistent with notebook)
label_map = {
    "joy": "happy",
    "sadness": "sad",
    "anger": "angry",
    "love": "happy",
    "fear": "sad",
    "surprise": "happy"
}

y_train = [label_map.get(lbl, "neutral") for lbl in train_labels]
y_test = [label_map.get(lbl, "neutral") for lbl in test_labels]

# 4. Train baseline model (MultinomialNB)
print("Training MultinomialNB baseline...")
model = make_pipeline(TfidfVectorizer(), MultinomialNB())
model.fit(train_texts, y_train)

# 5. Evaluate
y_pred = model.predict(test_texts)
accuracy = accuracy_score(y_test, y_pred)
print(f"Baseline Accuracy: {accuracy:.4f}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred))
