'use client';
import { createContext, useContext, useState, useRef, useCallback } from 'react';
import { settingsAPI, navMenuAPI, scrollingAPI, quickLinkAPI } from './api';

const SiteDataContext = createContext(null);

/**
 * Shared site-wide data: settings, nav menus, scrolling notices, quick links.
 * Many components across the site need `settings` (college name, logo, EIIN,
 * contact info...) and previously each one fetched it independently — on the
 * homepage alone that meant the same /api/settings request firing 5-6 times.
 *
 * This context fetches everything ONCE (first consumer to mount triggers it,
 * via ensureLoaded()) and every other consumer just reads the shared result.
 * Because the provider lives in the root layout, the data also survives
 * client-side navigation between pages — no re-fetch flicker on route change.
 */
export function useSiteData() {
  const ctx = useContext(SiteDataContext);
  if (!ctx) {
    // Safe fallback if a component is ever rendered outside the provider.
    return { settings:null, navMenus:[], scrollTexts:[], quickLinksImportant:[], quickLinksFooter:[], quickLinksHome:[], loaded:false, ensureLoaded:()=>{} };
  }
  return ctx;
}

export function SiteDataProvider({ children }) {
  const [data, setData] = useState({
    settings: null,
    navMenus: [],
    scrollTexts: [],
    quickLinksImportant: [],
    quickLinksFooter: [],
    quickLinksHome: [],
  });
  const [loaded, setLoaded] = useState(false);
  const requested = useRef(false);

  const ensureLoaded = useCallback(() => {
    if (requested.current) return;
    requested.current = true;

    Promise.allSettled([
      settingsAPI.get(),
      navMenuAPI.getAll(),
      scrollingAPI.getAll(),
      quickLinkAPI.getAll({ section: 'important' }),
      quickLinkAPI.getAll({ section: 'footer' }),
      quickLinkAPI.getAll({ section: 'home' }),
    ]).then(([s, n, sc, qi, qf, qh]) => {
      setData({
        settings:            s.status  === 'fulfilled' ? s.value.data        : null,
        navMenus:            n.status  === 'fulfilled' ? (n.value.data  || []) : [],
        scrollTexts:         sc.status === 'fulfilled' ? (sc.value.data || []) : [],
        quickLinksImportant: qi.status === 'fulfilled' ? (qi.value.data || []) : [],
        quickLinksFooter:    qf.status === 'fulfilled' ? (qf.value.data || []) : [],
        quickLinksHome:      qh.status === 'fulfilled' ? (qh.value.data || []) : [],
      });
      setLoaded(true);
    });
  }, []);

  const refresh = useCallback(() => {
    requested.current = false;
    ensureLoaded();
  }, [ensureLoaded]);

  return (
    <SiteDataContext.Provider value={{ ...data, loaded, ensureLoaded, refresh }}>
      {children}
    </SiteDataContext.Provider>
  );
}
