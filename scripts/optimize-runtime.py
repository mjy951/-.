from pathlib import Path
p=Path('src/main.jsx');s=p.read_text(encoding='utf-8')
s=s.replace('useEffect, useState','useEffect, useState, useRef, lazy, Suspense')
s=s.replace("import WarpText from './WarpText'","const WarpText = lazy(() => import('./WarpText'))")
s=s.replace('<WarpText text=', '<Suspense fallback={<span>记得<br/>联系我哦！</span>}>{visible && <WarpText text=')
s=s.replace("style={{ height: '100%', minHeight: 0 }} />", "style={{ height: '100%', minHeight: 0 }} />}</Suspense>")
s=s.replace('<img className="hero-image"', '<img fetchPriority="high" decoding="async" width={2400} height={1720} srcSet="/hero-mobile.webp 960w, /hero-master.webp 2400w" sizes="100vw" className="hero-image"')
s=s.replace('<img className="profile-portrait"','<img loading="lazy" decoding="async" className="profile-portrait"')
s=s.replace('<img src="/profile-portrait.webp"','<img loading="lazy" decoding="async" width={682} height={800} src="/profile-portrait.webp"')
s=s.replace('<img className="contact-background"','<img loading="lazy" decoding="async" width={1672} height={941} className="contact-background"')
a=s.index('    const updateNav =');b=s.index('\n  }, [])',a)
s=s[:a]+'''    const hero = document.getElementById('top')
    const update = () => {
      const observer = new IntersectionObserver(([entry]) => {
        setStickyNav(!entry.isIntersecting && entry.boundingClientRect.top < 0)
      }, { rootMargin: `${-Math.round(window.innerHeight * 0.22)}px 0px 0px 0px` })
      observer.observe(hero)
      return observer
    }
    let observer = update()
    const resize = () => { observer.disconnect(); observer = update() }
    window.addEventListener('resize', resize, { passive: true })
    return () => { observer.disconnect(); window.removeEventListener('resize', resize) }'''+s[b:]
a=s.index('<video ref=');b=s.index('</video>',a)+len('</video>')
s=s[:a]+"<PortfolioVideo src={p.video} title={p.title} active={activeVideo === p.no} />"+s[b:]
s=s.replace('function ContactSection()', '''function PortfolioVideo({ src, title, active }) {
  const ref = useRef(null)
  useEffect(() => {
    const video = ref.current
    if (!active) video.pause()
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) video.pause() })
    observer.observe(video)
    const pauseHidden = () => { if (document.hidden) video.pause() }
    document.addEventListener('visibilitychange', pauseHidden)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', pauseHidden) }
  }, [active])
  return <video ref={ref} className="project-video" controls={active} tabIndex={active ? 0 : -1} playsInline preload="none" poster={src.replace('.mp4', '-poster.webp')} aria-label={title} src={src}>你的浏览器不支持视频播放。</video>
}

function ContactSection()''')
p.write_text(s,encoding='utf-8')
p=Path('src/AccordionGallery.jsx');s=p.read_text(encoding='utf-8')
s=s.replace('applyLayout(!firstRunRef.current);\n    };', 'applyLayout(!firstRunRef.current);\n      firstRunRef.current = false;\n    };')
s=s.replace('''  useEffect(() => {
    applyLayout(!firstRunRef.current);
    firstRunRef.current = false;
  }, [applyLayout]);''','')
s=s.replace('<img src={item.image}', '<img loading="lazy" decoding="async" src={item.image}')
p.write_text(s,encoding='utf-8')
p=Path('src/DepthText.jsx');s=p.read_text(encoding='utf-8')
s=s.replace('let frameId = 0;', 'let frameId = 0;\n    let visible = false;')
s=s.replace("window.addEventListener('pointermove'", "root.addEventListener('pointermove'").replace("window.addEventListener('pointerleave'", "root.addEventListener('pointerleave'")
s=s.replace("window.removeEventListener('pointermove'", "root.removeEventListener('pointermove'").replace("window.removeEventListener('pointerleave'", "root.removeEventListener('pointerleave'")
s=s.replace('const tick = now => {', 'const tick = now => {\n      frameId = 0;\n      if (!visible || document.hidden) return;')
s=s.replace('''    applyTransform();
    frameId = requestAnimationFrame(tick);

    return () => {''','''    applyTransform();
    const sync = () => {
      if (visible && !document.hidden && !frameId) frameId = requestAnimationFrame(tick);
      else if ((!visible || document.hidden) && frameId) { cancelAnimationFrame(frameId); frameId = 0; }
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(root);
    document.addEventListener('visibilitychange', sync);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);''')
p.write_text(s,encoding='utf-8')
p=Path('src/WarpText.jsx');s=p.read_text(encoding='utf-8').replace('window.devicePixelRatio || 1, 2','window.devicePixelRatio || 1, 1.5')
s=s.replace('let visible = true;', 'let visible = false;')
s=s.replace('if (disposed || contextLost) return;\n\n      const elapsed', 'raf = 0;\n      if (disposed || contextLost || !visible || !pageVisible) return;\n\n      const elapsed')
p.write_text(s,encoding='utf-8')
p=Path('src/style.css');s=p.read_text(encoding='utf-8');s += '\n@media(max-width:800px){.hero-video:before{background-image:url(/hero-mobile.webp)}}\n';p.write_text(s,encoding='utf-8')
