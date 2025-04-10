"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSession } from "next-auth/react";

interface TeamMember {
  _id: string;
  username: string;
  email: string;
}

interface Team {
  _id: string;
  name: string;
  leader: string;
  members: TeamMember[];
  score: number;
  teamCode: string;
}

export default function TeamPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [team, setTeam] = useState<Team | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamCode, setTeamCode] = useState("");

  useEffect(() => {
    if (!session) return router.push("/auth/login");

    console.log(session);
    setIsLoading(true);
    fetchTeam();
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTeam = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: teamName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create team");
      }

      setShowCreateDialog(false);
      setTeamName("");
      fetchTeam();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinTeam = async (teamCode: string) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/team/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teamCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to join team");
      }

      fetchTeam();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRenameTeam = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/team/rename", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: teamName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to rename team");
      }

      setShowRenameDialog(false);
      setTeamName("");
      fetchTeam();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-16">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Team Management
        </h1>

        {isLoading ? (
          <p className="text-center text-muted-foreground">
            Loading team data...
          </p>
        ) : team ? (
          <div className="bg-card p-8 rounded-lg shadow-lg border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-primary">
                {team.name}
              </h2>
              {team.leader === session?.user?.id && (
                <Button
                  variant="outline"
                  onClick={() => setShowRenameDialog(true)}
                >
                  Rename Team
                </Button>
              )}
            </div>
            <h5 className="text-sm text-muted-foreground">
              Join Code: {team.teamCode}
            </h5>
            <h5 className="text-sm text-muted-foreground mb-4">
              Score: {team.score}
            </h5>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2 text-primary">
                  Team Members
                </h3>
                <div className="space-y-2">
                  {team.members.map((member) => (
                    <div
                      key={member.email}
                      className="flex items-center justify-between p-3 bg-background rounded-lg border border-muted-foreground"
                    >
                      <div>
                        <p className="font-medium text-primary">
                          {member.username}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {member.email}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {team.leader === member._id && (
                          <span className="text-sm text-primary font-medium">
                            Team Leader
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              You are not part of any team yet.
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => setShowCreateDialog(true)}>
                Create a Team
              </Button>
              <Button variant="outline" onClick={() => setShowJoinDialog(true)}>
                Join a Team
              </Button>
            </div>
          </div>
        )}

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create a New Team</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <Label htmlFor="teamName">Team Name</Label>
                <Input
                  id="teamName"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required
                  className="mt-1"
                  placeholder="Enter team name"
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating team..." : "Create Team"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Join a Team</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleJoinTeam(teamCode);
              }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="teamCode">Team Code</Label>
                <Input
                  id="teamCode"
                  value={teamCode}
                  onChange={(e) => setTeamCode(e.target.value)}
                  required
                  className="mt-1"
                  placeholder="Enter team code"
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Joining team..." : "Join Team"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Rename Team</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleRenameTeam} className="space-y-4">
              <div>
                <Label htmlFor="newTeamName">New Team Name</Label>
                <Input
                  id="newTeamName"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required
                  className="mt-1"
                  placeholder="Enter new team name"
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Renaming team..." : "Rename Team"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
