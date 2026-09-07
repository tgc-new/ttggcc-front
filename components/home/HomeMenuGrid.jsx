import Link from 'next/link';
import {
  FaLandmark, FaUserTie, FaMobileAlt, FaClipboardList, FaChartBar,
  FaFileSignature, FaCamera, FaCloudDownloadAlt, FaLaptop, FaTheaterMasks,
  FaCaretRight,
} from 'react-icons/fa';

const menuSections = [
  {
    title:'প্রতিষ্ঠান পরিচিতি', color:'#6A1B9A', icon:FaLandmark,
    items:[
      { label:'কলেজের ইতিহাস',     href:'/about' },
      { label:'মিশন ও ভিশন',        href:'/about#vision' },
      { label:'সুযোগ-সুবিধা',       href:'/about#facilities' },
      { label:'সাফল্যসমূহ',         href:'/about#achievements' },
      { label:'শিক্ষক পরিষদ',       href:'/teachers' },
      { label:'অর্গানোগ্রাম',        href:'/about#organogram' },
      { label:'পরিচালনা পর্ষদ',     href:'/committee' },
      { label:'অধ্যক্ষের বাণী',     href:'/about#chairman' },
      { label:'স্টাফ ও কর্মচারী',   href:'/staff' },
    ]
  },
  {
    title:'প্রশাসন', color:'#1565C0', icon:FaUserTie,
    items:[
      { label:'শিক্ষকবৃন্দ',        href:'/teachers' },
      { label:'পরিচালনা পর্ষদ',     href:'/committee' },
      { label:'শিক্ষক প্রশিক্ষণ',   href:'/about#training' },
      { label:'ক্লাব ব্যবস্থাপনা',  href:'/contact' },
    ]
  },
  {
    title:'একাডেমিক', color:'#00695C', icon:FaMobileAlt,
    items:[
      { label:'উচ্চ মাধ্যমিক রুটিন', href:'/exam#routine' },
      { label:'স্নাতক (পাস)',         href:'/admission' },
      { label:'স্নাতক (সম্মান)',      href:'/admission' },
      { label:'বিভাগসমূহ',            href:'/academic#departments' },
      { label:'প্রোগ্রামসমূহ',        href:'/academic#programs' },
      { label:'সিলেবাস',               href:'/academic#syllabus' },
      { label:'একাডেমিক ক্যালেন্ডার', href:'/academic#calendar' },
    ]
  },
  {
    title:'ভর্তি', color:'#E65100', icon:FaClipboardList,
    items:[
      { label:'অনলাইনে আবেদন',   href:'/admission' },
      { label:'উচ্চ মাধ্যমিক ভর্তি', href:'/admission' },
      { label:'স্নাতক ভর্তি',       href:'/admission' },
      { label:'স্নাতক পাস ভর্তি',  href:'/admission' },
      { label:'ভর্তির শর্তাবলী',    href:'/admission#eligibility' },
      { label:'ভর্তির পদ্ধতি',      href:'/admission#process' },
    ]
  },
  {
    title:'পরীক্ষা ও ফলাফল', color:'#C62828', icon:FaChartBar,
    items:[
      { label:'অভ্যন্তরীণ এডমিট কার্ড', href:'/exam#admit' },
      { label:'অভ্যন্তরীণ ফলাফল',        href:'/exam#results' },
      { label:'উচ্চ মাধ্যমিক ফলাফল',     href:'/exam#public' },
      { label:'স্নাতক পাস ফলাফল',        href:'/exam#public' },
      { label:'স্নাতক ফলাফল',            href:'/exam#public' },
    ]
  },
  {
    title:'ফর্ম পূরণ', color:'#4527A0', icon:FaFileSignature,
    items:[
      { label:'এইচএসসি ফর্ম',    href:'/exam' },
      { label:'স্নাতক পাস ফর্ম', href:'/admission' },
      { label:'স্নাতক ফর্ম',      href:'/admission' },
    ]
  },
  {
    title:'গ্যালারি', color:'#558B2F', icon:FaCamera,
    items:[
      { label:'ফটো গ্যালারি',  href:'/gallery' },
      { label:'ভিডিও গ্যালারি', href:'/gallery?category=video' },
      { label:'ইভেন্টসমূহ',     href:'/gallery?category=event' },
    ]
  },
  {
    title:'ডাউনলোড ও সেবা', color:'#37474F', icon:FaCloudDownloadAlt,
    items:[
      { label:'ফর্ম ডাউনলোড',      href:'/notice' },
      { label:'সিটিজেন চার্টার',   href:'/about' },
      { label:'নোটিশ বোর্ড',        href:'/notice' },
      { label:'অফিস আদেশ',          href:'/notice' },
    ]
  },
  {
    title:'অনলাইন শিক্ষা', color:'#0277BD', icon:FaLaptop,
    items:[
      { label:'EasyCollegeMate', href:'#' },
      { label:'ই-লাইব্রেরি',      href:'#' },
      { label:'গ্রন্থাগার',        href:'/about' },
      { label:'ইউটিউব লিংক',      href:'#' },
    ]
  },
  {
    title:'সহশিক্ষা কার্যক্রম', color:'#1B5E20', icon:FaTheaterMasks,
    items:[
      { label:'ক্লাব ব্যবস্থাপনা', href:'/contact' },
      { label:'শিক্ষক প্রশিক্ষণ',  href:'/about#training' },
      { label:'বিএনসিসি',           href:'/contact' },
      { label:'রোভার স্কাউটস',      href:'/contact' },
    ]
  },
];

export default function HomeMenuGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {menuSections.map(({ title, color, icon:Icon, items }) => (
        <div key={title} className="card overflow-hidden">
          <div className="text-white px-4 py-2.5 flex items-center gap-2" style={{ background: color }}>
            <Icon size={14} className="flex-shrink-0"/>
            <span className="text-sm font-semibold truncate">{title}</span>
          </div>
          <ul className="divide-y divide-gray-100">
            {items.map(({ label, href }) => (
              <li key={label}>
                {href.startsWith('http') ? (
                  <a href={href} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition-colors">
                    <FaCaretRight className="text-green-600 flex-shrink-0" size={12}/>
                    <span className="line-clamp-1 hover:underline" style={{ color:'#1565C0' }}>{label}</span>
                  </a>
                ) : (
                  <Link href={href}
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition-colors">
                    <FaCaretRight className="text-green-600 flex-shrink-0" size={12}/>
                    <span className="line-clamp-1 hover:underline" style={{ color:'#1565C0' }}>{label}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
