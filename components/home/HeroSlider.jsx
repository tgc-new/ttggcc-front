'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { galleryAPI } from '../../lib/api';
import { useSiteData } from '../../lib/SiteDataContext';

// A different transition style per slide (cycles if there are more slides
// than variants) so the slider doesn't feel repetitive — fade/zoom, slide
// from each side, and zoom-out all rotate through automatically.
const SLIDE_VARIANTS = [
  { initial:{ opacity:0, scale:1.08 },        animate:{ opacity:1, scale:1, x:0, y:0 }, exit:{ opacity:0, scale:1.04 } },          // fade + zoom in
  { initial:{ opacity:0, x:'14%' },           animate:{ opacity:1, scale:1, x:0, y:0 }, exit:{ opacity:0, x:'-10%' } },            // slide from right
  { initial:{ opacity:0, scale:1.2 },         animate:{ opacity:1, scale:1, x:0, y:0 }, exit:{ opacity:0, scale:0.94 } },          // zoom out
  { initial:{ opacity:0, x:'-14%' },          animate:{ opacity:1, scale:1, x:0, y:0 }, exit:{ opacity:0, x:'10%' } },             // slide from left
  { initial:{ opacity:0, y:'12%' },           animate:{ opacity:1, scale:1, x:0, y:0 }, exit:{ opacity:0, y:'-8%' } },             // slide up from bottom
  { initial:{ opacity:0, y:'-12%', scale:1.05 }, animate:{ opacity:1, scale:1, x:0, y:0 }, exit:{ opacity:0, y:'8%' } },           // slide down + zoom
];

export default function HeroSlider() {
  const [slides,        setSlides]        = useState([]);
  const [current,       setCurrent]       = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [loading,       setLoading]       = useState(true);
  const { settings, ensureLoaded } = useSiteData();

  useEffect(() => { ensureLoaded(); }, [ensureLoaded]);

  useEffect(() => {
    galleryAPI.getAll({ isSlider: true, limit: 8 })
      .then(r => { if (r.data?.length > 0) setSlides(r.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const next = useCallback(() => setCurrent(c => (c+1) % Math.max(slides.length,1)), [slides.length]);
  const prev = useCallback(() => setCurrent(c => (c-1+Math.max(slides.length,1)) % Math.max(slides.length,1)), [slides.length]);

  useEffect(() => {
    if (!isAutoPlaying || slides.length === 0) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [isAutoPlaying, next, slides.length]);

  const BrandOverlay = () => (
    <div className="absolute bottom-0 left-0 right-0 px-4 md:px-8 pb-4 md:pb-6 pt-14 z-10"
      style={{ background:'linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.15) 70%, transparent)' }}>
      <div className="flex items-center gap-3 md:gap-4">
        {settings?.logo?.url && (
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white flex-shrink-0 overflow-hidden shadow-lg p-0.5">
            <Image src={settings.logo.url} alt="Logo" width={64} height={64} className="w-full h-full object-contain rounded-full"/>
          </div>
        )}
        <div className="min-w-0">
          <h1 className="text-white text-xl md:text-3xl font-bold drop-shadow-lg leading-tight truncate">
            {settings?.collegeName || 'কলেজের নাম'}
          </h1>
          {settings?.address && (
            <p className="text-white/90 text-xs md:text-sm mt-0.5 truncate">{settings.address}</p>
          )}
          {(settings?.eiinNumber || settings?.mpoNumber) && (
            <p className="text-white/80 text-xs mt-0.5 font-medium">
              {settings?.eiinNumber && <>EIIN: {settings.eiinNumber}</>}
              {settings?.eiinNumber && settings?.mpoNumber && <span className="mx-2">|</span>}
              {settings?.mpoNumber && <>MPO: {settings.mpoNumber}</>}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  // No slider images configured yet — show a themed fallback banner
  if (!loading && slides.length === 0) {
    return (
      <div className="relative bg-gradient-to-br from-primary-900 via-primary to-green-700 flex items-end overflow-hidden"
        style={{ height: '400px' }}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3"/>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3"/>
        <BrandOverlay/>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gray-900 w-full"
      style={{ height: '400px' }}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}>
      <AnimatePresence mode="wait">
        <motion.div key={current}
          initial={SLIDE_VARIANTS[current % SLIDE_VARIANTS.length].initial}
          animate={SLIDE_VARIANTS[current % SLIDE_VARIANTS.length].animate}
          exit={SLIDE_VARIANTS[current % SLIDE_VARIANTS.length].exit}
          transition={{ duration:0.7, ease:'easeInOut' }}
          className="absolute inset-0">
          {slides[current]?.image?.url ? (
            <Image
              src={slides[current].image.url}
              alt={slides[current].title || 'College Banner'}
              fill priority
              className="object-cover"
              sizes="100vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-900 to-primary"/>
          )}
        </motion.div>
      </AnimatePresence>

      <BrandOverlay/>

      {slides.length > 1 && (
        <>
          <button onClick={prev} aria-label="আগের ছবি"
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/25 hover:bg-white/40 backdrop-blur-sm text-white p-2.5 rounded-full transition-all z-20 border border-white/30">
            <FaChevronLeft size={16}/>
          </button>
          <button onClick={next} aria-label="পরের ছবি"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/25 hover:bg-white/40 backdrop-blur-sm text-white p-2.5 rounded-full transition-all z-20 border border-white/30">
            <FaChevronRight size={16}/>
          </button>
          <div className="absolute bottom-28 md:bottom-32 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {slides.map((_,i)=>(
              <button key={i} aria-label={`স্লাইড ${i+1}`} onClick={()=>setCurrent(i)}
                className={`transition-all duration-300 rounded-full ${i===current?'bg-white w-7 h-2.5':'bg-white/50 w-2.5 h-2.5'}`}/>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
