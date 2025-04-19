import Team from "@/components/Team";

export default async function TeamPage(context: {
  params: Promise<{ id: string }>;
}) {
  return <Team teamId={(await context.params).id}></Team>;
}
