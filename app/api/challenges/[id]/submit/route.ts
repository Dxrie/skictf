import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/app/authOptions";
import dbConnect from "@/lib/db";
import Challenge from "@/models/Challenge";
import { User } from "@/models/User";
import Team from "@/models/Team";
import Fb from "@/models/Fb";
import { Log } from "@/models/Log";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Check if user has a team
    const user = await User.findById(session.user.id);
    if (!user?.teamId && !user?.isAdmin) {
      return NextResponse.json(
        { message: "You must be in a team to submit flags" },
        { status: 400 },
      );
    }

    // Get the challenge
    const challenge = await Challenge.findById((await context.params).id);
    if (!challenge) {
      return NextResponse.json(
        { message: "Challenge not found" },
        { status: 404 },
      );
    }

    const { flag } = await request.json();
    if (!flag) {
      return NextResponse.json(
        { message: "Flag is required" },
        { status: 400 },
      );
    }

    // Check if team has already solved this challenge
    const team = await Team.findById(user.teamId);
    if (!team && !user.isAdmin) {
      return NextResponse.json({ message: "Team not found" }, { status: 404 });
    }

    // Validate flag
    const prefix = "SKICTF{";
    if (
      !flag.startsWith(prefix, 0) &&
      !flag.toUpperCase().startsWith(prefix.toUpperCase(), 0)
    ) {
      console.log("Incorrect flag format submitted by team:", team.name);
      return NextResponse.json(
        { message: "Invalid flag format" },
        { status: 400 },
      );
    }

    // Compare the rest of the flag case-sensitively
    const submittedContent = flag.slice(prefix.length);
    const correctContent = challenge.flag.slice(prefix.length);
    if (submittedContent !== correctContent) {
      console.log("Incorrect flag submitted by team:", team?.name ?? "Admin");
      return NextResponse.json({ message: "Incorrect flag" }, { status: 400 });
    }

    // Update challenge solve count
    const chall = await Challenge.findById((await context.params).id);

    if (!chall.solves.includes(user.teamId) && !user.isAdmin) {
      if (chall.solveCount <= 0) {
        chall.solves.push(user.teamId);
        chall.solveCount++;
        await chall.save();
        team.score += chall.points;
        await team.save();

        const fb = new Fb({ challengeId: chall._id, teamId: team._id });
        await fb.save();

        console.log("Flag submitted by team:", team.name);
      } else {
        chall.solves.push(user.teamId);
        chall.solveCount++;
        await chall.save();
        team.score += chall.points;
        await team.save();

        console.log("Flag submitted by team:", team.name);
      }

      const log = new Log({
        memberId: user._id,
        challengeId: chall._id,
        solvedAt: new Date(),
      });
      await log.save();
    }

    return NextResponse.json(
      { message: "Congratulations! Flag is correct" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Flag submission error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
