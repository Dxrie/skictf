import connectDB from "@/lib/db";
import Team from "@/models/Team";

export async function GET() {
  await connectDB();
  const teams = await Team.find({ showInLeaderboard: true })
    .populate("members", "username _id")
    .sort({
      score: -1,
    });

  return Response.json(teams);
}
