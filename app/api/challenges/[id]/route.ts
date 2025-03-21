import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/authOptions';
import dbConnect from '@/lib/db';
import Challenge from '@/models/Challenge';

export async function PUT(request: NextRequest, context: { params: Promise<{id: string}> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    const data = await request.json();

    // Validate GitHub URL
    if (!data.fileUrl.startsWith('https://github.com/') && 
        !data.fileUrl.startsWith('https://raw.githubusercontent.com/')) {
      return NextResponse.json(
        { message: 'Invalid GitHub URL' },
        { status: 400 }
      );
    }

    const challenge = await Challenge.findByIdAndUpdate(
      (await context.params).id,
      { ...data, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!challenge) {
      return NextResponse.json(
        { message: 'Challenge not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(challenge);
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to update challenge' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, context: { params: Promise<{id: string}> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    const challenge = await Challenge.findByIdAndDelete((await context.params).id);

    if (!challenge) {
      return NextResponse.json(
        { message: 'Challenge not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Challenge deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to delete challenge' },
      { status: 500 }
    );
  }
}