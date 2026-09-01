import { auth } from '@/lib/auth/server';

// proxy.ts replaces middleware.ts in Next.js 16
console.log("Middleware init. Secret:", process.env.NEON_AUTH_COOKIE_SECRET ? "Exists" : "Undefined");

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
