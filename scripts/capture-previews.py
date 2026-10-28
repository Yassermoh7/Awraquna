"""
Regenerate the screenshots shown inside the homepage circles.

    pip install playwright pillow && python -m playwright install chromium
    npm run dev            # in another terminal
    python scripts/capture-previews.py [http://localhost:3000]

Writes public/previews/{plus,legal}[-ar]-preview{,-hd,-mobile}.jpg and
src/data/previews.json (image heights used by the homepage).
"""
import json
import sys
from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright

BASE = sys.argv[1].rstrip('/') if len(sys.argv) > 1 else 'http://localhost:3000'
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'public' / 'previews'
TMP = ROOT / '.next' / 'preview-capture'
MAX_PAGE = 6200          # px of page captured (desktop, CSS px at 1440 wide)
HIDE = 'nextjs-portal{display:none!important}[class*=waFloat],[class*=whats]{display:none!important}'

Image.MAX_IMAGE_PIXELS = None
TMP.mkdir(parents=True, exist_ok=True)
heights = {}

with sync_playwright() as p:
    browser = p.chromium.launch()
    for width, height, mobile in [(1440, 900, False), (390, 844, True)]:
        page = browser.new_page(viewport={'width': width, 'height': height}, device_scale_factor=2 if mobile else 1, is_mobile=mobile)
        for key in ['plus', 'legal']:
            for lang in ['en', 'ar']:
                path = f"{'/ar' if lang == 'ar' else ''}/{key}"
                page.goto(BASE + path, wait_until='networkidle')
                total = page.evaluate('document.documentElement.scrollHeight')
                for y in range(0, total, 500):            # let lazy images and reveals settle
                    page.evaluate(f'scrollTo(0,{y})')
                    page.wait_for_timeout(50)
                page.evaluate('scrollTo(0,0)')
                page.wait_for_timeout(800)
                page.add_style_tag(content=HIDE)
                shot = TMP / f'{key}-{lang}-{"m" if mobile else "d"}.png'
                if mobile:
                    page.screenshot(path=str(shot), clip={'x': 0, 'y': 0, 'width': width, 'height': height * 2.2})
                else:
                    page.screenshot(path=str(shot), full_page=True)
                print('captured', path, 'mobile' if mobile else 'desktop')
        page.close()
    browser.close()

for key in ['plus', 'legal']:
    for lang in ['en', 'ar']:
        name = f"{key}{'-ar' if lang == 'ar' else ''}"
        desk = Image.open(TMP / f'{key}-{lang}-d.png').convert('RGB')
        desk = desk.crop((0, 0, desk.width, min(desk.height, MAX_PAGE)))
        small = desk.resize((900, round(desk.height * 900 / desk.width)), Image.LANCZOS)
        small.save(OUT / f'{name}-preview.jpg', quality=78, optimize=True, progressive=True)
        desk.save(OUT / f'{name}-preview-hd.jpg', quality=70, optimize=True, progressive=True)
        mob = Image.open(TMP / f'{key}-{lang}-m.png').convert('RGB')
        mob.resize((780, round(mob.height * 780 / mob.width)), Image.LANCZOS).save(OUT / f'{name}-preview-mobile.jpg', quality=78, optimize=True)
        heights[f'{key}-{lang}'] = small.height

(ROOT / 'src' / 'data' / 'previews.json').write_text(json.dumps(heights, indent=2) + '\n')
print('heights', heights)
