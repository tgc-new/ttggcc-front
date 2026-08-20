'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaBars, FaTimes, FaHome, FaChevronDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteData } from '../../lib/SiteDataContext';
import { navPaletteColor } from '../../lib/colorPalette';
import ScrollingNotice from '../home/ScrollingNotice';

export default function Navbar() {
  const [mobileOpen,     setMobileOpen]     = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const pathname   = usePathname();
  const timeoutRef = useRef(null);
  const { settings, navMenus, loaded, ensureLoaded } = useSiteData();

  useEffect(() => { ensureLoaded(); }, [ensureLoaded]);
  useEffect(() => { setMobileOpen(false); setActiveDropdown(null); }, [pathname]);

  const handleEnter = label => { clearTimeout(timeoutRef.current); setActiveDropdown(label); };
  const handleLeave = ()    => { timeoutRef.current = setTimeout(() => setActiveDropdown(null), 150); };
  const isActive    = href  => href === '/' ? pathname === '/' : href !== '#' && pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 w-full shadow-md">
      {/* ── Mobile compact bar (hamburger + brand) ── */}
      <div className="theme-nav flex md:hidden items-center gap-3 px-3 py-2">
        <button aria-label="মেনু" onClick={() => setMobileOpen(o => !o)}
          className="text-white p-1.5 -ml-1 flex-shrink-0">
          {mobileOpen ? <FaTimes size={20}/> : <FaBars size={20}/>}
        </button>
        <Link href="/" className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-full bg-white/95 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {settings?.logo?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={settings.logo.url} alt="Logo" className="w-full h-full object-contain"/>
            ) : (
              <span className="text-xs font-bold" style={{ color:'var(--color-nav-bg)' }}>ম</span>
            )}
          </div>
          <span className="text-white font-semibold text-sm truncate">
            {settings?.collegeName || 'কলেজের নাম'}
          </span>
        </Link>
      </div>

      {/* ── Desktop single-row colorful nav ── */}
      <nav className="theme-nav hidden md:block">
        <div className="container mx-auto px-3">
          {!loaded ? (
            <div className="flex gap-1.5 py-2.5">
              {[...Array(8)].map((_,i) => (
                <div key={i} className="w-24 h-8 rounded bg-white/10 animate-pulse"/>
              ))}
            </div>
          ) : (
            <ul className="flex items-stretch flex-wrap">
              {/* Home — always first, distinct white pill */}
              <li>
                <Link href="/"
                  className={`flex items-center gap-1.5 px-4 py-3 text-sm font-semibold bg-white transition-opacity hover:opacity-90
                    ${isActive('/') ? '' : ''}`}
                  style={{ color:'#1f2937' }}>
                  <FaHome size={13}/> হোম
                </Link>
              </li>

              {navMenus.filter(item => item.href !== '/').map((item, idx) => {
                const color    = navPaletteColor(idx);
                const hasKids  = item.children?.filter(c => c.isActive !== false).length > 0;
                const active   = isActive(item.href);
                return (
                  <li key={item._id} className="relative"
                    onMouseEnter={() => hasKids && handleEnter(item._id)}
                    onMouseLeave={() => hasKids && handleLeave()}>
                    <Link href={item.href || '#'}
                      target={item.isExternal ? '_blank' : undefined}
                      rel={item.isExternal ? 'noopener noreferrer' : undefined}
                      className="flex items-center gap-1.5 px-4 py-3 text-sm font-medium text-white whitespace-nowrap transition-all relative"
                      style={{ background: color }}>
                      {item.labelBn || item.label}
                      {hasKids && <FaChevronDown size={9} className="mt-0.5"/>}
                      {active && <span className="absolute left-0 right-0 bottom-0 h-[3px] bg-white/90"/>}
                    </Link>
                    {hasKids && (
                      <AnimatePresence>
                        {activeDropdown === item._id && (
                          <motion.ul
                            initial={{ opacity:0, y:-8 }}
                            animate={{ opacity:1, y:0 }}
                            exit={{ opacity:0, y:-8 }}
                            transition={{ duration:0.15 }}
                            className="absolute top-full left-0 bg-white shadow-xl min-w-[220px] z-50 py-1 border-t-4 overflow-hidden rounded-b-md"
                            style={{ borderColor: color }}>
                            {item.children.filter(c=>c.isActive!==false).sort((a,b)=>a.order-b.order).map(child => (
                              <li key={child._id || child.labelBn}>
                                <Link href={child.href || '#'}
                                  target={child.isExternal ? '_blank' : undefined}
                                  rel={child.isExternal ? 'noopener noreferrer' : undefined}
                                  className="dropdown-item flex items-center gap-2 text-sm">
                                  <span style={{ color }}>▸</span>
                                  {child.labelBn || child.label}
                                </Link>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    )}
                  </li>
                );
              })}

              {/* Login — always last, fixed dark pill */}
              <li className="ml-auto">
                <Link href="/admin/login"
                  className="flex items-center gap-1.5 px-4 py-3 text-sm font-semibold text-white whitespace-nowrap transition-opacity hover:opacity-90"
                  style={{ background:'#37474F' }}>
                  লগইন
                </Link>
              </li>
            </ul>
          )}
        </div>
      </nav>

      {/* ── Scrolling notice marquee (below nav, above hero) ── */}
      <ScrollingNotice/>

      {/* ── Mobile drawer menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity:0, height:0 }}
            animate={{ opacity:1, height:'auto' }}
            exit={{ opacity:0, height:0 }}
            className="md:hidden bg-white border-b shadow-lg overflow-hidden max-h-[75vh] overflow-y-auto">
            <ul className="py-1">
              <li>
                <Link href="/"
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b border-gray-100 ${isActive('/') ? 'text-white' : 'text-gray-700'}`}
                  style={isActive('/') ? { background:'var(--color-nav-bg)' } : {}}>
                  <FaHome size={13}/> হোম
                </Link>
              </li>
              {navMenus.filter(item => item.href !== '/').map((item, idx) => (
                <li key={item._id}>
                  <Link href={item.href || '#'}
                    className={`block px-5 py-3 text-sm font-medium border-b border-gray-100 transition-colors ${isActive(item.href) ? 'text-white' : 'text-gray-700 hover:bg-gray-50'}`}
                    style={isActive(item.href) ? { background: navPaletteColor(idx) } : {}}>
                    {item.labelBn || item.label}
                  </Link>
                  {item.children?.filter(c=>c.isActive!==false).length > 0 && (
                    <ul className="bg-gray-50 border-b">
                      {item.children.filter(c=>c.isActive!==false).sort((a,b)=>a.order-b.order).map(child => (
                        <li key={child._id || child.labelBn}>
                          <Link href={child.href || '#'}
                            className="block pl-8 pr-4 py-2.5 text-sm text-gray-600 hover:text-primary border-b border-gray-100 transition-colors">
                            › {child.labelBn || child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
              <li className="px-4 py-3">
                <Link href="/admin/login" className="block w-full text-center py-2.5 rounded-md text-sm font-semibold text-white"
                  style={{ background:'#37474F' }}>
                  অ্যাডমিন লগইন
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
