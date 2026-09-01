import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditAcaraClient from "./EditAcaraClient";

export default async function EditAcaraPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const acara = await prisma.acara.findUnique({
    where: { id }
  });

  if (!acara) return notFound();

  return <EditAcaraClient acara={acara} />;
}
