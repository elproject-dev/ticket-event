import { auth } from '@/lib/auth/server';

// proxy.ts replaces middleware.ts in Next.js 16
export default auth.middleware({
  loginUrl: '/masuk',
});

export const config = {
  matcher: [
    '/akun/:path*',
    '/profil/:path*',
    '/riwayat/:path*',
    '/e-tiket/:path*',
  ],
};
