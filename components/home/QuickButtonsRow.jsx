'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import {
  FaChalkboardTeacher, FaSitemap, FaUserTie, FaUsersCog, FaUserPlus,
  FaGraduationCap, FaUniversity, FaEdit, FaChartBar, FaBullhorn,
  FaBook, FaLaptop, FaCalendarAlt, FaImages, FaLink, FaFileAlt,
  FaUsers, FaDownload, FaGlobe, FaHandshake, FaPhone, FaEnvelope,
  FaMapMarkerAlt, FaInfoCircle, FaClipboardList, FaBuilding,
} from 'react-icons/fa';
import { useSiteData } from '../../lib/SiteDataContext';
import { paletteColor } from '../../lib/colorPalette';

const ICONS = {
  FaChalkboardTeacher, FaSitemap, FaUserTie, FaUsersCog, FaUserPlus,
  FaGraduationCap, FaUniversity, FaEdit, FaChartBar, FaBullhorn,
  FaBook, FaLaptop, FaCalendarAlt, FaImages, FaLink, FaFileAlt,
  FaUsers, FaDownload, FaGlobe, FaHandshake, FaPhone, FaEnvelope,
  FaMapMarkerAlt, FaInfoCircle, FaClipboardList, FaBuilding,
};

// Shown until the admin adds real entries under quicklinks → "হোমপেজ মেনু গ্রিড" (section: 'home')
const FALLBACK = [
  { labelBn:'শিক্ষক পরিষদ',        url:'/teachers',  icon:'FaChalkboardTeacher', isExternal:false },
  { labelBn:'অর্গানোগ্রাম',          url:'/about',     icon:'FaSitemap',           isExternal:false },
  { labelBn:'শিক্ষকবৃন্দ',           url:'/teachers',  icon:'FaUserTie',           isExternal:false },
  { labelBn:'পরিচালনা পর্ষদ',       url:'/committee', icon:'FaUsersCog',          isExternal:false },
  { labelBn:'ভর্তি আবেদন',          url:'/admission', icon:'FaUserPlus',          isExternal:false },
  { labelBn:'উচ্চ মাধ্যমিক',        url:'/academic',  icon:'FaGraduationCap',     isExternal:false },
  { labelBn:'স্নাতক (পাস)',         url:'/admission', icon:'FaUniversity',        isExternal:false },
  { labelBn:'ফর্ম ফিলাপ',           url:'/exam',      icon:'FaEdit',              isExternal:false },
  { labelBn:'পরীক্ষার ফলাফল',       url:'/exam',      icon:'FaChartBar',          isExternal:false },
  { labelBn:'নোটিশ বোর্ড',          url:'/notice',    icon:'FaBullhorn',          isExternal:false },
  { labelBn:'গ্রন্থাগার',            url:'/about',     icon:'FaBook',              isExternal:false },
  { labelBn:'ই-লাইব্রেরি',           url:'#',          icon:'FaLaptop',            isExternal:false },
  { labelBn:'একাডেমিক ক্যালেন্ডার', url:'/academic',  icon:'FaCalendarAlt',       isExternal:false },
  { labelBn:'ফটো গ্যালারি',         url:'/gallery',   icon:'FaImages',            isExternal:false },
];

export default function QuickButtonsRow() {
  const { quickLinksHome, loaded, ensureLoaded } = useSiteData();
  useEffect(() => { ensureLoaded(); }, [ensureLoaded]);

  const items = loaded && quickLinksHome.length > 0 ? quickLinksHome : FALLBACK;

  if (!loaded) {
    return (
      <div className="flex flex-wrap gap-2 mb-4">
        {[...Array(10)].map((_,i) => <div key={i} className="skeleton h-10 w-28 flex-shrink-0"/>)}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {items.map((item, idx) => {
        const Icon = ICONS[item.icon] || FaLink;
        const label = item.labelBn || item.label;
        const key = item._id || label;
        const className = "flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white whitespace-nowrap transition-transform hover:-translate-y-0.5 hover:shadow-md";
        const style = { background: paletteColor(idx), borderRadius:'var(--border-radius)' };
        return item.isExternal ? (
          <a key={key} href={item.url} target="_blank" rel="noopener noreferrer" className={className} style={style}>
            <Icon size={13}/> {label}
          </a>
        ) : (
          <Link key={key} href={item.url || '#'} className={className} style={style}>
            <Icon size={13}/> {label}
          </Link>
        );
      })}
    </div>
  );
}
