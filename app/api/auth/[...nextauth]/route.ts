import AccountEntity from "@/entities/account-entity";
import UserEntity from "@/entities/user-entity";
import connectDB from "@/lib/db";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import jwt from "jsonwebtoken";

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
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
      let providerId = account.provider === "github" ? profile.id : profile.sub;
      let providerType = account.provider;
      const { email } = user;

      await connectDB();

      const existingAccount = await AccountEntity.findOne({ providerId });

      // If account already exists, return true
      if (existingAccount) {
        return true;
      }

      // Else find existing user
      const existingUser = await UserEntity.findOne({ email });

      //  If user exists, create account and tie to existing user
      if (existingUser) {
        await AccountEntity.create({
          providerId,
          providerType,
          user: existingUser?._id,
        });

        return true;
      }

      // Else create new user and account
      // Creating new user
      const newUser = await UserEntity.create({
        email,
      });

      // Creating new account
      await AccountEntity.create({
        providerId,
        providerType,
        user: newUser?._id,
      });

      return true;
    },
    async jwt({ token, user }: { token: any; user: any }) {
      // If user exists
      if (user) {
        // Find database user based on session user
        const existingUser = await UserEntity.findOne({
          email: user!.email,
        });

        // Create JWT token
        const jwtToken = jwt.sign(
          {
            id: existingUser!._id,
            email: existingUser!.email,
          },
          process.env.JWT_SECRET as string,
          {
            expiresIn: "1h",
          },
        );

        // Add jwt token to session token
        token.jwt = jwtToken;
      }

      // Return session
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      // If session exists
      if (session) {
        // Decode JWT token for the id
        const { id }: any = jwt.decode(token.jwt);

        // Add jwt and id to session
        session.jwt = token.jwt;
        session.id = id;
      }

      return session;
    },
  },
});

export { handler as GET, handler as POST };
