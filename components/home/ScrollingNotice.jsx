'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { FaBullhorn } from 'react-icons/fa';
import { useSiteData } from '../../lib/SiteDataContext';

export default function ScrollingNotice() {
  const { settings, scrollTexts, loaded, ensureLoaded } = useSiteData();
  useEffect(() => { ensureLoaded(); }, [ensureLoaded]);

  if (!loaded) {
    return <div className="h-9 md:h-10 bg-gray-100 animate-pulse"/>;
  }

  const active = settings?.isScrollingActive !== false;
  const text = scrollTexts.length > 0
    ? scrollTexts.map(t => t.text).join('   ✦   ')
    : (settings?.scrollingNotice || '');

  if (!active || !text) return null;

  return (
    <div className="flex items-stretch text-sm" style={{ background:'linear-gradient(90deg,#0D47A1,#1565C0)' }}>
      <div className="flex items-center gap-1.5 px-3 md:px-4 flex-shrink-0 font-bold"
        style={{ background:'#FFD600', color:'#1A237E' }}>
        <FaBullhorn size={13}/>
        <span className="hidden sm:inline">সংবাদ</span>
      </div>
      <div className="flex-1 min-w-0 overflow-hidden flex items-center px-3">
        <div className="notice-scroll-wrapper w-full">
          <span className="notice-scroll-content text-white font-medium">
            {text}&nbsp;&nbsp;✦&nbsp;&nbsp;{text}
          </span>
        </div>
      </div>
      <Link href="/notice"
        className="flex items-center px-3 md:px-4 flex-shrink-0 font-bold whitespace-nowrap hover:opacity-90 transition-opacity"
        style={{ background:'#FFD600', color:'#1A237E' }}>
        সব দেখুন »
      </Link>
    </div>
  );
}
