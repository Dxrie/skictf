"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function AdminPage() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) {
      router.push("/auth/login");
      return;
    }
    if (!session.user.isAdmin) {
      router.push("/");
      return;
    }
  }, [session]);

  return (
    <div className="min-h-screen bg-background px-4 py-16">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-8">
          Admin Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Button
            onClick={() => router.push("/admin/challenges")}
            className="h-32 text-xl cursor-pointer"
            variant={"ghost"}
          >
            Challenge Management
          </Button>
          <Button
            onClick={() => router.push("/admin/publishes")}
            className="h-32 text-xl cursor-pointer"
            variant={"ghost"}
          >
            Challenge Publishment
          </Button>
          <Button
            onClick={() => router.push("/admin/teams")}
            className="h-32 text-xl cursor-pointer"
            variant={"ghost"}
          >
            Team Viewer
          </Button>
          <Button
            onClick={() => router.push("/admin/surveys")}
            className="h-32 text-xl cursor-pointer"
            variant={"ghost"}
          >
            Survey Responses
          </Button>
        </div>
      </div>
    </div>
  );
}
