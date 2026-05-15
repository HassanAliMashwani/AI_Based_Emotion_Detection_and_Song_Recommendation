from datasets import load_dataset
import os

os.environ["HF_DATASETS_CACHE"] = "./hf_cache"

print("Loading dair-ai/emotion dataset...")
ds = load_dataset("dair-ai/emotion")

print("\n" + "="*50)
print("DATASET SIZE BREAKDOWN")
print("="*50)

total = 0
for split in ds:
    size = len(ds[split])
    total += size
    print(f"  {split:12s}: {size:,} samples")

print(f"  {'TOTAL':12s}: {total:,} samples")
print("="*50)

# Show label distribution
print("\nLABEL DISTRIBUTION (train split):")
train_ds = ds["train"]
label_counts = {}
for l in train_ds["label"]:
    label_name = train_ds.features["label"].int2str(l)
    label_counts[label_name] = label_counts.get(label_name, 0) + 1

for label, count in sorted(label_counts.items(), key=lambda x: -x[1]):
    bar = "#" * (count // 100)
    print(f"  {label:10s}: {count:,}  {bar}")

print("\nMAPPED LABEL DISTRIBUTION (train split):")
label_map = {
    "joy": "happy",
    "sadness": "sad",
    "anger": "angry",
    "love": "happy",
    "fear": "sad",
    "surprise": "happy"
}
mapped_counts = {}
for l in train_ds["label"]:
    label_name = train_ds.features["label"].int2str(l)
    mapped = label_map.get(label_name, "neutral")
    mapped_counts[mapped] = mapped_counts.get(mapped, 0) + 1

for label, count in sorted(mapped_counts.items(), key=lambda x: -x[1]):
    bar = "#" * (count // 100)
    print(f"  {label:10s}: {count:,}  {bar}")

print("\nCURRENT SONGS IN SYSTEM (notebook + mockApi):")
songs = {
    "happy": 4,
    "sad": 4,
    "angry": 4,
    "neutral": 4
}
for mood, count in songs.items():
    print(f"  {mood:10s}: {count} songs")
print(f"  {'TOTAL':10s}: {sum(songs.values())} songs")
