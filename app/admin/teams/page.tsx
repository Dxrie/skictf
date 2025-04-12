"use client";

import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function TeamPage() {
  const session = useSession();
  const router = useRouter();
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    if (!session) {
      router.push("/auth/login");
      return;
    }
    if (!session.data?.user.isAdmin) {
      router.push("/");
      return;
    }
  }, [session]);

  useEffect(() => {
    const fetchTeams = async () => {
      const response = await fetch("/api/teams");
      const data = await response.json();
      setTeams(data);
    };

    fetchTeams();
  }, []);

  return (
    <div className="container mx-auto p-4 pb-6">
      <h1 className="text-3xl font-bold mb-6">Teams</h1>
      <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto">
        {teams.map((team: any) => (
          <AccordionItem
            key={team._id}
            value={team._id}
            className="border-2 rounded-lg mb-2"
          >
            <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <span className="font-semibold text-lg">
                  {team.name}: {team.score} point(s)
                </span>
              </div>
            </AccordionTrigger>
            {team.members.map((member: any) => (
              <AccordionContent key={member._id} className="px-4 py-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    {member.username[0].toUpperCase()}
                  </div>
                  <span className="text-gray-700">{member.username}</span>
                </div>
              </AccordionContent>
            ))}
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
