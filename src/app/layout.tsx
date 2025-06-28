import Script from "next/script";
import ReduxProvider from "./ReduxProvider";
import StyledComponentsRegistry from "./registry";
import "./globals.css";
import TempSaveToast from "./components/toast/TempSaveToast";

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


function Links() {
	return (
		<>
			<link
				href="https://fonts.googleapis.com/css?family=Nanum+Gothic+Coding:400|Nanum+Gothic:400|Montserrat:wght@300;500;600&display=swap"
				rel="stylesheet"
			/>
			{/* favIcon */}
			<link rel="shortcut icon" type="image/x-icon" href="/img/owl.svg" />
			<link rel="icon" href="/img/owl.svg" />
			<link rel="apple-touch-icon" href="/img/owl.svg" />
		</>
	);
}


function ExternalScripts() {
	const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID || '';

	return (
		<>
			{/* Google Analytics */}
			{<Script
				src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
				strategy="afterInteractive" />}
			{<Script id="google-analytics" strategy="afterInteractive">
				{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_TRACKING_ID}', {
            page_path: window.location.pathname,
          });
        `}</Script>}
			{/* Google AdSense */}
			{<Script
				src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2309486098831986"
				strategy="afterInteractive"
				crossOrigin="anonymous" />}
			{/* Naver Map */}
			<Script
				src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}`}
				strategy="beforeInteractive"
			/>
		</>
	);
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="ko">
			<head>
				<Links />
			</head>
			<body>
				<StyledComponentsRegistry>
					<ReduxProvider>
						{children}
						<TempSaveToast />
					</ReduxProvider>
				</StyledComponentsRegistry>
				<div id="root-modal" />
				<div id="temp-save-modal" />
				<ExternalScripts />
			</body>
		</html>
	);
}