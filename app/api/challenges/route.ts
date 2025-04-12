import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/app/authOptions";
import dbConnect from "@/lib/db";
import Challenge from "@/models/Challenge";
import { PublishModel } from "@/models/Publish";
import { User } from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    await dbConnect();
    const challenges = await Challenge.find()
      .populate("author", "username")
      .sort({ createdAt: -1 });
    const publish = await PublishModel.findOne({ publish: true });
    const user = await User.findById(session?.user?.id);

    console.log(session?.user);
    if (user.teamId && publish) {
      const filtered = challenges.filter((ch) => ch.published === true);

      const challengesWithSolvedStatus = filtered.map((challenge) => ({
        ...challenge.toObject(),
        isSolved: challenge.solves?.includes(user.teamId) || false,
      }));
      return NextResponse.json(challengesWithSolvedStatus);
    }

    if (!session?.user?.isAdmin && publish) {
      return NextResponse.json(challenges);
    }

    if (session?.user.isAdmin) {
      return NextResponse.json(challenges);
    }

    return NextResponse.json(
      { message: "Event hasn't started yet." },
      { status: 400 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch challenges" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const data = await request.json();

    // Validate GitHub URL
    // if (!data.fileUrl.startsWith('https://github.com/') &&
    //     !data.fileUrl.startsWith('https://raw.githubusercontent.com/')) {
    //   return NextResponse.json(
    //     { message: 'Invalid GitHub URL' },
    //     { status: 400 }
    //   );
    // }

    const challenge = await Challenge.create({
      ...data,
      author: session.user.id,
    });

    return NextResponse.json(challenge, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if ("code" in error && error.code === 11000) {
        return NextResponse.json(
          { message: "Challenge title already exists" },
          { status: 400 },
        );
      }
      if (error.name === "ValidationError") {
        return NextResponse.json({ message: error.message }, { status: 400 });
      }
    }
    console.error("Create challenge error:", error); // Log the error for debugging purposes
    return NextResponse.json(
      { message: "Failed to create challenge" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const data = await request.json();
    const { id, ...updateData } = data;

    const challenge = await Challenge.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true },
    );

    if (!challenge) {
      return NextResponse.json(
        { message: "Challenge not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(challenge);
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.name === "ValidationError") {
        return NextResponse.json({ message: error.message }, { status: 400 });
      }
    }
    return NextResponse.json(
      { message: "Failed to update challenge" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    const challenge = await Challenge.findByIdAndDelete(id);

    if (!challenge) {
      return NextResponse.json(
        { message: "Challenge not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Challenge deleted successfully" });
  } catch (error: unknown) {
    console.error("Delete challenge error:", error);
    return NextResponse.json(
      { message: "Failed to delete challenge" },
      { status: 500 },
    );
  }
}
