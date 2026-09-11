import React, { useEffect, useState, useRef, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import BorderGlow from './BorderGlow'
import DepthText from './DepthText'
import TiltedCard from './TiltedCard'
import WorkBadge from './WorkBadge'
const WarpText = lazy(() => import('./WarpText'))
import AccordionGallery from './AccordionGallery'
import './style.css'

const Arrow = () => <span className="arrow">↗</span>

const profileGlow = { edgeSensitivity: 30, glowColor: '40 80 80', backgroundColor: '#120F17', borderRadius: 28, glowRadius: 40, glowIntensity: 1.0, coneSpread: 25, animated: false, colors: ['#c084fc', '#f472b6', '#38bdf8'] }

const galleryItems = [
  { image: '/gallery-first-bill.webp', label: '开门红' },
  { image: '/gallery-annual-bill.webp', label: '年账单' },
  { image: '/gallery-new-year.webp', label: '迎元旦' },
  { image: '/gallery-holiday.webp', label: '元旦放假', position: 'center top' },
  { image: '/gallery-icon.webp', label: 'icon', position: 'center top' },
  { image: '/gallery-campaign-1.webp', label: '存储超级周期' },
  { image: '/gallery-campaign-2.webp', label: '猪肉板块' },
  { image: '/gallery-campaign-3.webp', label: '锂需求' },
  { image: '/gallery-campaign-4.webp', label: '人工智能大会' },
  { image: '/gallery-campaign-5.webp', label: '半导体' }
]

function PortfolioVideo({ src, title, active }) {
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

function ContactSection() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const section = document.getElementById('contact')
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect() }
    }, { threshold: 0.15 })
    observer.observe(section)
    return () => observer.disconnect()
  }, [])
  return <section id="contact" className={'contact contact-poster' + (visible ? ' is-visible' : '')}>
    <div className="contact-art">
      <img loading="lazy" decoding="async" width={1672} height={941} className="contact-background" src="/contact-background.webp" alt="蓝天下的动画人物递出邀请函，背景为城市景观" />
      <div className="contact-copy"><p className="contact-kicker">LET’S CONNECT</p><div className="contact-warp-heading" role="heading" aria-level={2}><Suspense fallback={<span>记得<br/>联系我哦！</span>}>{visible && <WarpText text={'记得\n联系我哦！'} color="#f8f5ff" warpStrength={0.08} warpScale={1.7} speed={0.55} pointerInfluence={0.42} pointerStrength={0.38} refraction={0.018} ripple fontSize="clamp(3rem, 10vw, 9rem)" fontWeight={800} fontFamily="Microsoft YaHei, sans-serif" letterSpacing="0.025em" lineHeight={1.1} style={{ height: '100%', minHeight: 0 }} />}</Suspense></div><p className="contact-tagline">期待与你，一起创造更多精彩</p></div>
    </div>
    <div className="contact-actions shell"><a href="mailto:767531672@qq.com">767531672@qq.com <Arrow /></a><a href="tel:13596185663">13596185663 <Arrow /></a><span>微信：ma13596185663</span></div>
    <footer className="shell footer"><span>© {new Date().getFullYear()} 马景悦 MA JINGYUE</span><span>LET’S CONNECT</span></footer>
  </section>
}

function useSectionEntrance() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const selectors = '.hero-bottom, #about > .section-kicker, .profile-photo, .career-intent, .profile-glow, .work-heading, .video-accordion > .project, .gallery-heading, .image-showcase > .accordion-gallery, .contact-art, .contact-actions, .contact-poster .footer'
    const elements = [...document.querySelectorAll(selectors)]
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        entry.target.classList.toggle('module-entered', entry.isIntersecting)
      })
    }, { threshold: 0, rootMargin: '0px 0px -40px 0px' })
    elements.forEach((element, index) => {
      element.classList.add('module-entrance')
      element.style.setProperty('--entrance-delay', `${(index % 3) * 70}ms`)
      observer.observe(element)
    })
    return () => {
      observer.disconnect()
      elements.forEach(element => {
        element.classList.remove('module-entrance', 'module-entered')
        element.style.removeProperty('--entrance-delay')
      })
    }
  }, [])
}

