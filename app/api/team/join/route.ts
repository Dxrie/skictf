import {NextResponse} from "next/server";
import connectDB from "@/lib/db";
import {Team} from "@/models/Team";
import {User} from "@/models/User";
import {getServerSession} from "next-auth";
import authOptions from "@/app/authOptions";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({message: "Unauthorized"}, {status: 401});
    }

    const {teamId} = await req.json();

    if (!teamId) {
      return NextResponse.json({message: "Team ID is required"}, {status: 400});
    }

    await connectDB();

    // Check if user is already in a team
    const user = await User.findById(session.user.id);
    if (user?.teamId) {
      return NextResponse.json(
        {message: "You are already in a team"},
        {status: 400}
      );
    }

    // Check if team exists and has space
    const team = await Team.findById(teamId);
    if (!team) {
      return NextResponse.json({message: "Team not found"}, {status: 404});
    }

    if (team.members.length >= 2) {
      return NextResponse.json(
        {message: "Team is already full"},
        {status: 400}
      );
    }

    // Add user to team
    team.members.push(session.user.id);
    await team.save();

    // Update user's team
    await User.findByIdAndUpdate(session.user.id, {teamId: team._id});

    return NextResponse.json(
      {message: "Successfully joined team", team},
      {status: 200}
    );
  } catch (error: unknown) {
    console.error("Join team error:", error);
    return NextResponse.json({message: "Internal server error"}, {status: 500});
  }
}
