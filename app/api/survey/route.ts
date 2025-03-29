import {NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import authOptions from "@/app/authOptions";
import {PublishModel} from "@/models/Publish";
import { User } from "@/models/User";
import Survey from "@/models/Survey";
import connectDB from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    return NextResponse.json(
      {message: "Unauthorized"},
      {status: 401}
    );
  }

  try {
    await connectDB();
    const surveys = await Survey.find().populate('userId', 'username email').lean();
    const formattedSurveys = surveys.map(survey => ({
      ...survey,
      user: survey.userId
    }));
    return NextResponse.json(formattedSurveys);
  } catch (error) {
    console.error("Error fetching surveys:", error);
    return NextResponse.json(
      {message: "Failed to fetch surveys"},
      {status: 500}
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      {message: "You must be logged in to submit a survey"},
      {status: 401}
    );
  }

  try {
    const data = await request.json();

    await connectDB();

    const publish = await PublishModel.findOne({publish: true});

    if (!publish) {
      return NextResponse.json(
        {message: "No survey is currently open"},
        {status: 400}
      );
    }

    const user = await User.findById(data.userId);

    if (!user) {
      return NextResponse.json(
        {message: "User not found"},
        {status: 404}
      );
    }

    const survey = new Survey({
        userId: data.userId,
        interestedCategory: data.interestedCategory,
        difficultCategory: data.difficultCategory,
        mostChallengingChallenge: data.difficultChallenge,
        bestAuthor: data.bestAuthor,
        feedback: data.feedback,
    });

    await survey.save();

    return NextResponse.json({message: "Survey submitted successfully"});
  } catch (error) {
    console.error("Error submitting survey:", error);
    return NextResponse.json(
      {message: "Failed to submit survey"},
      {status: 500}
    );
  }
}
