import NextAuth from 'next-auth';
import { Session } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const { 
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  useSession
} = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log("Sign in callback", { user, account, profile });
      return true;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtected = 
        nextUrl.pathname.startsWith('/dashboard') ||
        nextUrl.pathname.startsWith('/studio') ||
        nextUrl.pathname.startsWith('/generating');
        
      if (isProtected && !isLoggedIn) {
        return false; // redirect to login page
      }
      
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session?.user && token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  debug: true,
  logger: {
    error(code, metadata) {
      console.error({ code, metadata });
    },
    warn(code) {
      console.warn(code);
    },
    debug(code, metadata) {
      console.log({ code, metadata });
    },
  },
});

// The useSession is already exported above, no need to re-export it
// export { useSession } from 'next-auth/react'; 