import {NextRequest, NextResponse} from "next/server";
import {User} from "@/models/User";
import connectDB from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const {token} = await req.json();

    if (!token) {
      return NextResponse.json(
        {message: "Verification token is required"},
        {status: 400}
      );
    }

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: {$gt: new Date()},
    });

    if (!user) {
      return NextResponse.json(
        {message: "Invalid or expired verification token"},
        {status: 400}
      );
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    return NextResponse.json(
      {message: "Email verified successfully"},
      {status: 200}
    );
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      {message: "An error occurred during verification"},
      {status: 500}
    );
  }
}