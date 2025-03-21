'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useSession } from 'next-auth/react';

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
}

export default function TeamPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [team, setTeam] = useState<Team | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamId, setTeamId] = useState('');

  useEffect(() => {
    if (!session) return router.push('/auth/login'); // Redirect to login if no session exists

    console.log(session);
    fetchTeam();
  }, [session]);

  const fetchTeam = async () => {
    try {
      const response = await fetch('/api/team');
      if (response.ok) {
        const data = await response.json();
        setTeam(data);
      }
    } catch (error) {
      console.error('Error fetching team:', error);
    }
  };

  const handleCreateTeam = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: teamName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create team');
      }

      setShowCreateDialog(false);
      setTeamName('');
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

  const handleJoinTeam = async (teamId: string) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/team/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to join team');
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

  return (
    <div className="min-h-screen bg-background px-4 py-16">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Team Management
        </h1>

        {team ? (
          <div className="bg-card p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">{team.name}</h2>
            <h4 className="text-lg font-medium mb-2">ID: {team._id}</h4>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Team Members</h3>
                <div className="space-y-2">
                  {team.members.map((member) => (
                    <div
                      key={member.email}
                      className="flex items-center justify-between p-3 bg-background rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{member.username}</p>
                        <p className="text-sm text-muted-foreground">
                          {member.email}
                        </p>
                      </div>
                      {team.leader === member._id && (
                        <span className="text-sm text-primary font-medium">
                          Team Leader
                        </span>
                      )}
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
              <Button
                variant="outline"
                onClick={() => setShowJoinDialog(true)}
              >
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

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Creating team...' : 'Create Team'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Join a Team</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); handleJoinTeam(teamId); }} className="space-y-4">
              <div>
                <Label htmlFor="teamId">Team ID</Label>
                <Input
                  id="teamId"
                  value={teamId}
                  onChange={(e) => setTeamId(e.target.value)}
                  required
                  className="mt-1"
                  placeholder="Enter team ID"
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Joining team...' : 'Join Team'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}