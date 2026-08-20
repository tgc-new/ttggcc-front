import { Hind_Siliguri, Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '../lib/ThemeContext';
import { SiteDataProvider } from '../lib/SiteDataContext';

const hindSiliguri = Hind_Siliguri({
  weight: ['300','400','500','600','700'],
  subsets: ['bengali','latin'],
  variable: '--font-bangla',
  display: 'swap',
});
const poppins = Poppins({
  weight: ['300','400','500','600','700'],
  subsets: ['latin'],
  variable: '--font-english',
  display: 'swap',
});

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Server-rendered metadata: fetched once per request/build directly from the
// API (plain fetch, not the axios client, so Next.js can cache/revalidate
// it). Falls back to sensible defaults if the API is unreachable so a slow
// or down backend never breaks the build or the page.
export async function generateMetadata() {
  const fallback = {
    title: 'মালখানগর কলেজ - অফিসিয়াল ওয়েবসাইট',
    description: 'মালখানগর কলেজের অফিসিয়াল ওয়েবসাইট — নোটিশ, ভর্তি তথ্য, ফলাফল ও একাডেমিক তথ্যাদি।',
  };
  try {
    const res = await fetch(`${API_URL}/api/settings`, { next: { revalidate: 300 } });
    if (!res.ok) return fallback;
    const body = await res.json();
    const s = body?.data;
    if (!s) return fallback;
    return {
      title: s.collegeName ? `${s.collegeName} - অফিসিয়াল ওয়েবসাইট` : fallback.title,
      description: s.metaDescription || s.tagline || fallback.description,
      keywords: s.metaKeywords || undefined,
      icons: s.favicon?.url ? { icon: s.favicon.url } : undefined,
    };
  } catch {
    return fallback;
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="bn" className={`${hindSiliguri.variable} ${poppins.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link rel="preconnect" href="https://res.cloudinary.com"/>
        <link rel="preconnect" href={API_URL}/>
        <link rel="dns-prefetch" href={API_URL}/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <SiteDataProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: { fontFamily:'Hind Siliguri,sans-serif', fontSize:'14px' },
                success: { style: { background:'#1a6b3c', color:'#fff' } },
                error:   { style: { background:'#c41e3a', color:'#fff' } },
              }}
            />
            {children}
          </SiteDataProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
