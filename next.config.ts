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
};

export default nextConfig;
