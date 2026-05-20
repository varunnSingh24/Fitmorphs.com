import os
import re

if not os.path.exists('assets/css'):
    os.makedirs('assets/css')

html_files = [f for f in os.listdir('.') if f.endswith('.html')]
style_pattern = re.compile(r'<style>(.*?)</style>', re.DOTALL)

for file in html_files:
    with open(file, 'r') as f:
        content = f.read()
    
    # We want to extract only the FIRST style block, which is usually the massive inline style
    # Some pages have smaller style blocks in the body/footer, we might want to extract all of them or just the first.
    # Let's extract all style blocks into one file, but only if they are large enough.
    
    matches = style_pattern.findall(content)
    if matches:
        css_content = ""
        for i, match in enumerate(matches):
            if len(match.strip()) > 100: # Only extract significant style blocks
                css_content += match + "\n"
                # Replace this specific block with empty string, and we will add the link tag in head
                content = content.replace(f"<style>{match}</style>", "")
        
        if css_content:
            css_filename = file.replace('.html', '-inline.css')
            css_filepath = os.path.join('assets/css', css_filename)
            with open(css_filepath, 'w') as f:
                f.write(css_content.strip())
            
            # Insert the link tag before </head>
            link_tag = f'<link rel="stylesheet" href="assets/css/{css_filename}">'
            content = content.replace('</head>', f'    {link_tag}\n</head>')
            
            with open(file, 'w') as f:
                f.write(content)

