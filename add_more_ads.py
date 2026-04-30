import os

for root, dirs, files in os.walk('.'):
    dirs[:] = [d for d in dirs if d not in ['.git', 'node_modules', '.agents']]
    for f in files:
        if f.endswith('.html'):
            filepath = os.path.join(root, f)
            with open(filepath, 'r', encoding='utf-8') as file:
                content = file.read()
            
            orig = content
            
            # Blog pages: add an ad slot after the content (before the related links or footer)
            if 'blog/' in filepath:
                # Add before Frequently Asked Questions or related links if possible, 
                # else before the end of blog-wrap
                if '</div>\n\n<main id="main-content">' in content and 'class="ad-slot"' in content:
                    # Let's add an ad-slot before the footer
                    if '<footer class="footer" role="contentinfo">' in content:
                        content = content.replace(
                            '</main>\n<footer class="footer" role="contentinfo">',
                            '  <!-- Bottom Ad Slot -->\n  <div class="ad-slot" style="margin: 40px auto; max-width: 760px;" aria-label="Advertisement">Advertisement</div>\n</main>\n<footer class="footer" role="contentinfo">'
                        )
            
            if content != orig:
                with open(filepath, 'w', encoding='utf-8') as file:
                    file.write(content)
                print(f"Added bottom ad to {filepath}")
