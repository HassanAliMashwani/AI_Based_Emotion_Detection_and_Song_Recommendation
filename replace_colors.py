import os
import glob

# Search in src/app directory recursively
target_dir = r"E:\AI Music Recommendation System\src\app"
for filepath in glob.glob(os.path.join(target_dir, "**/*.tsx"), recursive=True):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace purple with blue, and pink with cyan
    new_content = content.replace('purple', 'blue').replace('pink', 'cyan')
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")
