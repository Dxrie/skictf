import { Team } from "@/models/Team";

export async function GET() {
    const teams = await Team.find().sort({ score: -1 });

    return Response.json(teams);
}