import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/server";

export async function GET() {
  try {
    const { data: session } = await auth.getSession();
    if (!session?.user?.email) {
      return NextResponse.json({ user: null });
    }

    const dbUser = await prisma.pengguna.findUnique({
      where: { email: session.user.email },
      select: { nama: true, email: true, no_telp: true, peran: true },
    });

    return NextResponse.json({
      user: {
        name: dbUser?.nama || session.user.name || "Pengguna",
        email: dbUser?.email || session.user.email,
        peran: dbUser?.peran || "pengguna",
        no_telp: dbUser?.no_telp || null,
        image: session.user.image || "",
      },
    });
  } catch (err) {
    return NextResponse.json({ user: null });
  }
}
