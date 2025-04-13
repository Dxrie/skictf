import connectDB from "@/lib/db";
import Team from "@/models/Team";
import { User } from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    await User.find();

    const teams = await Team.find({ showInLeaderboard: true }).populate(
      "members",
    );
    return NextResponse.json(teams);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
