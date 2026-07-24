import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signJwt } from "@/lib/jwt";
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, password, college, role } = body;

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate Verification Token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        college,
        role: role || 'student',
        verificationToken,
        verificationExpiry
      },
    });

    // Generate JWT
    const token = signJwt({ userId: user.id, role: user.role });

    // TODO: Send verification email here
    console.log(`[MOCK EMAIL] To: ${email}, Subject: Verify your email, Link: /verify-email?token=${verificationToken}`);

    return NextResponse.json(
      {
        message: "User created successfully. Please verify your email.",
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Register Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
