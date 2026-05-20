import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

img_pattern = re.compile(r'<img\s+([^>]*?)>', re.IGNORECASE)

for file in html_files:
    with open(file, 'r') as f:
        content = f.read()
    
    def repl(match):
        img_tag = match.group(0)
        attrs = match.group(1)
        
        # If no alt attribute exists, add a generic one based on filename or just "FitMorphs image"
        if 'alt=' not in attrs:
            # extract src if possible
            src_match = re.search(r'src="([^"]+)"', attrs)
            alt_text = "FitMorphs website graphic"
            if src_match:
                src = src_match.group(1)
                if 'logo' in src.lower():
                    alt_text = "FitMorphs Logo"
            
            if img_tag.endswith('/>'):
                return img_tag[:-2] + f' alt="{alt_text}" />'
            else:
                return img_tag[:-1] + f' alt="{alt_text}">'
        return img_tag

    new_content = img_pattern.sub(repl, content)
    
    if new_content != content:
        with open(file, 'w') as f:
            f.write(new_content)

