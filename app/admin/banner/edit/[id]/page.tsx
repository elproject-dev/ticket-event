import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditBannerClient from "./EditBannerClient";

export default async function EditBannerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const banner = await prisma.banner.findUnique({
    where: { id }
  });

  if (!banner) return notFound();

  return <EditBannerClient banner={banner} />;
}
