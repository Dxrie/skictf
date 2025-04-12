import Challenge from "@/models/Challenge";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/app/authOptions";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { message: "Unauthorized - Admin access required" },
        { status: 401 },
      );
    }

    const { id } = await request.json();

    const chall = await Challenge.findById(id);

    if (!chall)
      return NextResponse.json(
        { message: "Challenge with that id wasn't found" },
        { status: 404 },
      );

    chall.published = !chall.published;
    await chall.save();

    return NextResponse.json({ message: "Success" }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
