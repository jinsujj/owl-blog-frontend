import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/*
		SSR support: Ensures styles match between server and client.
		CSS class stability: Generates consistent class names for server and client.
		Improved performance: Faster compilation with SWC instead of Babel.
	*/
  compiler: {
    styledComponents: {
      ssr: true,
      displayName: true,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080', 
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'backend2.owl-dev.me',
        pathname: '/**'
      }
    ],
		unoptimized: true,
  },
};

export default nextConfig;
