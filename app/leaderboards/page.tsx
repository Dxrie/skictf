'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Team {
  _id: string;
  name: string;
  members: any[];
  score: number;
}

export default function LeaderboardPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch('/api/team/all');
        if (response.ok) {
          const data = await response.json();
          // Sort teams by score in descending order
          const sortedTeams = data.sort((a: Team, b: Team) => b.score - a.score);
          setTeams(sortedTeams);
        }
      } catch (error) {
        console.error('Error fetching teams:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeams();
    // Refresh data every minute
    const interval = setInterval(fetchTeams, 60000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary">Loading leaderboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-16">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Leaderboard
        </h1>

        <div className="bg-card rounded-lg shadow-lg overflow-hidden border">
          <Table>
            <TableCaption>Live team rankings based on challenge scores.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Rank</TableHead>
                <TableHead>Team Name</TableHead>
                <TableHead className="text-right">Members</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teams.map((team, index) => (
                <TableRow key={team._id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{team.name}</TableCell>
                  <TableCell className="text-right">{team.members.length}</TableCell>
                  <TableCell className="text-right">{team.score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}