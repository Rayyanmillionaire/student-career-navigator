import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Mock registration success
    return NextResponse.json({
      token: "mock-jwt-token-newuser-" + Date.now(),
      user: {
        id: Date.now(),
        name,
        email,
        role: "student",
      }
    });
  } catch (e) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
