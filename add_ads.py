import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    orig = content

    # 1. index.html Ad
    if filepath.endswith('index.html'):
        content = content.replace(
            '<h3 class="trust-item__title">2025 Updated</h3>',
            '<h3 class="trust-item__title">2026 Updated</h3>'
        )
        if 'class="ad-slot"' not in content:
            # Place after the trust section (section--alt)
            content = content.replace(
                '  </div>\n</section>\n\n<section class="section"',
                '  </div>\n</section>\n\n<!-- Ad Slot -->\n<div class="container" style="padding: 0 20px;">\n  <div class="ad-slot" aria-label="Advertisement">Advertisement</div>\n</div>\n\n<section class="section"'
            )

    # 2. Blog Ad
    if 'blog/' in filepath:
        if 'class="ad-slot"' not in content:
            # Place ad right before the first CTA or just before <h2>Frequently Asked Questions</h2>
            if '<div class="blog-cta">' in content:
                content = content.replace(
                    '<div class="blog-cta">',
                    '<!-- Ad Slot -->\n<div class="ad-slot" aria-label="Advertisement">Advertisement</div>\n<div class="blog-cta">'
                )
            elif '<h2>Frequently Asked Questions</h2>' in content:
                content = content.replace(
                    '<h2>Frequently Asked Questions</h2>',
                    '<!-- Ad Slot -->\n<div class="ad-slot" aria-label="Advertisement">Advertisement</div>\n<h2>Frequently Asked Questions</h2>'
                )

    # 3. Tools Ad
    if 'tools/' in filepath:
        if 'class="ad-slot"' not in content:
            # Place an ad right before the </div></div><footer
            content = content.replace(
                '</div></div>\n</main>\n<footer',
                '</div></div>\n<!-- Ad Slot -->\n<div class="ad-slot" style="margin: 32px auto; max-width: 820px;" aria-label="Advertisement">Advertisement</div>\n</main>\n<footer'
            )
            # Alternative layout for tool pages
            content = content.replace(
                '</div>\n</div>\n</main>\n<footer',
                '</div>\n</div>\n<!-- Ad Slot -->\n<div class="ad-slot" style="margin: 32px auto; max-width: 820px;" aria-label="Advertisement">Advertisement</div>\n</main>\n<footer'
            )
            # For pages like canada-crs where it might be structured slightly differently
            content = content.replace(
                '</div></div><footer',
                '</div></div>\n<!-- Ad Slot -->\n<div class="ad-slot" style="margin: 32px auto; max-width: 820px;" aria-label="Advertisement">Advertisement</div>\n<footer'
            )

    if content != orig:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Added ads to {filepath}")

for root, dirs, files in os.walk('.'):
    dirs[:] = [d for d in dirs if d not in ['.git', 'node_modules', '.agents']]
    for f in files:
        if f.endswith('.html'):
            process_file(os.path.join(root, f))
