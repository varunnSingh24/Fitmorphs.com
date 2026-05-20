import os
import glob
from bs4 import BeautifulSoup

html_files = glob.glob('*.html')

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    
    # Remove whatsapp float
    wa_float = soup.find('a', class_='wa-float')
    if wa_float:
        wa_float.decompose()
        
    # Remove whatsapp bubble
    wa_bubble = soup.find('div', id='waBubble')
    if wa_bubble:
        wa_bubble.decompose()
        
    # Remove "slot filling fast" span
    announcement_msg = soup.find('span', string=lambda text: text and 'Limited spots available' in text)
    if announcement_msg:
        announcement_msg.decompose()
        
    # Find next announcement msg and make it active
    announcement_bar = soup.find('div', id='announcementBar')
    if announcement_bar:
        msgs = announcement_bar.find_all('span', class_='announcement-msg')
        if msgs and not any('active' in msg.get('class', []) for msg in msgs):
            msgs[0]['class'] = msgs[0].get('class', []) + ['active']

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(str(soup))

print("Done")
