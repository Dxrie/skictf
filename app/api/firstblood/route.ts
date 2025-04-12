import connectDB from "@/lib/db";
import Fb from "@/models/Fb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const fb = await Fb.find().populate("challengeId").populate("teamId");
    return NextResponse.json(fb);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
