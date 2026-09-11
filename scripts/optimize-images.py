from pathlib import Path
from PIL import Image
import re
root=Path('.')
main=Path('src/main.jsx')
s=main.read_text(encoding='utf-8')
refs=set(re.findall(r"/([\w-]+\.(?:png|jpg))",s))
for name in sorted(refs):
    im=Image.open(Path('public')/name).convert('RGB')
    limit=2400 if name=='hero-master.png' else 800 if name=='profile-portrait.png' else 1672 if name=='contact-background.png' else 1000
    im.thumbnail((limit,limit*8 if name.startswith('gallery') else limit))
    out=Path('public')/(Path(name).stem+'.webp')
    im.save(out,'WEBP',quality=85,method=6)
    print(name, (Path('public')/name).stat().st_size, '->',out.stat().st_size)
    s=s.replace('/'+name,'/'+out.name)
im=Image.open('public/hero-master.png').convert('RGB');im.thumbnail((960,960));im.save('public/hero-mobile.webp',quality=83,method=6)
main.write_text(s,encoding='utf-8')
p=Path('src/style.css');s=p.read_text(encoding='utf-8').replace('/hero-master.png','/hero-master.webp');p.write_text(s,encoding='utf-8')
