import NextAuth, { Session } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import jwt from "jsonwebtoken";
import AccountEntity from "@/entities/account-entity";
import UserEntity from "@/entities/user-entity";
import connectDB from "@/lib/db";
import instance from "@/lib/axios-config";
import { Provider } from "next-auth/providers/index";
import { JWT } from "next-auth/jwt";

/**
 * Configures NextAuth for handling authentication requests.
 */
const handler = NextAuth({
  providers: [
    configureGithubProvider(),
    configureGoogleProvider(),
    configureCredentialsProvider(),
  ],
  callbacks: {
    signIn: signInCallback,
    jwt: jwtCallback,
    session: sessionCallback,
  },
  pages: {
    signIn: "/login",
  },
});

/**
 * Configures the Github provider for NextAuth.
 * @returns {Provider} - The configured Github provider.
 */
function configureGithubProvider(): Provider {
  return GithubProvider({
    clientId: process.env.GITHUB_CLIENT_ID as string,
    clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
  });
}

/**
 * Configures the Google provider for NextAuth.
 * @returns {Provider} - The configured Google provider.
 */
function configureGoogleProvider(): Provider {
  return GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  });
}

/**
 * Configures the Credentials provider for NextAuth.
 * @returns {Provider} - The configured Credentials provider.
 */
function configureCredentialsProvider(): Provider {
  return CredentialsProvider({
    name: "Credentials",
    credentials: {},
    authorize: async (credentials) => {
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
        console.error("Authorization Error:", error);
        return null;
      }
    },
  });
}

/**
 * Handles the signIn callback for NextAuth.
 * @async
 * @param {Object} params - The parameters for the signIn callback.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating the success of the signIn operation.
 */
async function signInCallback({
  user,
  account,
  profile,
}: {
  user: any;
  account: any;
  profile?: any;
}): Promise<boolean> {
  // Extracting and initializing necessary variables
  const { email } = user;

  // Assigning providerId and providerType based on the account provider
  const { providerId, providerType } = assignProviderDetails(
    user,
    account,
    profile,
  );

  // Connecting to the database
  await connectDB();

  // Handling sign in logic
  return handleSignIn(email, providerId, providerType);
}

/**
 * Assigns providerId and providerType based on the account provider.
 * @param {Object} account - The account object containing provider information.
 * @param {Object} profile - The profile object containing user information.
 * @returns {Object} - An object containing the providerId and providerType.
 */
function assignProviderDetails(user: any, account: any, profile: any): any {
  let providerId,
    providerType = "";

  if (account.provider === "github") {
    providerId = profile.id;
    providerType = "github";
  } else if (account.provider === "google") {
    providerId = profile.sub;
    providerType = "google";
  } else if (account.provider !== "github" && account.provider !== "google") {
    providerId = user.id;
    providerType = "credentials";
  } else {
    providerId = "";
    providerType = "";
  }

  return { providerId, providerType };
}

/**
 * Handles the logic for signing in a user.
 * @async
 * @param {string} email - The email of the user signing in.
 * @param {string} providerId - The providerId of the user signing in.
 * @param {string} providerType - The providerType of the user signing in.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating the success of the signIn operation.
 */
async function handleSignIn(
  email: string,
  providerId: string,
  providerType: string,
): Promise<boolean> {
  const existingAccount = await AccountEntity.findOne({ providerId });

  if (existingAccount) return true;

  const existingUser = await UserEntity.findOne({ email });

  if (existingUser) {
    await AccountEntity.create({
      providerId,
      providerType,
      user: existingUser._id,
    });
    return true;
  }

  const newUser = await UserEntity.create({ email });
  await AccountEntity.create({ providerId, providerType, user: newUser._id });

  return true;
}

/**
 * Handles the jwt callback for NextAuth.
 * @async
 * @param {Object} params - The parameters for the jwt callback.
 * @returns {Promise<Object>} - A promise that resolves to the token object.
 */
async function jwtCallback({
  token,
  user,
}: {
  token: any;
  user: any;
}): Promise<JWT> {
  if (user) {
    const existingUser = await UserEntity.findOne({ email: user.email });
    const jwtToken = jwt.sign(
      { id: existingUser._id, email: existingUser.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" },
    );
    token.jwt = jwtToken;
  }
  return token;
}

/**
 * Handles the session callback for NextAuth.
 * @async
 * @param {Object} params - The parameters for the session callback.
 * @returns {Promise<Object>} - A promise that resolves to the session object.
 */
async function sessionCallback({
  session,
  token,
}: {
  session: any;
  token: any;
}): Promise<Session> {
  if (session) {
    const { id }: any = jwt.decode(token.jwt);
    const existingAccount = await AccountEntity.findOne({ user: id });
    session.jwt = token.jwt;
    session.id = id;
    session.providerType = existingAccount.providerType;
  }
  return session;
}

export { handler as GET, handler as POST };
