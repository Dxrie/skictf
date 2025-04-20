import connectDB from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import authOptions from "@/app/authOptions";
import { Log } from "@/models/Log";
import { User } from "@/models/User";
import Challenge from "@/models/Challenge";
import Team from "@/models/Team";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    await User.findOne();
    await Challenge.findOne();
    await Team.findOne();

    const logs = await Log.find()
      .populate({
        path: "memberId",
        select: "username email",
        populate: {
          path: "teamId",
          model: "Team",
          select: "name",
        },
      })
      .populate("challengeId", "title points category")
      .sort({ createdAt: -1 })
      .exec();

    return NextResponse.json(logs);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
