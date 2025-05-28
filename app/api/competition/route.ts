import authOptions from "@/app/authOptions";
import { PublishModel } from "@/models/Publish";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const published = await PublishModel.findOne();
  return NextResponse.json(published.publish);
}

export async function POST(request: Request) {
  const { status } = await request.json();
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    return NextResponse.json(
      { message: "Unauthorized - Admin access required" },
      { status: 401 },
    );
  }

  if (session?.user?.id !== process.env.NEXT_PUBLIC_USER_ID) {
    return NextResponse.json(
      { message: "JANGAN JEBOL LAH WOIIIII" },
      { status: 401 },
    );
  }

  const published = await PublishModel.findOne();
  published.publish = status;
  await published.save();

  return NextResponse.json(published.publish);
}
