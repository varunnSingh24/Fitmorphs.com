import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

title_pattern = re.compile(r'<title>(.*?)</title>', re.IGNORECASE)
desc_pattern = re.compile(r'<meta\s+name="description"\s+content="(.*?)".*?>', re.IGNORECASE | re.DOTALL)

for file in html_files:
    if file == 'index.html': # We know index.html already has OG tags, but let's check
        continue
    
    with open(file, 'r') as f:
        content = f.read()
    
    # Check if OG tags already exist
    if 'property="og:title"' in content:
        continue
    
    title_match = title_pattern.search(content)
    desc_match = desc_pattern.search(content)
    
    title = title_match.group(1).strip() if title_match else "FitMorphs — Transform From Within"
    desc = desc_match.group(1).strip() if desc_match else "India's premier doctor-supervised metabolic reversal program."
    
    og_tags = f"""    <meta property="og:title" content="{title}">
    <meta property="og:description" content="{desc}">
    <meta property="og:image" content="logo_stickey.png">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://www.fitmorphs.com/{file}">"""
    
    # Insert after <meta name="description"...> or <title>
    if desc_match:
        content = content.replace(desc_match.group(0), desc_match.group(0) + "\n" + og_tags)
    elif title_match:
        content = content.replace(title_match.group(0), title_match.group(0) + "\n" + og_tags)
        
    with open(file, 'w') as f:
        f.write(content)

