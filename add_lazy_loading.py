import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

# We want to match <img ...>
img_pattern = re.compile(r'<img\s+[^>]*>', re.IGNORECASE)

for file in html_files:
    with open(file, 'r') as f:
        content = f.read()
    
    def repl(match):
        img_tag = match.group(0)
        
        # Don't add lazy if it's already there
        if 'loading="lazy"' in img_tag or 'loading=lazy' in img_tag:
            return img_tag
            
        # Don't add lazy to hero images or sticky logos
        if 'hero' in img_tag.lower() or 'logo_stickey.png' in img_tag:
            return img_tag
            
        # Add loading="lazy" before the closing bracket
        # E.g. <img src="..." alt="..."> -> <img src="..." alt="..." loading="lazy">
        if img_tag.endswith('/>'):
            new_tag = img_tag[:-2] + ' loading="lazy" />'
        else:
            new_tag = img_tag[:-1] + ' loading="lazy">'
        return new_tag

    new_content = img_pattern.sub(repl, content)
    
    if new_content != content:
        with open(file, 'w') as f:
            f.write(new_content)

