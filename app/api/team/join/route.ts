import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Team } from "@/models/Team";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";
import authOptions from "@/app/authOptions";
import { PublishModel } from "@/models/Publish";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.user.isAdmin) {
      return NextResponse.json(
        { message: "Admin cannot join a team" },
        { status: 400 },
      );
    }

    // const publish = await PublishModel.findOne({publish: true});

    // if (!publish) {
    //   return NextResponse.json(
    //     {
    //       message:
    //         "Challenges are not published yet and you cannot create a team",
    //     },
    //     {status: 400}
    //   );
    // }

    const { teamCode } = await req.json();

    if (!teamCode) {
      return NextResponse.json(
        { message: "Team code is required" },
        { status: 400 },
      );
    }

    await connectDB();

    // Check if user is already in a team
    const user = await User.findById(session.user.id);
    if (user?.teamId) {
      return NextResponse.json(
        { message: "You are already in a team" },
        { status: 400 },
      );
    }

    // Check if team exists and has space
    const team = await Team.findOne({ teamCode });
    if (!team) {
      return NextResponse.json({ message: "Team not found" }, { status: 404 });
    }

    if (team.members.length >= 2) {
      return NextResponse.json(
        { message: "Team is already full" },
        { status: 400 },
      );
    }

    // Add user to team
    team.members.push(session.user.id);
    await team.save();

    // Update user's team
    await User.findByIdAndUpdate(session.user.id, { teamId: team._id });

    return NextResponse.json(
      { message: "Successfully joined team", team },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Join team error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
