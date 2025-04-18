import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  if (user.isVerified) {
    return NextResponse.json(
      { message: "Your account has already been verified." },
      { status: 400 },
    );
  }

  if (user.verificationTokenExpires > new Date()) {
    return NextResponse.json(
      { message: "Verification token is still valid." },
      { status: 400 },
    );
  }

  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationTokenExpires = new Date();
  verificationTokenExpires.setHours(verificationTokenExpires.getHours() + 24);

  user.verificationToken = verificationToken;
  user.verificationTokenExpires = verificationTokenExpires;

  await user.save();

  await sendVerificationEmail(user.email, verificationToken);

  return NextResponse.json(
    { message: "Verification email sent" },
    { status: 200 },
  );
}
