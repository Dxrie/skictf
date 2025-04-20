"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface SurveyResponse {
  _id: string;
  userId: string;
  interestedCategory: string;
  difficultCategory: string;
  mostChallengingChallenge: string;
  bestAuthor: string;
  worstAuthor: string;
  feedback: string;
  createdAt: string;
  user?: {
    username: string;
    email: string;
  };
}

export default function AdminSurveysPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [surveys, setSurveys] = useState<SurveyResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push("/auth/login");
      return;
    }
    if (!session.user.isAdmin) {
      router.push("/");
      return;
    }
    fetchSurveys();
  }, [session]);

  const fetchSurveys = async () => {
    try {
      const response = await fetch("/api/survey");
      if (response.ok) {
        const data = await response.json();
        setSurveys(data);
      }
    } catch (error) {
      console.error("Error fetching surveys:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary">Loading surveys...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-16">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-8">
          Survey Responses
        </h1>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 px-4 text-left">User</th>
                <th className="py-2 px-4 text-left">Interested Category</th>
                <th className="py-2 px-4 text-left">Difficult Category</th>
                <th className="py-2 px-4 text-left">Difficult Challenge</th>
                <th className="py-2 px-4 text-left">Best Author</th>
                <th className="py-2 px-4 text-left">Worst Author</th>
                <th className="py-2 px-4 text-left">Feedback</th>
                <th className="py-2 px-4 text-left">Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {surveys.map((survey) => (
                <tr
                  key={survey._id}
                  className="border-b border-border hover:bg-muted/50"
                >
                  <td className="py-2 px-4">
                    <div>{survey.user?.username || "Unknown"}</div>
                    <div className="text-sm text-muted-foreground">
                      {survey.user?.email || ""}
                    </div>
                  </td>
                  <td className="py-2 px-4">{survey.interestedCategory}</td>
                  <td className="py-2 px-4">{survey.difficultCategory}</td>
                  <td className="py-2 px-4">
                    {survey.mostChallengingChallenge}
                  </td>
                  <td className="py-2 px-4">{survey.bestAuthor}</td>
                  <td className="py-2 px-4">{survey.worstAuthor}</td>
                  <td className="py-2 px-4 whitespace-pre-wrap">
                    {survey.feedback}
                  </td>
                  <td className="py-2 px-4">
                    {new Date(survey.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
