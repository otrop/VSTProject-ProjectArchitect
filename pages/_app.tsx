import type { AppProps } from 'next/app'
import Head from 'next/head'
import '@/styles/globals.css'
import Navigation from '@/components/Navigation'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="preload" href="/font/AP-Regular.otf" as="font" type="font/otf" crossOrigin="" />
        <link rel="preload" href="/font/AP-Medium.otf" as="font" type="font/otf" crossOrigin="" />
        <link rel="preload" href="/font/AP-Bold.otf" as="font" type="font/otf" crossOrigin="" />
      </Head>
      <Navigation />
      <Component {...pageProps} />
    </>
  )
}