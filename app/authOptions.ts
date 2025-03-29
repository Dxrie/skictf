import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {User} from "@/models/User";
import connectDB from "@/lib/db";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {label: "Email", type: "email"},
        password: {label: "Password", type: "password"},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        await connectDB();

        const user = await User.findOne({email: credentials.email});

        if (!user) {
          throw new Error("User not found");
        }

        if (!user.isVerified) {
          throw new Error("Please verify your email before logging in");
        }

        const isValid = await user.comparePassword(credentials.password);

        if (!isValid) {
          throw new Error("Invalid password");
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
    async jwt({token, user}) {
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin;
        token.teamId = user.teamId;
      }
      return token;
    },
    async session({session, token}) {
      if (token) {
        session.user.id = token.id;
        session.user.isAdmin = token.isAdmin;
        session.user.teamId = token.teamId;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};

export default authOptions;
