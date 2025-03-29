import {NextResponse} from "next/server";
import connectDB from "@/lib/db";
import {Team} from "@/models/Team";
import {User} from "@/models/User";
import {getServerSession} from "next-auth";
import authOptions from "@/app/authOptions";
import {PublishModel} from "@/models/Publish";

// Create a new team
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({message: "Unauthorized"}, {status: 401});
    }

    if (session.user.isAdmin) {
      return NextResponse.json(
        {message: "Admin cannot create a team"},
        {status: 400}
      );
    }

    const publish = await PublishModel.findOne({publish: true});

    if (!publish) {
      return NextResponse.json(
        {
          message:
            "Challenges are not published yet and you cannot create a team",
        },
        {status: 400}
      );
    }

    let {name} = await req.json().catch(() => ({}));

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        {message: "Team name is required and must be a string"},
        {status: 400}
      );
    }

    name = name.trim();
    if (name.length < 3 || name.length > 30) {
      return NextResponse.json(
        {message: "Team name must be between 3 and 30 characters"},
        {status: 400}
      );
    }

    try {
      await connectDB();
    } catch (error) {
      console.error("Database connection error:", error);
      return NextResponse.json(
        {message: "Database connection failed"},
        {status: 500}
      );
    }

    try {
      // Check if user is already in a team
      const user = await User.findById(session.user.id);
      if (!user) {
        return NextResponse.json({message: "User not found"}, {status: 404});
      }

      if (user.teamId) {
        return NextResponse.json(
          {message: "You are already in a team"},
          {status: 400}
        );
      }

      // Check if team name exists
      const existingTeam = await Team.findOne({name});
      if (existingTeam) {
        return NextResponse.json(
          {message: "Team name already exists"},
          {status: 400}
        );
      }

      // Create team and update user
      const team = await Team.create({
        name,
        leader: session.user.id,
        members: [session.user.id],
      });

      await User.findByIdAndUpdate(session.user.id, {teamId: team._id});

      return NextResponse.json(team, {status: 201});
    } catch (error: unknown) {
      console.error("Database operation error:", error);
      if (error instanceof Error && error.name === "ValidationError") {
        return NextResponse.json({message: error.message}, {status: 400});
      }
      return NextResponse.json(
        {message: "Failed to create team"},
        {status: 500}
      );
    }
  } catch (error: unknown) {
    console.error("Team creation error:", error);
    return NextResponse.json({message: "Internal server error"}, {status: 500});
  }
}

// Get team details
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({message: "Unauthorized"}, {status: 401});
    }

    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user?.teamId) {
      return NextResponse.json(
        {message: "You are not in a team"},
        {status: 404}
      );
    }

    const team = await Team.findById(user.teamId).populate(
      "members",
      "username email"
    );
    if (!team) {
      return NextResponse.json({message: "Team not found"}, {status: 404});
    }

    return NextResponse.json(team);
  } catch (error: unknown) {
    console.error("Get team error:", error);
    return NextResponse.json({message: "Internal server error"}, {status: 500});
  }
}
