import connectDB from "@/lib/db";
import Team from "@/models/Team";

export async function GET() {
  await connectDB();
  const teams = await Team.find({ showInLeaderboard: true }).sort({
    score: -1,
  });

  return Response.json(teams);
}
