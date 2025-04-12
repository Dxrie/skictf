"use client";

import { useEffect, useState } from "react";

export default function FirstbloodPage() {
  const [firstBloods, setFirstBloods] = useState<any[]>([]);

  useEffect(() => {
    const fetchFirstBloods = async () => {
      const response = await fetch("/api/firstblood");
      const data = await response.json();
      setFirstBloods(data);
    };

    fetchFirstBloods();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-12 text-red-500">
          First Bloods
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {firstBloods.length === 0 ? (
            <div className="bg-background border rounded-lg shadow-lg p-6 transition transform hover:scale-105">
              <div className="flex items-center justify-between mb-0">
                <h2 className="text-xl font-semibold text-foreground">
                  No First Bloods Found
                </h2>
              </div>
            </div>
          ) : (
            firstBloods.map((blood, index) => (
              <div
                key={index}
                className="bg-background border rounded-lg shadow-lg p-6 transition transform hover:scale-105"
              >
                <div className="flex items-center justify-between mb-0">
                  <h2 className="text-xl font-semibold text-foreground">
                    {blood.challengeId.title}
                  </h2>
                  <span className="text-foreground text-sm py-1 px-3 rounded-full">
                    {blood.challengeId.points} pts
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex flex-col gap-5">
                    <p className="font-medium text-gray-600">
                      Solved by team {blood.teamId.name}
                    </p>
                    <p className="text-gray-400 text-sm">
                      Solved on {new Date(blood.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
