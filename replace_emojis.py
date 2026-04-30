import os
import re

link_tag = '<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" rel="stylesheet">'

emoji_map = {
    # Flags
    "🇬🇧": '<span class="material-symbols-outlined" style="vertical-align: middle; color: inherit;">public</span>',
    "🇨🇦": '<span class="material-symbols-outlined" style="vertical-align: middle; color: inherit;">public</span>',
    "🇦🇺": '<span class="material-symbols-outlined" style="vertical-align: middle; color: inherit;">public</span>',
    "🇺🇸": '<span class="material-symbols-outlined" style="vertical-align: middle; color: inherit;">public</span>',
    "&#x1F1EC;&#x1F1E7;": '<span class="material-symbols-outlined" style="vertical-align: middle; color: inherit;">public</span>',
    "&#x1F1E8;&#x1F1E6;": '<span class="material-symbols-outlined" style="vertical-align: middle; color: inherit;">public</span>',
    "&#x1F1E6;&#x1F1FA;": '<span class="material-symbols-outlined" style="vertical-align: middle; color: inherit;">public</span>',
    "&#x1F1FA;&#x1F1F8;": '<span class="material-symbols-outlined" style="vertical-align: middle; color: inherit;">public</span>',

    # Trust items / Badges
    "🔒": '<span class="material-symbols-outlined" style="vertical-align: middle; color: inherit;">lock</span>',
    "&#x1F512;": '<span class="material-symbols-outlined" style="vertical-align: middle; color: inherit;">lock</span>',
    
    "✅": '<span class="material-symbols-outlined" style="vertical-align: text-bottom; color: inherit;">check_circle</span>',
    "&#x2705;": '<span class="material-symbols-outlined" style="vertical-align: text-bottom; color: inherit;">check_circle</span>',
    
    "🆓": '<span class="material-symbols-outlined" style="vertical-align: middle; color: inherit;">money_off</span>',
    
    "📅": '<span class="material-symbols-outlined" style="vertical-align: text-bottom; font-size: 1.1em; color: inherit;">calendar_today</span>',
    "&#x1F4C5;": '<span class="material-symbols-outlined" style="vertical-align: text-bottom; font-size: 1.1em; color: inherit;">calendar_today</span>',
    
    "🔍": '<span class="material-symbols-outlined" style="vertical-align: middle; color: inherit;">search</span>',
    
    "📖": '<span class="material-symbols-outlined" style="vertical-align: text-bottom; font-size: 1.1em; color: inherit;">menu_book</span>',
    "&#x1F4D6;": '<span class="material-symbols-outlined" style="vertical-align: text-bottom; font-size: 1.1em; color: inherit;">menu_book</span>',
    
    "💡": '<span class="material-symbols-outlined" style="vertical-align: text-bottom; font-size: 1.2em; color: inherit;">lightbulb</span>',
    "&#x1F4A1;": '<span class="material-symbols-outlined" style="vertical-align: text-bottom; font-size: 1.2em; color: inherit;">lightbulb</span>',
    
    "ℹ️": '<span class="material-symbols-outlined" style="vertical-align: text-bottom; font-size: 1.2em; color: inherit;">info</span>',
    "&#x2139;&#xFE0F;": '<span class="material-symbols-outlined" style="vertical-align: text-bottom; font-size: 1.2em; color: inherit;">info</span>',
    "&#x2139;": '<span class="material-symbols-outlined" style="vertical-align: text-bottom; font-size: 1.2em; color: inherit;">info</span>',
    
    "⚠️": '<span class="material-symbols-outlined" style="vertical-align: text-bottom; font-size: 1.2em; color: inherit;">warning</span>',
    "&#x26A0;&#xFE0F;": '<span class="material-symbols-outlined" style="vertical-align: text-bottom; font-size: 1.2em; color: inherit;">warning</span>',
    
    "❌": '<span class="material-symbols-outlined" style="vertical-align: text-bottom; font-size: 1.2em; color: inherit;">cancel</span>',
    "&#x274C;": '<span class="material-symbols-outlined" style="vertical-align: text-bottom; font-size: 1.2em; color: inherit;">cancel</span>',
    "&#x2717;": '<span class="material-symbols-outlined" style="vertical-align: text-bottom; font-size: 1.2em; color: inherit;">cancel</span>',
    
    "⚖️": '<span class="material-symbols-outlined" style="vertical-align: text-bottom; font-size: 1.1em; color: inherit;">gavel</span>',
    "&#x2696;&#xFE0F;": '<span class="material-symbols-outlined" style="vertical-align: text-bottom; font-size: 1.1em; color: inherit;">gavel</span>',
    
    "🌍": '<span class="material-symbols-outlined" style="vertical-align: middle; color: inherit;">public</span>',
    "🔄": '<span class="material-symbols-outlined" style="vertical-align: middle; color: inherit;">autorenew</span>',
    "📋": '<span class="material-symbols-outlined" style="vertical-align: middle; color: inherit;">assignment</span>',
    "&#x1F4CB;": '<span class="material-symbols-outlined" style="vertical-align: middle; color: inherit;">assignment</span>',
    
    "🖨": '<span class="material-symbols-outlined" style="vertical-align: middle; color: inherit;">print</span>',
    "&#x1F5A8;": '<span class="material-symbols-outlined" style="vertical-align: middle; color: inherit;">print</span>',
    
    "📤": '<span class="material-symbols-outlined" style="vertical-align: middle; color: inherit;">upload</span>',
    "&#x1F4E4;": '<span class="material-symbols-outlined" style="vertical-align: middle; color: inherit;">upload</span>',
    
    "🏦": '<span class="material-symbols-outlined" style="vertical-align: middle; color: inherit;">account_balance</span>',
    
    "&#x1F4C4;": '<span class="material-symbols-outlined" style="vertical-align: middle; color: inherit;">description</span>',
    "&#x1F3B2;": '<span class="material-symbols-outlined" style="vertical-align: middle; color: inherit;">casino</span>',
    "&#x2699;": '<span class="material-symbols-outlined" style="vertical-align: middle; color: inherit;">settings</span>',
    
    "&#x2197;": '<span class="material-symbols-outlined" style="vertical-align: text-bottom; font-size: 1em; color: inherit;">open_in_new</span>',
    "&#x21A9;": '<span class="material-symbols-outlined" style="vertical-align: text-bottom; font-size: 1em; color: inherit;">undo</span>',
}

for root, dirs, files in os.walk("."):
    dirs[:] = [d for d in dirs if d not in [".git", "node_modules", ".agents"]]
    for f in files:
        if f.endswith(".html"):
            fp = os.path.join(root, f)
            with open(fp, "r", encoding="utf-8") as file:
                content = file.read()
            
            orig = content
            # Add link tag if not present
            if "Material+Symbols+Outlined" not in content:
                content = content.replace("</head>", f"{link_tag}\n</head>")
            
            # Replace emojis
            for emoji, replacement in emoji_map.items():
                content = content.replace(emoji, replacement)
            
            # also look for raw search emoji in placeholder
            content = content.replace('placeholder="🔍', 'placeholder="')
            
            if content != orig:
                with open(fp, "w", encoding="utf-8") as file:
                    file.write(content)
                print(f"Updated {fp}")

print("Done")
