'use client';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Navbar      from '../components/layout/Navbar';
import Footer      from '../components/layout/Footer';
import NoticeBoard from '../components/home/NoticeBoard';
import PrincipalMessage from '../components/home/PrincipalMessage';
import QuickLinks  from '../components/home/QuickLinks';
import CalendarWidget from '../components/home/CalendarWidget';
import HotlineWidget from '../components/home/HotlineWidget';
import HomeMenuGrid from '../components/home/HomeMenuGrid';
import QuickButtonsRow from '../components/home/QuickButtonsRow';
import LocationMap from '../components/home/LocationMap';
import { useSiteData } from '../lib/SiteDataContext';

// Images load after text — dynamically imported so their code and the
// pictures they fetch are not part of the initial bundle/paint at all.
const HeroSlider     = dynamic(() => import('../components/home/HeroSlider'),     { ssr: false, loading: () => <div className="bg-gray-200 animate-pulse" style={{ height:'400px' }}/> });
const GalleryPreview = dynamic(() => import('../components/home/GalleryPreview'), { ssr: false, loading: () => <div className="skeleton rounded-xl h-40"/> });

export default function HomePage() {
  const { settings, ensureLoaded } = useSiteData();

  useEffect(() => { ensureLoaded(); }, [ensureLoaded]);
  useEffect(() => {
    if (settings?.collegeName) document.title = `${settings.collegeName} - অফিসিয়াল ওয়েবসাইট`;
  }, [settings]);

  return (
    <>
      <Navbar/>
      <main>
        {/* Hero image — lazy, loads after the text-only chrome above it */}
        <HeroSlider/>

        <div className="container mx-auto px-3 md:px-4 py-4 space-y-4">
          {/* Colorful quick-link buttons — plain text/CSS, paints instantly */}
          <QuickButtonsRow/>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left column: notices + 10-category info grid */}
            <div className="lg:col-span-2 space-y-4">
              <NoticeBoard/>
              <HomeMenuGrid/>
            </div>
            {/* Right sidebar */}
            <div className="space-y-4">
              <PrincipalMessage type="principal"/>
              <PrincipalMessage type="chairman"/>
              <QuickLinks/>
              <CalendarWidget/>
              <HotlineWidget/>
            </div>
          </div>

          {/* Gallery — lazy loaded images */}
          <GalleryPreview/>

          {/* Map — iframe deferred until scrolled near */}
          <LocationMap/>
        </div>
      </main>
      <Footer/>
    </>
  );
}
