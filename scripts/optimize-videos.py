from pathlib import Path
import sys,subprocess,json
sys.path.insert(0,str(Path('.tools/python').resolve()))
import imageio_ffmpeg
ff=imageio_ffmpeg.get_ffmpeg_exe()
report=[]
for name in ['ai-animation','live-action','multi-content']:
 src=Path('public')/(name+'.mp4'); dst=Path('public')/(name+'-web.mp4')
 subprocess.run([ff,'-y','-ss','1','-i',str(src),'-frames:v','1','-vf','scale=960:-2','-quality','85',str(Path('public')/(name+'-web-poster.webp'))],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
 subprocess.run([ff,'-y','-i',str(src),'-vf',"scale='min(1920,iw)':-2",'-c:v','libx264','-preset','fast','-crf','24','-pix_fmt','yuv420p','-c:a','aac','-b:a','128k','-movflags','+faststart','-threads','2',str(dst)],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
 report.append({'name':name,'before':src.stat().st_size,'after':dst.stat().st_size})
 print(report[-1],flush=True)
 p=Path('src/main.jsx');s=p.read_text(encoding='utf-8').replace('/'+name+'.mp4','/'+name+'-web.mp4');p.write_text(s,encoding='utf-8')
Path('media-optimization.json').write_text(json.dumps(report,indent=2))
