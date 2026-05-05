import '../styles/globals.css'
import Head from 'next/head'
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Gochi_Hand, Baloo_2 } from 'next/font/google';

const gochiHand = Gochi_Hand({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-gochi',
  display: 'swap',
});

const baloo2 = Baloo_2({ 
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-baloo',
  display: 'swap',
});

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>STEAM Workshop</title>
        <link rel="icon" type="image/svg+xml" href="/logo.svg" />
        <link rel="alternate icon" href="/logo.svg" />
      </Head>

      <div className={`${gochiHand.variable} ${baloo2.variable}`}>
        <Component {...pageProps} />
      </div>

      <SpeedInsights />
    </>
  )
}