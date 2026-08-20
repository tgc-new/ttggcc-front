'use client';
import { useEffect, useRef, useState } from 'react';
import { FaMapMarkerAlt, FaExternalLinkAlt } from 'react-icons/fa';
import { useSiteData } from '../../lib/SiteDataContext';

const DEFAULT_EMBED = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3648.3!2d90.5!3d23.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDM2JzAwLjAiTiA5MMKwMzAnMDAuMCJF!5e0!3m2!1sen!2sbd!4v1234567890`;

// The Google Maps embed is one of the heaviest third-party assets a page can
// load (its own JS/tiles run into the hundreds of KB). We keep it out of the
// page entirely until the section actually scrolls into view, so it never
// competes with text/hero content for bandwidth on initial load.
export default function LocationMap() {
  const { settings, ensureLoaded } = useSiteData();
  const [shouldLoad, setShouldLoad] = useState(false);
  const ref = useRef(null);

  useEffect(() => { ensureLoaded(); }, [ensureLoaded]);

  useEffect(() => {
    if (!ref.current || shouldLoad) return;
    const obs = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) setShouldLoad(true); },
      { rootMargin: '300px' }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [shouldLoad]);

  const mapsSearchUrl = `https://maps.google.com/?q=${encodeURIComponent(settings?.address || settings?.collegeName || 'Malkhanagar College')}`;

  return (
    <section ref={ref}>
      <div className="card overflow-hidden">
        <div className="section-title">
          <FaMapMarkerAlt className="text-yellow-300" size={16}/>
          <span>Our Location</span>
        </div>
        <div className="p-3">
          <a href={mapsSearchUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white border border-gray-200 shadow-sm text-sm font-medium px-4 py-2 rounded-md hover:shadow-md transition-shadow"
            style={{ color:'#1565C0' }}>
            Open in Maps <FaExternalLinkAlt size={11}/>
          </a>
        </div>
        <div className="relative" style={{ height: 340 }}>
          {shouldLoad ? (
            <iframe
              src={settings?.googleMapEmbed || DEFAULT_EMBED}
              width="100%" height="340"
              style={{ border:0, display:'block' }}
              allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="College Location"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center gap-2 text-gray-400">
              <FaMapMarkerAlt size={28}/>
              <span className="text-xs">মানচিত্র লোড হচ্ছে…</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
