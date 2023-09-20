import AccountEntity from "@/entities/account-entity";
import UserEntity from "@/entities/user-entity";
import connectDB from "@/lib/db";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import jwt from "jsonwebtoken";

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({
      user,
      account,
      profile,
    }: {
      user: any;
      account: any;
      profile?: any;
    }) {
      let providerId = profile.id;
      let providerType = account.provider;
      const { email } = user;

      await connectDB();

      const existingUser = await UserEntity.findOne({ email });

      if (existingUser) {
        return true;
      }

      const newUser = await UserEntity.create({
        email,
      });

      await AccountEntity.create({
        providerId,
        providerType,
        user: newUser?._id,
      });

      return true;
    },
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        const jwtToken = jwt.sign(
          {
            id: user.id,
            email: user.email,
          },
          process.env.JWT_SECRET as string,
          {
            expiresIn: "1h",
          },
        );

        token.jwt = jwtToken;
      }

      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session) {
        session.jwt = token.jwt;
      }

      return session;
    },
  },
});

export { handler as GET, handler as POST };
