import { headers } from 'next/headers';

export const getClientIp = async (): Promise<string | undefined> => {
  // 브라우저(CSR)일 때는 헤더 API 없음
  if (typeof window !== 'undefined') return;

  // Next.js 15 타입: Promise<ReadonlyHeaders>
  const h = await headers();

  // XFF → X-Real-IP 순으로 조회
  const forwarded = h.get('x-forwarded-for');
  const real      = h.get('x-real-ip');

  const raw = forwarded ?? real ?? '';
  return raw.split(',')[0].trim() || undefined;
};
