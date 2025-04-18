import authOptions from "@/app/authOptions";
import Team from "@/models/Team";
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

    const team = await Team.findById(session.user.teamId);

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
