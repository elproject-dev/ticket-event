import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditEventClient from "./EditEventClient";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const event = await prisma.event.findUnique({
    where: { id }
  });

  if (!event) return notFound();

  return <EditEventClient event={event} />;
}