function App() {
  useSectionEntrance()
  const [stickyNav, setStickyNav] = useState(false)
  const [activeVideo, setActiveVideo] = useState('01')
  useEffect(() => {
    const hero = document.getElementById('top')
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
    return () => { observer.disconnect(); window.removeEventListener('resize', resize) }
  }, [])
  const projects = [
    { no: '01', tag: 'AI ANIMATION', title: 'AI辅助动画制作', className: 'blue', copy: '让灵感直接成片，让智能贯穿每一帧。', video: '/ai-animation-web.mp4' },
    { no: '02', tag: 'LIVE ACTION', title: '实拍视频制作', className: 'pearl', copy: '真实拍摄为基础，高效产出短视频、宣传片及活动视频，服务于品牌传播与企业场景的视频', video: '/live-action-web.mp4' },
    { no: '03', tag: 'MULTI-CONTENT', title: '多元素内容展示', className: 'violet', copy: '有课堂，有流程，有动画，有宣传；多元内容，一屏尽览', video: '/multi-content-web.mp4' }
  ]
  return <main>
    <nav className={'nav shell' + (stickyNav ? ' is-sticky' : '')}><a className="brand" href="#top">JY<span>/</span>MJY.</a><div className="navlinks"><a href="#top">首页</a><a href="#work">作品展示</a><a href="#gallery-horizontal-heading">图片展示</a><a href="#contact">联系我</a></div><a href="#contact" className="navcontact">LET’S TALK <Arrow /></a></nav>

    <section id="top" className="hero">
      <div className="hero-video"><img fetchPriority="high" decoding="async" width={2400} height={1720} srcSet="/hero-mobile.webp 960w, /hero-master.webp 2400w" sizes="100vw" className="hero-image" src="/hero-master.webp" alt="马景悦个人作品集视觉主图" /></div>
      <div className="shell hero-content hero-overlay"><div className="hero-bottom"><p>MA JINGYUE<br/>MOTION · VIDEO · AI DESIGN</p><a className="round-link" href="#work">SCROLL<br/>TO EXPLORE <span>↓</span></a></div></div>
      <div className="hero-index">01 <span>/</span> 05</div>
    </section>

    <section id="about" className="about shell section">
      <div className="section-kicker">01 / PROFILE</div>
      <div className="profile-layout">
        <aside className="profile-sidebar">
          <div className="profile-photo profile-photo--tilted"><TiltedCard imageSrc="/profile-portrait.webp" altText="马景悦个人头像" captionText="马景悦 · MA JINGYUE" containerHeight="100%" containerWidth="100%" imageHeight="100%" imageWidth="100%" rotateAmplitude={12} scaleOnHover={1.06} showMobileWarning={false} showTooltip={true} displayOverlayContent={false} /></div>
          <div className="career-intent"><p className="profile-label">CAREER OBJECTIVE</p><h2 className="career-depth-title">{["求职意向：", "视频剪辑师/动画师"].map(text => <DepthText key={text} text={text} layers={34} depth={2.4} faceColor="#f8fafc" depthColor="#7c3aed" tilt={7.5} pointerTracking smoothing={0.14} perspective={900} autoOrbit orbitSpeed={0.35} fontSize="clamp(1.5rem, 2vw, 2.5rem)" fontWeight={900} shadow />)}</h2></div><BorderGlow {...profileGlow} className="basics-glow profile-glow"><div className="profile-basics"><p className="profile-label">BASIC INFORMATION</p><h2>马景悦</h2><dl><div><dt>学历</dt><dd>本科毕业于长春建筑学院</dd></div><div><dt>专业</dt><dd>影视动画</dd></div><div><dt>电话</dt><dd><a href="tel:13596185663">13596185663</a></dd></div><div><dt>邮箱</dt><dd><a href="mailto:767531672@qq.com">767531672@qq.com</a></dd></div><div><dt>微信</dt><dd>ma13596185663</dd></div></dl></div></BorderGlow>
        </aside>
        <div className="profile-main">
          <BorderGlow {...profileGlow} className="intro-glow profile-glow"><div className="profile-intro"><p className="profile-label">ABOUT ME</p><h2>自我介绍</h2><p>我是一名经验丰富的高级动画师 / 视频剪辑师，精通 AE、PS、AI、PR、3D，擅长 AI 动画、拍摄、剪辑、特效合成与视觉包装，能独立完成脚本、分镜到成片的全流程。曾任职网易、财通证券，具备互联网教育与金融行业新媒体经验，能高效产出短视频、宣传片及活动视频。懂技术、懂内容、有网感，擅长用视觉创意提升传播与品牌价值。</p></div></BorderGlow>
          <BorderGlow {...profileGlow} className="experience-glow profile-glow"><div className="experience"><p className="profile-label">EXPERIENCE</p><h2>工作经历</h2>
            <article className="job job--with-badge"><div className="job-content"><div className="job-title"><p>2020 — 2023</p><h3>网易 · 高级动画师 / 视频剪辑师</h3></div><ol><li>负责有道乐读美术课《国画》，成为乐读 App 爆款产品，<span className="experience-highlight">创造 3000 万+收益。</span></li><li>负责《创意儿童课》《手指画》构思原创视频，<span className="experience-highlight">上线 1 月内售卖 300+ 万份。</span></li><li>负责《故宫博物馆鉴赏课》之《清明上河图》课程，完成后期特效与合成；善用配音、音乐、色彩、节奏与镜头表现力，<span className="experience-highlight">营造博物馆纪录片式视觉盛宴。</span></li><li>负责新品推广《短视频》宣传，独立完成脚本、分镜、拍摄与剪辑，<span className="experience-highlight">同时打造 3—4 个 IP 账号，从 0 到 1 完成视频制作。</span></li></ol></div><WorkBadge company="netease" label="网易" /></article>
            <article className="job job--with-badge"><div className="job-content"><div className="job-title"><p>2023 — NOW</p><h3>财通证券 · 新媒体制作组高级动画师 / 视频剪辑师</h3></div><ol><li><span className="experience-highlight">负责公司线上新媒体宣传、</span>短视频、节日宣发、股市实时热点事件及各部门宣发需求制作。</li><li>负责周年庆、运动会、年会、建军节主题党日等<span className="experience-highlight">公司年度内部活动的视觉内容制作。</span></li><li><span className="experience-highlight">负责每年上交上级党委、政府部门的廉洁警示教育宣传视频</span>及反诈宣传教育视频制作。</li></ol></div><WorkBadge company="caitong" label="财通证券" /></article>
          </div></BorderGlow>
        </div>
      </div>
    </section>

    <section id="work" className="works section"><div className="shell"><div className="work-heading"><div className="section-kicker">02 / SELECTED WORK</div><h2 className="work-title"><DepthText text="作品展示" layers={34} depth={2.4} faceColor="#f8fafc" depthColor="#7c3aed" tilt={7.5} pointerTracking smoothing={0.14} perspective={900} autoOrbit orbitSpeed={0.35} fontSize="clamp(3rem, 12vw, 7rem)" fontWeight={900} shadow /><span className="work-subtitle">Selected Projects.</span></h2><p>一分钟快速了解我</p></div><div className="project-list video-accordion">{projects.map((p, i) => <article className={'project '+p.className+(activeVideo === p.no ? ' is-expanded' : '')} key={p.no} tabIndex={0} aria-label={p.title} onClick={() => setActiveVideo(p.no)} onMouseEnter={() => setActiveVideo(p.no)} onFocus={() => setActiveVideo(p.no)}><div className="video-panel-body" id={'video-panel-'+p.no}><div className={'project-art' + (p.video ? ' has-video' : '')}>{p.video ? <PortfolioVideo src={p.video} title={p.title} active={activeVideo === p.no} /> : <><div className="art-mark">{i === 0 ? '◉' : i === 1 ? '△' : '✦'}</div><button className="play" aria-label={'播放 '+p.title}>▶</button></>}<span className="project-no">{p.no}{activeVideo !== p.no && <span className="collapsed-video-title">{p.title}</span>}</span></div><div className="project-meta"><div><p>{p.tag}</p><h3>{p.title}</h3></div><p className="project-copy">{p.copy}</p><a href="#contact"><Arrow /></a></div></div></article>)}</div><section className="image-showcase" aria-labelledby="gallery-horizontal-heading"><div className="gallery-heading"><p className="section-kicker">03 / IMAGE GALLERY</p><h3 id="gallery-horizontal-heading" className="gallery-depth-title"><DepthText text="图片展示" layers={34} depth={2.4} faceColor="#f8fafc" depthColor="#7c3aed" tilt={7.5} pointerTracking smoothing={0.14} perspective={900} autoOrbit orbitSpeed={0.35} fontSize="clamp(3rem, 12vw, 7rem)" fontWeight={900} shadow /></h3></div><AccordionGallery items={galleryItems} defaultIndex={2} expandRatio={0.52} trigger="hover" height={560} gap={9} radius={15} /></section></div></section>

    <ContactSection />
  </main>
}
createRoot(document.getElementById('root')).render(<App />)
