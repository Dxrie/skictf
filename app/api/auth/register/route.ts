import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";

export async function POST(req: Request) {
  try {
    const { email, password, username } = await req.json();

    if (!email || !password || !username) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email or username already exists" },
        { status: 400 }
      );
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      username,
    });

    return NextResponse.json(
      { message: "User registered successfully", userId: user._id },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Registration error:", error);
    if (error instanceof Error) {
      if (error.name === "ValidationError") {
        return NextResponse.json(
          { message: error.message },
          { status: 400 }
        );
      }
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}