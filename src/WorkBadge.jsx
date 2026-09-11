import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react';
import badgeAssets from './badge-assets.json';
const Lanyard = lazy(() => import('./Lanyard'));

class BadgeBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

export default function WorkBadge({ company, label }) {
  const assets = badgeAssets[company];
  const root = useRef(null);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(false);
  useEffect(() => {
    let intersects = false;
    const update = () => setActive(intersects && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      intersects = entry.isIntersecting;
      if (intersects) setReady(true);
      update();
    }, { rootMargin: '120px' });
    observer.observe(root.current);
    document.addEventListener('visibilitychange', update);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); };
  }, []);
  const fallback = <img className="work-badge-fallback" src={assets.front} alt={`${label} · 马景悦工作挂牌`} />;
  return <div ref={root} className={`work-badge work-badge--${company}`} role="group" aria-label={`${label}工作挂牌，可拖动摆动`}>
    <div className="work-badge-stage"><BadgeBoundary fallback={fallback}><Suspense fallback={fallback}>
      {ready ? <Lanyard key={assets.front} position={[0, 0, 24]} fov={12} gravity={[0, -40, 0]} frontImage={assets.front} backImage={assets.back} imageFit="cover" lanyardImage={assets.band} lanyardWidth={1} active={active} /> : fallback}
    </Suspense></BadgeBoundary></div>
    <span className="work-badge-hint">拖动挂牌</span>
  </div>;
}



