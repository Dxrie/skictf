import Challenge from "@/models/Challenge";
import connectDB from "@/lib/db";
import Team from "@/models/Team";
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const team = await Team.findById(id)
      .populate("members", "username _id")
      .populate("leader", "username");

    if (!team) {
      return NextResponse.json({ message: "Team not found" }, { status: 404 });
    }

    const solvedChallenges = await Challenge.find({
      solves: id,
    }).select("-flag -solves");

    return NextResponse.json({ team, solvedChallenges });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
