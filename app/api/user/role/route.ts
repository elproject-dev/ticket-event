import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/server";

export async function GET() {
  try {
    const { data: session } = await auth.getSession();
    if (!session?.user?.email) {
      return NextResponse.json({ peran: "pengguna" });
    }
    const dbUser = await prisma.pengguna.findUnique({
      where: { email: session.user.email },
      select: { peran: true },
    });
    return NextResponse.json({ peran: dbUser?.peran || "pengguna" });
  } catch (err) {
    return NextResponse.json({ peran: "pengguna" });
  }
}
