"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Challenge {
  _id: string;
  title: string;
  description: string;
  points: number;
  category: string;
  fileUrls: string[];
  flag: string;
  published: boolean;
}

export default function AdminChallengePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const groupChallengesByCategory = (challenges: Challenge[]) => {
    const uniqueCategories = Array.from(
      new Set(challenges.map((c) => c.category)),
    );
    setCategories(uniqueCategories);
  };

  useEffect(() => {
    if (!session) {
      router.push("/auth/login");
      return;
    }
    if (!session.user.isAdmin) {
      router.push("/");
      return;
    }
    fetchChallenges();
  }, [session]);

  const fetchChallenges = async () => {
    try {
      const response = await fetch("/api/challenges");
      if (response.ok) {
        const data = await response.json();
        setChallenges(data);
        groupChallengesByCategory(data);
      }
    } catch (error) {
      console.error("Error fetching challenges:", error);
    }
  };

  const handlePublish = async (
    id: string,
    published: boolean,
    name: string,
  ) => {
    try {
      const response = await fetch("/api/challenges/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to publish challenge");
      }

      setChallenges((prev) =>
        prev.map((challenge) =>
          challenge._id === id
            ? { ...challenge, published: !challenge.published }
            : challenge,
        ),
      );

      toast(
        !published ? (
          <span>
            Challenge <b>{name}</b> has been published.
          </span>
        ) : (
          <span>
            Challenge <b>{name}</b> has been unpublished.
          </span>
        ),
      );
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("An error occurred");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-16">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Challenge Publishes
          </h1>
        </div>

        {categories.map((category) => (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges
                .filter((challenge) => challenge.category === category)
                .sort((a, b) => a.points - b.points)
                .map((challenge) => (
                  <div
                    key={challenge._id}
                    className="p-6 rounded-lg shadow-lg space-y-3 border bg-card"
                  >
                    <div className="space-y-2">
                      <h2 className="text-2xl font-semibold break-words">
                        {challenge.title}
                      </h2>
                      <p className="text-muted-foreground break-words line-clamp-1">
                        {challenge.description}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="text-primary font-medium">
                        {challenge.points} points
                      </span>
                      <span className="text-muted-foreground">
                        Category: {challenge.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      {challenge.fileUrls && challenge.fileUrls.length > 0 && (
                        <span className="text-muted-foreground">
                          {challenge.fileUrls.length} file(s) attached
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant={
                          challenge.published ? "destructive" : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() =>
                          handlePublish(
                            challenge._id,
                            challenge.published,
                            challenge.title,
                          )
                        }
                      >
                        {challenge.published ? "Unpublish" : "Publish"}
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
