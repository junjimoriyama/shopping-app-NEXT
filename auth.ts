import NextAuth, { NextAuthConfig } from "next-auth";
import GithubProvider from "next-auth/providers/github";


export const config: NextAuthConfig = {
  // secret: process.env.AUTH_SECRET,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  basePath: '/api/auth',
  // 認証完了後の処理
  callbacks: {
    authorized({ request, auth }) {
      try {
        const { pathname } = request.nextUrl
        if (pathname === '/protected-page') {
          return !!auth
        }
        return true
      } catch (error) {
        console.log(error)
      }
    },
    jwt({ token, trigger, session }) {
      if (trigger === 'update') token.name = session.user.name
      return token
    }
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth(config)
