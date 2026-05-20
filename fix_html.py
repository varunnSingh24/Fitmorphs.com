import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]
tailwind_config_pattern = re.compile(r'<script>\s*tailwind\.config\s*=\s*\{.*?</script>', re.DOTALL)

for file in html_files:
    with open(file, 'r') as f:
        content = f.read()
    
    # Replace inline tailwind config with external script
    if '<script src="tailwind-config.js"></script>' not in content:
        content = tailwind_config_pattern.sub('<script src="tailwind-config.js"></script>', content)
        
    with open(file, 'w') as f:
        f.write(content)
