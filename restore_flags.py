import os
import re

PUBLIC_ICON = '<span class="material-symbols-outlined" style="vertical-align: middle; color: inherit;">public</span>'

def process(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    orig = content
    
    # Nav drawer links
    content = content.replace(f'{PUBLIC_ICON} UK Spouse Visa', '🇬🇧 UK Spouse Visa')
    content = content.replace(f'{PUBLIC_ICON} Canada CRS', '🇨🇦 Canada CRS')
    content = content.replace(f'{PUBLIC_ICON} Australia PR', '🇦🇺 Australia PR')
    content = content.replace(f'{PUBLIC_ICON} US Green Card', '🇺🇸 US Green Card')
    content = content.replace(f'{PUBLIC_ICON} H-1B', '🇺🇸 H-1B')
    
    # Tool cards on index.html
    if 'index.html' in filepath:
        # We know the order: UK, Canada, Australia, US (Wait Time), US (H1B)
        # Or we can do regex to look at the next lines.
        parts = content.split(PUBLIC_ICON)
        if len(parts) > 1:
            new_content = parts[0]
            for i in range(1, len(parts)):
                part = parts[i]
                if 'United Kingdom' in part[:200]:
                    new_content += '🇬🇧' + part
                elif 'Canada' in part[:200]:
                    new_content += '🇨🇦' + part
                elif 'Australia' in part[:200]:
                    new_content += '🇦🇺' + part
                elif 'United States' in part[:200]:
                    new_content += '🇺🇸' + part
                else:
                    # fallback
                    new_content += PUBLIC_ICON + part
            content = new_content

    # Tool cards on canada-crs related tools etc
    if 'tools/' in filepath:
        parts = content.split(PUBLIC_ICON)
        if len(parts) > 1:
            new_content = parts[0]
            for i in range(1, len(parts)):
                part = parts[i]
                if 'UK Spouse Visa' in part[:200] or 'UK Visa' in part[:200]:
                    new_content += '🇬🇧' + part
                elif 'Canada CRS' in part[:200]:
                    new_content += '🇨🇦' + part
                elif 'Australia PR' in part[:200]:
                    new_content += '🇦🇺' + part
                elif 'US Green Card' in part[:200] or 'H-1B' in part[:200]:
                    new_content += '🇺🇸' + part
                else:
                    new_content += PUBLIC_ICON + part
            content = new_content

    if content != orig:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Restored flags in {filepath}")

for root, dirs, files in os.walk('.'):
    dirs[:] = [d for d in dirs if d not in ['.git', 'node_modules', '.agents']]
    for f in files:
        if f.endswith('.html'):
            process(os.path.join(root, f))
