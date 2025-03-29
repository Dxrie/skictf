"use client";

import {useState, useEffect} from "react";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";

interface Challenge {
  _id: string;
  title: string;
  category: string;
}

export default function SurveyPage() {
  const router = useRouter();
  const {data: session} = useSession();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [team, setTeam] = useState<{name: string} | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push("/auth/login");
      return;
    }
    const initializeData = async () => {
      try {
        await Promise.all([fetchChallenges(), fetchTeam()]);
      } finally {
        setIsLoading(false);
      }
    };
    initializeData();
  }, [session]);

  const fetchTeam = async () => {
    try {
      const response = await fetch("/api/team");
      if (response.ok) {
        const data = await response.json();
        setTeam(data);
      }
    } catch (error) {
      console.error("Error fetching team:", error);
    }
  };
  const fetchChallenges = async () => {
    try {
      const response = await fetch("/api/challenges");
      if (response.ok) {
        const data = await response.json();
        setChallenges(data);
        const uniqueCategories = Array.from(
          new Set(data.map((c: Challenge) => c.category))
        );
        setCategories(uniqueCategories as string[]);
      }
    } catch (error) {
      console.error("Error fetching challenges:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const surveyData = {
      userId: session?.user?.id,
      interestedCategory: formData.get("interestedCategory"),
      difficultCategory: formData.get("difficultCategory"),
      difficultChallenge: formData.get("difficultChallenge"),
      bestAuthor: formData.get("bestAuthor"),
      feedback: formData.get("feedback"),
    };

    try {
      const response = await fetch("/api/survey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(surveyData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit survey");
      }

      router.push("/");
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    console.log(session);
  }, [session]);

  return (
    <div className="min-h-screen bg-background px-4 py-16">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-8">
          SKICTF Survey
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="interestedCategory">
              Which category interests you the most?
            </Label>
            <select
              id="interestedCategory"
              name="interestedCategory"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="difficultCategory">
              Which category do you find most difficult?
            </Label>
            <select
              id="difficultCategory"
              name="difficultCategory"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="difficultChallenge">
              Which challenge in SKICTF did you find most challenging?
            </Label>
            <select
              id="difficultChallenge"
              name="difficultChallenge"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select a challenge</option>
              {challenges.map((challenge) => (
                <option key={challenge._id} value={challenge.title}>
                  {challenge.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="bestAuthor">
              Which author's challenges did you enjoy the most?
            </Label>
            <select
              id="bestAuthor"
              name="bestAuthor"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select an author</option>
              <option value="chchh">chchh</option>
              <option value="LynxJL">LynxJL</option>
              <option value="Dxrie">Dxrie</option>
              <option value="Aurichia">Aurichia</option>
            </select>
          </div>

          <div>
            <Label htmlFor="feedback">
              Feedback and suggestions for SKICTF (Optional)
            </Label>
            <Textarea id="feedback" name="feedback" className="mt-1" rows={4} />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Submitting..." : "Submit Survey"}
          </Button>
        </form>
      </div>
    </div>
  );
}
