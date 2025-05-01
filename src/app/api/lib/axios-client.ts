import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URI,
});

if (typeof window === 'undefined') {
  api.interceptors.request.use(
    async (config) => {
      // 서버 런타임에서만 동적 import
      const { headers } = await import('next/headers');

      const h = await headers(); 

      const raw =
        h.get('x-forwarded-for') ??
        h.get('x-real-ip') ??
        '';

      const ip = raw.split(',')[0].trim();
      console.log('👉 추출한 IP =', ip);
      
      if (ip) config.headers['X-Forwarded-For'] = ip;

      return config;
    },
    (error) => Promise.reject(error),
  );
}
