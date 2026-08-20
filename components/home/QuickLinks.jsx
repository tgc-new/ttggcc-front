'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { FaLink, FaCaretRight } from 'react-icons/fa';
import { useSiteData } from '../../lib/SiteDataContext';

export default function QuickLinks() {
  const { quickLinksImportant, loaded, ensureLoaded } = useSiteData();
  useEffect(() => { ensureLoaded(); }, [ensureLoaded]);

  return (
    <div className="card overflow-hidden">
      <div className="section-title">
        <FaLink size={13}/>
        <span>Important Links</span>
      </div>
      <ul className="divide-y divide-gray-100">
        {!loaded ? (
          [...Array(6)].map((_,i) => (
            <li key={i} className="px-4 py-2.5 flex items-center gap-3">
              <div className="w-3 h-3 skeleton rounded-full flex-shrink-0"/>
              <div className="skeleton-text w-36 h-3 flex-1"/>
            </li>
          ))
        ) : quickLinksImportant.length === 0 ? (
          <li className="px-4 py-3 text-xs text-gray-400">কোনো লিংক নেই</li>
        ) : (
          quickLinksImportant.map(l => (
            <li key={l._id}>
              {l.isExternal ? (
                <a href={l.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors">
                  <FaCaretRight className="text-green-600 flex-shrink-0" size={12}/>
                  <span className="text-sm truncate hover:underline" style={{ color:'#1565C0' }}>{l.labelBn || l.label}</span>
                </a>
              ) : (
                <Link href={l.url}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors">
                  <FaCaretRight className="text-green-600 flex-shrink-0" size={12}/>
                  <span className="text-sm truncate hover:underline" style={{ color:'#1565C0' }}>{l.labelBn || l.label}</span>
                </Link>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
