import authOptions from "@/app/authOptions";
import Team from "@/models/Team";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name } = body;

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const team = await Team.findById(user.teamId);

    if (!team) {
      return NextResponse.json({ message: "Team not found" }, { status: 404 });
    }

    team.name = name;
    await team.save();

    return NextResponse.json({ message: "Team renamed successfully" });
  } catch (err: any) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
