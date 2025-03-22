"use client";

import {useState, useEffect} from "react";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Challenge {
  _id: string;
  title: string;
  description: string;
  points: number;
  category: string;
  fileUrls: string[];
  flag: string;
}

export default function AdminChallengePage() {
  const router = useRouter();
  const {data: session} = useSession();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(
    null
  );
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const groupChallengesByCategory = (challenges: Challenge[]) => {
    const uniqueCategories = Array.from(
      new Set(challenges.map((c) => c.category))
    );
    setCategories(uniqueCategories);
  };

  useEffect(() => {
    if (!session) {
      router.push("/auth/login");
      return;
    }
    if (!session.user.isAdmin) {
      router.push("/");
      return;
    }
    fetchChallenges();
  }, [session]);

  const fetchChallenges = async () => {
    try {
      const response = await fetch("/api/challenges");
      if (response.ok) {
        const data = await response.json();
        setChallenges(data);
        groupChallengesByCategory(data);
      }
    } catch (error) {
      console.error("Error fetching challenges:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const fileUrls = Array.from(formData.getAll("fileUrls")).filter(
      (url) => url !== ""
    );
    const challengeData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      points: Number(formData.get("points")),
      category: formData.get("category") as string,
      fileUrls,
      flag: formData.get("flag") as string,
    };

    try {
      const url = editingChallenge
        ? `/api/challenges/${editingChallenge._id}`
        : "/api/challenges";
      const method = editingChallenge ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(challengeData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save challenge");
      }

      setShowDialog(false);
      setEditingChallenge(null);
      fetchChallenges();
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

  const handleEdit = (challenge: Challenge) => {
    setEditingChallenge(challenge);
    setShowDialog(true);
  };

  const handleDelete = async (challengeId: string) => {
    if (!confirm("Are you sure you want to delete this challenge?")) return;

    try {
      const response = await fetch(`/api/challenges/${challengeId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete challenge");
      }

      fetchChallenges();
    } catch (error) {
      console.error("Error deleting challenge:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-16">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Challenge Management
          </h1>
          <Button onClick={() => setShowDialog(true)}>Add Challenge</Button>
        </div>

        {categories.map((category) => (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">
              {category}
            </h2>
            <div className="space-y-4">
              {challenges
                .filter((challenge) => challenge.category === category)
                .map((challenge) => (
                  <div
                    key={challenge._id}
                    className="bg-card p-6 rounded-lg shadow-lg space-y-2 border"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-semibold">
                          {challenge.title}
                        </h2>
                        <p className="text-muted-foreground mt-1">
                          {challenge.description}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => handleEdit(challenge)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(challenge._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <span className="text-primary">
                        {challenge.points} points
                      </span>
                      <span className="text-muted-foreground">
                        Category: {challenge.category}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {challenge.fileUrls.map((url, index) => (
                        <a
                          key={index}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          Attachment {index + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
            </div>

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingChallenge ? "Edit Challenge" : "Add New Challenge"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      defaultValue={editingChallenge?.title}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      name="description"
                      defaultValue={editingChallenge?.description}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="points">Points</Label>
                    <Input
                      id="points"
                      name="points"
                      type="number"
                      min="0"
                      defaultValue={editingChallenge?.points}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      name="category"
                      defaultValue={editingChallenge?.category}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>File URLs (GitHub)</Label>
                    {[0, 1, 2].map((index) => (
                      <Input
                        key={index}
                        name="fileUrls"
                        defaultValue={editingChallenge?.fileUrls?.[index] || ""}
                        className="mt-1"
                        placeholder={`File URL ${index + 1} (optional)`}
                      />
                    ))}
                  </div>

                  <div>
                    <Label htmlFor="flag">Correct Flag</Label>
                    <Input
                      id="flag"
                      name="flag"
                      type="text"
                      defaultValue={editingChallenge?.flag}
                      required
                      className="mt-1"
                      placeholder="SKICTF{...}"
                    />
                  </div>

                  {error && (
                    <p className="text-red-500 text-sm text-center">{error}</p>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading
                      ? editingChallenge
                        ? "Updating..."
                        : "Creating..."
                      : editingChallenge
                      ? "Update Challenge"
                      : "Create Challenge"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </div>
    </div>
  );
}
