"use client";

import {useState, useEffect} from "react";
import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {useSession} from "next-auth/react";
import Link from "next/link";

interface Challenge {
  _id: string;
  title: string;
  description: string;
  points: number;
  category: string;
  fileUrls: string[];
  solveCount: number;
  solves: string[];
  flag?: string;
  isSolved?: boolean;
  author: {
    _id: string;
    username: string;
  };
}

export default function ChallengePage() {
  const {data: session} = useSession();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [flagInput, setFlagInput] = useState("");
  const [flagStatus, setFlagStatus] = useState<"" | "correct" | "incorrect">(
    ""
  );
  const [categories, setCategories] = useState<string[]>([]);

  const groupChallengesByCategory = (challenges: Challenge[]) => {
    const uniqueCategories = Array.from(
      new Set(challenges.map((c) => c.category))
    );
    setCategories(uniqueCategories);
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

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

  return (
    <div className="min-h-screen bg-background px-4 py-16">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-8 text-center md:text-left">
          Challenges
        </h1>

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
                    className={`p-6 rounded-lg shadow-lg space-y-3 hover:shadow-xl transition-shadow duration-200 cursor-pointer border ${
                      challenge.solves.includes(session?.user.teamId)
                        ? "bg-green-100/10 border-green-500/50"
                        : "bg-card"
                    }`}
                    onClick={() => setSelectedChallenge(challenge)}
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
                      <span className="text-primary font-bold">
                        {challenge.points >= 50 && challenge.points < 250
                          ? "Easy"
                          : challenge.points >= 250 && challenge.points < 500
                          ? "Medium"
                          : challenge.points >= 500 && challenge.points < 1000
                          ? "Hard"
                          : challenge.points >= 1000
                          ? "Impossible"
                          : ""}
                      </span>
                      <span className="text-muted-foreground">
                        Category: {challenge.category}
                      </span>
                      <span className="text-muted-foreground">
                        Created by: {challenge.author?.username}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        Solved by {challenge.solveCount} teams
                      </span>
                    </div>
                    {challenge.fileUrls && challenge.fileUrls.length > 0 && (
                      <div className="pt-2">
                        {session ? (
                          <div className="flex flex-wrap gap-2">
                            {challenge.fileUrls.map((url, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                className="sm:w-auto"
                                asChild
                              >
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Download File {index + 1}
                                </a>
                              </Button>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            <Link
                              href="/auth/login"
                              className="text-primary hover:underline"
                            >
                              Sign in
                            </Link>{" "}
                            to access challenge files
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
            </div>

            <Dialog
              open={selectedChallenge !== null}
              onOpenChange={(open) => {
                if (!open) {
                  setSelectedChallenge(null);
                  setFlagInput("");
                  setFlagStatus("");
                }
              }}
            >
              <DialogContent
                className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto overflow-x-hidden"
                onInteractOutside={(e) => e.preventDefault()}
              >
                {selectedChallenge && (
                  <>
                    <DialogHeader className="pb-4">
                      <DialogTitle className="text-2xl break-words">
                        {selectedChallenge.title}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 px-1 overflow-scroll">
                      <div className="space-y-3">
                        <p className="text-muted-foreground whitespace-pre-wrap break-words">
                          {selectedChallenge.description}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm items-center">
                        <span className="text-primary font-medium bg-primary/10 px-3 py-1.5 rounded-full">
                          {selectedChallenge.points} points
                        </span>
                        <span className="text-primary font-medium bg-primary/10 px-3 py-1.5 rounded-full">
                          {selectedChallenge.points >= 50 &&
                          selectedChallenge.points < 250
                            ? "Easy"
                            : selectedChallenge.points >= 250 &&
                              selectedChallenge.points < 500
                            ? "Medium"
                            : selectedChallenge.points >= 500 &&
                              selectedChallenge.points < 1000
                            ? "Hard"
                            : selectedChallenge.points >= 1000
                            ? "Impossible"
                            : ""}
                        </span>
                        <span className="text-muted-foreground">
                          Category: {selectedChallenge.category}
                        </span>
                        <span className="text-muted-foreground">
                          Solved by {selectedChallenge.solveCount} teams
                        </span>
                        <span className="text-muted-foreground bg-muted/10 px-3 py-1.5 rounded-full">
                          Created by: {selectedChallenge.author?.username}
                        </span>
                      </div>
                      {selectedChallenge.fileUrls.length > 0 && (
                        <div className="space-y-3">
                          <h3 className="text-sm font-medium">
                            Challenge Files
                          </h3>
                          {session ? (
                            <div className="flex flex-wrap gap-2">
                              {selectedChallenge.fileUrls.map((url, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  className="w-full sm:w-auto"
                                  asChild
                                >
                                  <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    Attachment {index + 1}
                                  </a>
                                </Button>
                              ))}
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                              <Link
                                href="/auth/login"
                                className="text-primary hover:underline"
                              >
                                Sign in
                              </Link>{" "}
                              to access challenge files
                            </div>
                          )}
                        </div>
                      )}
                      <div className="space-y-4 pt-4 border-t">
                        <div className="space-y-3">
                          <Label htmlFor="flag" className="text-sm font-medium">
                            Submit Flag
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              id="flag"
                              value={flagInput}
                              onChange={(e) => {
                                setFlagInput(e.target.value);
                                setFlagStatus("");
                              }}
                              placeholder="SKICTF{...}"
                              className="flex-1"
                            />
                            <Button
                              onClick={async () => {
                                try {
                                  const response = await fetch(
                                    `/api/challenges/${selectedChallenge._id}/submit`,
                                    {
                                      method: "POST",
                                      headers: {
                                        "Content-Type": "application/json",
                                      },
                                      body: JSON.stringify({flag: flagInput}),
                                    }
                                  );

                                  if (response.ok) {
                                    setFlagStatus("correct");
                                  } else {
                                    const r = await response.json();
                                    setError(r.message);
                                    setFlagStatus("incorrect");
                                  }
                                } catch (error) {
                                  console.error(
                                    "Error submitting flag:",
                                    error
                                  );
                                  setFlagStatus("incorrect");
                                }
                              }}
                            >
                              Submit
                            </Button>
                          </div>
                          {flagStatus === "correct" && (
                            <p className="text-green-500 text-sm bg-green-500/10 p-3 rounded-lg">
                              Correct flag! Challenge completed!
                            </p>
                          )}
                          {flagStatus === "incorrect" && (
                            <p className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg">
                              {error}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </div>
    </div>
  );
}
