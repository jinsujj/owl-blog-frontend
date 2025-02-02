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
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080', 
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'backend.owl-dev.me',
        pathname: '/**'
      }
    ],
  },
};

export default nextConfig;
