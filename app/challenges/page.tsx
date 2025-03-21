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

interface Challenge {
  _id: string;
  title: string;
  description: string;
  points: number;
  category: string;
  fileUrls: string[];
  solveCount: number;
  flag?: string;
}

export default function ChallengePage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [flagInput, setFlagInput] = useState("");
  const [flagStatus, setFlagStatus] = useState<"" | "correct" | "incorrect">(
    ""
  );

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const response = await fetch("/api/challenges");
      if (response.ok) {
        const data = await response.json();
        setChallenges(data);
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <div
              key={challenge._id}
              className="bg-card p-6 rounded-lg shadow-lg space-y-3 hover:shadow-xl transition-shadow duration-200 cursor-pointer border"
              onClick={() => setSelectedChallenge(challenge)}
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold break-words">
                  {challenge.title}
                </h2>
                <p className="text-muted-foreground break-words">
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
                <span className="text-muted-foreground">
                  Solved by {challenge.solveCount} users
                </span>
              </div>
              {challenge.fileUrls
                ? challenge.fileUrls.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-2">
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
                  )
                : ""}
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
          <DialogContent className="sm:max-w-[425px]">
            {selectedChallenge && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedChallenge.title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <p className="text-muted-foreground">
                      {selectedChallenge.description}
                    </p>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-primary font-medium">
                      {selectedChallenge.points} points
                    </span>
                    <span className="text-muted-foreground">
                      Category: {selectedChallenge.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">
                      Solved by {selectedChallenge.solveCount} users
                    </span>
                  </div>
                  {selectedChallenge.fileUrls.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedChallenge.fileUrls.map((url, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="w-full sm:w-auto"
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
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="flag">Submit Flag</Label>
                    <div className="flex gap-2">
                      <Input
                        id="flag"
                        value={flagInput}
                        onChange={(e) => {
                          setFlagInput(e.target.value);
                          setFlagStatus("");
                        }}
                        placeholder="SKICTF{...}"
                      />
                      <Button
                        onClick={async () => {
                          try {
                            const response = await fetch(
                              `/api/challenges/${selectedChallenge._id}/submit`,
                              {
                                method: "POST",
                                headers: {"Content-Type": "application/json"},
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
                            console.error("Error submitting flag:", error);
                            setFlagStatus("incorrect");
                          }
                        }}
                      >
                        Submit
                      </Button>
                    </div>
                    {flagStatus === "correct" && (
                      <p className="text-green-500 text-sm">
                        Correct flag! Challenge completed!
                      </p>
                    )}
                    {flagStatus === "incorrect" && (
                      <p className="text-red-500 text-sm">
                        {error}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
