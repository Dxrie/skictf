import connectDB from "@/lib/db";
import Fb from "@/models/Fb";
import Challenge from "@/models/Challenge";
import Team from "@/models/Team";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    await Challenge.findOne();
    await Team.findOne();

    const fb = await Fb.find().populate("challengeId").populate("teamId");
    return NextResponse.json(fb);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
