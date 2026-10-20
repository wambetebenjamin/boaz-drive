import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { verifyRecaptcha } from '@/lib/recaptcha';
import { verifyUser } from '@/lib/users';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({ clientId: process.env.GOOGLE_CLIENT_ID ?? '', clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '' }),
    Credentials({
      name: 'Email and password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        recaptchaToken: { label: 'Security token', type: 'text' },
        recaptchaVersion: { label: 'Challenge version', type: 'text' },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? '');
        const password = String(credentials?.password ?? '');
        const token = String(credentials?.recaptchaToken ?? '');
        const version = credentials?.recaptchaVersion === 'v2' ? 'v2' : 'v3';
        const challenge = await verifyRecaptcha(token, 'signin', version);
        if (!challenge.success) return null;
        return verifyUser(email, password);
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  session: { strategy: 'jwt' },
  pages: { signIn: '/auth/signin' },
});
