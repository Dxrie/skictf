import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth/next";
import { User } from "@/models/User";
import connectDB from "@/lib/db";
import authOptions from "@/app/authOptions";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };