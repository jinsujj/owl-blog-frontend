import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/*
		SSR support: Ensures styles match between server and client.
		CSS class stability: Generates consistent class names for server and client.
		Improved performance: Faster compilation with SWC instead of Babel.
	*/
  compiler: {
    styledComponents: true,  
  },
  images: {
    domains: ["backend.owl-dev.me"], // 외부 URL의 호스트네임 추가
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080', 
        pathname: '/images/**',
      },
    ],
  },
};

export default nextConfig;
