import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return 200 anyway to prevent email enumeration
      return NextResponse.json({ message: "If that email exists, a reset link was sent." }, { status: 200 });
    }

    // Generate Reset Token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // TODO: Send reset email here
    console.log(`[MOCK EMAIL] To: ${email}, Subject: Reset your password, Link: /reset-password?token=${resetToken}`);

    return NextResponse.json({ message: "If that email exists, a reset link was sent." }, { status: 200 });
  } catch (error: any) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
