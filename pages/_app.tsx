import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'

declare global {
  interface Window {
    kakao: any;
  }
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>클다방</title>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500&family=Roboto:wght@300;400&display=swap" rel="stylesheet"/>
        <link href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" rel="stylesheet"/>
      </Head>
      <Component {...pageProps} />
    </>
  )
}
