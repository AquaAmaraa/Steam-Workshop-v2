import '../styles/globals.css'
import Head from 'next/head'
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LanguageProvider } from '../context/LanguageContext';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>STEAM Workshop</title>
        <link rel="icon" type="image/png" href="/steam.png" />
        <link rel="alternate icon" href="/steam.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&family=Gochi+Hand&family=Noto+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <LanguageProvider>
        <div className="overflow-x-hidden">
          <Component {...pageProps} />
        </div>
      </LanguageProvider>

      <SpeedInsights />
    </>
  )
}
