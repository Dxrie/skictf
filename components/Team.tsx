"use client";

import { useEffect, useState } from "react";

interface Member {
  _id: string;
  username: string;
}

interface Team {
  _id: string;
  name: string;
  members: Member[];
  leader: Member;
  score: number;
}

interface Challenge {
  _id: string;
  title: string;
  category: string;
  points: number;
}

export default function Team({ teamId }: { teamId: string }) {
  const [team, setTeam] = useState<Team | undefined>(undefined);
  const [solved, setSolved] = useState<Challenge[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTeam() {
      const response = await fetch(`/api/team/${teamId}`);
      const data = await response.json();

      if (!response.ok) {
        setError("Team not found.");
        return;
      }

      setTeam(data.team);
      setSolved(data.solvedChallenges);
    }

    fetchTeam();
  }, [teamId]);

  return (
    <div className="min-h-screen px-4 py-8 bg-background text-foreground">
      <div className="max-w-3xl mx-auto space-y-6">
        {team ? (
          <>
            <div className="text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {team.name}
              </h1>
              <p className="text-muted-foreground text-lg mt-2">
                Total Score: <span className="font-semibold">{team.score}</span>
              </p>
              <p className="text-muted-foreground">
                Team Leader:{" "}
                <span className="font-medium">{team.leader.username}</span>
              </p>
            </div>

            <div className="bg-card rounded-xl shadow-md p-6 border">
              <h2 className="text-2xl font-semibold mb-4">Members</h2>
              <ul className="space-y-3">
                {team.members.map((member) => (
                  <li
                    key={member._id}
                    className="flex items-center justify-start gap-2 border-b pb-2"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      {member.username[0].toUpperCase()}
                    </div>
                    <span className="font-medium text-lg">
                      {member.username}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card rounded-xl shadow-md p-6 border">
              <h2 className="text-2xl font-semibold mb-4">Solved Challenges</h2>
              {solved.length > 0 ? (
                <ul className="space-y-3">
                  {solved.map((challenge) => (
                    <li
                      key={challenge._id}
                      className="border-b pb-2 flex justify-between"
                    >
                      <div>
                        <p className="font-medium">{challenge.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Difficulty:{" "}
                          {challenge.points >= 50 && challenge.points < 250
                            ? "Easy"
                            : challenge.points >= 250 && challenge.points < 500
                              ? "Medium"
                              : challenge.points >= 500 &&
                                  challenge.points < 1000
                                ? "Hard"
                                : challenge.points >= 1000
                                  ? "Impossible"
                                  : ""}
                        </p>
                      </div>
                      <span className="font-semibold">
                        {challenge.points} pts
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">
                  No challenges solved yet.
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="text-center text-lg text-muted-foreground">
            {error || "Loading team data..."}
          </div>
        )}
      </div>
    </div>
  );
}
