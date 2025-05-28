"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CompetitionPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [competitionStatus, setCompetitionStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!session) {
      router.push("/auth/login");
      return;
    }
    if (!session.user.isAdmin) {
      router.push("/");
      return;
    }

    fetchCompetitionStatus();
  }, [session, router]);

  const fetchCompetitionStatus = async () => {
    try {
      const response = await fetch("/api/competition");
      const data = await response.json();

      setCompetitionStatus(data);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleCompetitionStatus = async () => {
    if (session?.user.id != process.env.NEXT_PUBLIC_USER_ID) {
      alert("CUMA GUA WOI YANG BOLEH BUKA INI");
    }

    setIsLoading(true);
    const response = await fetch("/api/competition", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: !competitionStatus }),
    });

    if (response.ok) {
      const data = await response.json();
      setCompetitionStatus(data);
    } else {
      console.error("Failed to toggle competition status");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-10 text-center">
          Competition Dashboard
        </h1>

        <div className="bg-card rounded-xl shadow-lg p-8 border border-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-foreground">
              Competition Control Panel
            </h2>
            <div className="flex items-center space-x-2">
              <span
                className={`h-3 w-3 rounded-full ${competitionStatus ? "bg-green-500" : "bg-red-500"}`}
              ></span>
              <span className="text-muted-foreground font-medium">
                {competitionStatus ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-lg font-medium mb-2">Current Status:</p>
              <div
                className={`text-xl font-bold ${competitionStatus ? "text-green-500" : "text-red-500"}`}
              >
                {competitionStatus
                  ? "Competition has STARTED"
                  : "Competition has STOPPED"}
              </div>
            </div>

            <Button
              className={
                "mt-4 py-3 px-6 rounded-md font-medium text-white transition-all"
              }
              variant={competitionStatus ? "destructive" : "default"}
              onClick={toggleCompetitionStatus}
            >
              {competitionStatus
                ? isLoading
                  ? "Stopping Competition..."
                  : "Stop Competition"
                : isLoading
                  ? "Starting Competition..."
                  : "Start Competition"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
