import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "@/models/User";
import connectDB from "@/lib/db";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        await connectDB();

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("Invalid credentials");
        }

        const isValid = await user.comparePassword(credentials.password);

        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        console.log(user);

        if (!user.isVerified) {
          if (
            user.verificationTokenExpires &&
            new Date() > new Date(user.verificationTokenExpires)
          ) {
            throw new Error(
              "Verification token has expired. Please request a new verification email.",
            );
          } else {
            throw new Error("Please verify your email before logging in");
          }
        }

        return {
          id: user._id.toString(),
          email: user.email,
          username: user.username,
          isAdmin: user.isAdmin,
          teamId: user.teamId?.toString() || null,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin;
        token.teamId = user.teamId ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.isAdmin = token.isAdmin as boolean;
        session.user.teamId = token.teamId ?? null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};

export default authOptions;
