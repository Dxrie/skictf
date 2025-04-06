import Challenge from "@/models/Challenge";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
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
