import os
import re
import glob

# Find all HTML files
html_files = glob.glob('*.html')

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove Floating WhatsApp block
    content = re.sub(r'<!-- Floating WhatsApp -->[\s\S]*?<a href="https://wa\.me/[^>]+>[\s\S]*?</a>\n?', '', content)
    # Also another format sometimes used:
    content = re.sub(r'<!-- WhatsApp -->[\s\S]*?<a href="https://wa\.me/[^>]+>[\s\S]*?</a>\n?', '', content)
    
    # Remove WhatsApp Chat Bubble block
    content = re.sub(r'<!-- WhatsApp Chat Bubble -->[\s\S]*?<div class="wa-bubble".*?>[\s\S]*?</div>\n    </div>\n?', '', content)
    # Just in case the bubble regex misses because of the nested divs:
    content = re.sub(r'<!-- WhatsApp Chat Bubble -->[\s\S]*?</div>\s*</div>\n?', '', content)

    # Remove "slot filling fast" span
    content = re.sub(r'<span class="announcement-msg active">✦ Limited spots available[^<]+</span>\s*', '', content)
    
    # In some pages, maybe the first message is now different, we might want to make sure the next one is active.
    content = content.replace('<span class="announcement-msg">✦ 10,000+ lives', '<span class="announcement-msg active">✦ 10,000+ lives')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
print("Updated HTML files.")

