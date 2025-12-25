import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import mongoose from "mongoose";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        await dbConnect();

        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.email },
              { username: credentials.email },
            ],
          });

          if (!user) {
            throw new Error("No user found");
          }

          if (!user.isVerified) {
            throw new Error("Email not verified");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordCorrect) {
            throw new Error("Incorrect password");
          }

          const safeUser = {
            id: user._id?.toString(),
            _id: user._id?.toString(),
            email: user.email,
            username: user.username,
            isVerified: user.isVerified,
          };
          return safeUser;
        } catch (error: any) {
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Credentials returns `_id`; OAuth typically returns `id`.
        const derivedId =
          (user as any)?._id?.toString?.() ??
          (user as any)?.id?.toString?.() ??
          token.sub;

        if (derivedId) token._id = derivedId;
        if ((user as any)?.email) token.email = (user as any).email;
        if ((user as any)?.username) token.username = (user as any).username;
        if (typeof (user as any)?.isVerified === "boolean") {
          token.isVerified = (user as any).isVerified;
        }
      }

      // For OAuth logins, token._id is often a provider id (not a Mongo ObjectId).
      // History.userId is an ObjectId, so ensure token._id is a Mongo User _id.
      const tokenId = typeof token._id === "string" ? token._id : undefined;
      const needsMongoId = !tokenId || !mongoose.Types.ObjectId.isValid(tokenId);

      if (needsMongoId && token.email) {
        try {
          await dbConnect();
          let dbUser = await UserModel.findOne({ email: token.email });

          const base = token.email
            .split("@")[0]
            .toLowerCase()
            .replace(/[^a-z0-9_]/g, "_")
            .slice(0, 20);

          const randomSuffix = () => Math.random().toString(36).slice(2, 7);

          if (!dbUser) {
            let username = base || `google_${randomSuffix()}`;
            for (let attempt = 0; attempt < 5; attempt++) {
              const taken = await UserModel.exists({ username });
              if (!taken) break;
              username = `${base || "google"}_${randomSuffix()}`;
            }

            const randomPassword = await bcrypt.hash(
              `${token.sub || "oauth"}_${Date.now()}_${Math.random()}`,
              10
            );

            dbUser = new UserModel({
              username,
              email: token.email,
              password: randomPassword,
              isVerified: true,
              conversationHistory: [],
            });

            await dbUser.save({ validateBeforeSave: false });
          }

          token._id = dbUser._id.toString();
          token.username = (dbUser as any).username;
          token.isVerified = (dbUser as any).isVerified;
        } catch {
          // Best-effort; if DB is unavailable we keep existing token values.
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        (session as any).user = (session as any).user ?? {};
        session.user._id = (token._id ?? token.sub) as any;
        session.user.username = token.username as any;
        session.user.isVerified = token.isVerified as any;
      }
      return session;
    },
  },

  pages: {
    signIn: "/sign-in",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
