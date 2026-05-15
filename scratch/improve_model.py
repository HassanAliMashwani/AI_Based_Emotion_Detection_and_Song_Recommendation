from datasets import load_dataset
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.svm import LinearSVC
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import make_pipeline
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import GridSearchCV
import os

# Set cache
os.environ["HF_DATASETS_CACHE"] = "./hf_cache"

# 1. Load dataset
print("Loading dataset...")
ds = load_dataset("dair-ai/emotion")
train_ds = ds["train"]
test_ds = ds["test"]

# 2. Extract texts and labels
train_texts = list(train_ds["text"])
train_labels = [train_ds.features["label"].int2str(l) for l in train_ds["label"]]

test_texts = list(test_ds["text"])
test_labels = [test_ds.features["label"].int2str(l) for l in test_ds["label"]]

# 3. Label mapping
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

def evaluate(model, name):
    print(f"\nEvaluating {name}...")
    model.fit(train_texts, y_train)
    y_pred = model.predict(test_texts)
    acc = accuracy_score(y_test, y_pred)
    print(f"Accuracy: {acc:.4f}")
    print(classification_report(y_test, y_pred))
    return acc

# Try Logistic Regression
evaluate(make_pipeline(TfidfVectorizer(ngram_range=(1,2)), LogisticRegression(max_iter=1000, class_weight='balanced')), "Logistic Regression")

# Try Linear SVC
evaluate(make_pipeline(TfidfVectorizer(ngram_range=(1,2)), LinearSVC(class_weight='balanced')), "Linear SVC")

# Try Random Forest
# evaluate(make_pipeline(TfidfVectorizer(), RandomForestClassifier(n_estimators=100, class_weight='balanced')), "Random Forest")
