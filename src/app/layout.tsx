import Script from "next/script";
import ReduxProvider from "./ReduxProvider";
import "./globals.css";

export const metadata = {
  title: "부엉이 개발자 블로그",
  description: "CTO가 되고픈 부엉이 블로그 입니다",
  openGraph: {
    url: "https://www.owl-dev.me",
    title: "부엉이 개발자 블로그",
    description: "CTO가 되고픈 부엉이 블로그 입니다",
    images: [
      {
        url: "https://www.owl-dev.me/img/owl.svg",
        width: 800,
        height: 600,
      },
    ],
  },
  verification: {
    google: "sxi1RDD-x-R6U-lHMRiV2kEtt-m7NVfNAaK-JoPyzTA",
    naver: "857ab4a6de4aa0b0ddd2df29bcd1fb3129fe9198",
  },
};


function FontLinks() {
  return (
    <>
      <link 
        href="https://fonts.googleapis.com/css?family=Nanum+Gothic+Coding:400|Nanum+Gothic:400|Montserrat:wght@300;500;600&display=swap" 
        rel="stylesheet" 
      />
    </>
  );
}


function ExternalScripts() {
  const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID || '';
  const NAVER_MAP_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID || '';

  return (
    <>
      {/* External Scripts */}
      <Script src="https://code.jquery.com/jquery-3.6.1.slim.min.js" strategy="lazyOnload" />
      <Script 
        src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" 
        strategy="lazyOnload" />
      <Script 
        src="https://kit.fontawesome.com/3ec141240c.js" 
        strategy="lazyOnload" />
      <Script 
        src="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js" 
        strategy="lazyOnload" />
      <Script 
        src="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote.min.js" 
        strategy="lazyOnload" />
      {/* Google Analytics */}
      <Script 
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} 
        strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_TRACKING_ID}', {
            page_path: window.location.pathname,
          });
        `}</Script>
      {/* Google AdSense */}
      <Script 
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2309486098831986" 
        strategy="afterInteractive" 
        crossOrigin="anonymous" />
      {/* Naver Map */}
      <Script 
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${NAVER_MAP_CLIENT_ID}`} 
        strategy="lazyOnload" />
    </>
  );
}


export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ko">
      <head>
        <FontLinks />
      </head>
      <body>
        <ReduxProvider>
          {children}
        </ReduxProvider>
        <div id="root-modal" />
        <ExternalScripts />
      </body>
    </html>
  );
}