// Next.js and Next-Auth
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

// External Libraries and Dependencies
import jwt from "jsonwebtoken";

// Custom Entities
import AccountEntity from "@/entities/account-entity";
import UserEntity from "@/entities/user-entity";

// Database Connection
import connectDB from "@/lib/db";

// API and Network
import instance from "@/lib/axios-config";

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
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(
        credentials: Record<never, string> | undefined,
      ): Promise<null> {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        try {
          const { data } = await instance.post("/auth/login", {
            email,
            password,
          });
          return data;
        } catch (error) {
          return null;
        }
      },
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
      let providerId,
        providerType = "";

      // Set the provider id and type based on the provider
      if (account.provider === "github") {
        providerId = profile.id;
        providerType = "github";
      } else if (account.provider === "google") {
        providerId = profile.sub;
        providerType = "google";
      } else {
        providerId = user.id;
        providerType = "credentials";
      }

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

        // Find existing account based on user id
        const existingAccount = await AccountEntity.findOne({ user: id });

        // Add jwt and id to session
        session.jwt = token.jwt;
        session.id = id;
        session.providerType = existingAccount.providerType;
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
