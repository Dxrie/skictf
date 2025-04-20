"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface LogEntry {
  _id: string;
  memberId: {
    _id: string;
    username: string;
    email: string;
    teamId: {
      name: string;
    };
  };
  challengeId: {
    _id: string;
    title: string;
    points: number;
    category: string;
  };
  solvedAt: Date;
}

export default function AdminLogsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [logs, setLogs] = useState<LogEntry[]>([]);
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
    fetchLogs();
  }, [session, router]);

  const fetchLogs = async () => {
    try {
      const response = await fetch("/api/logs");
      if (response.ok) {
        const data = await response.json();
        setLogs(data);
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary">Loading logs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-16">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-8">
          Correct Submission Logs
        </h1>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 px-4 text-left">User</th>
                <th className="py-2 px-4 text-left">Team</th>
                <th className="py-2 px-4 text-left">Challenge</th>
                <th className="py-2 px-4 text-left">Category</th>
                <th className="py-2 px-4 text-left">Score</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr
                  key={log._id}
                  className="border-b border-border hover:bg-muted/50"
                >
                  <td className="py-2 px-4">
                    <div>{log.memberId?.username || "Unknown"}</div>
                    <div className="text-sm text-muted-foreground">
                      {log.memberId?.email || ""}
                    </div>
                  </td>
                  <td className="py-2 px-4">{log.memberId.teamId.name}</td>
                  <td className="py-2 px-4 whitespace-pre-wrap">
                    {log.challengeId.title}
                  </td>
                  <td className="py-2 px-4">{log.challengeId.category}</td>
                  <td className="py-2 px-4">{log.challengeId.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
