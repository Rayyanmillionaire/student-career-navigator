import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Mock Admin User
    if (email === "rayyan.officialx@gmail.com" && password === "Rayyan@Admin") {
      return NextResponse.json({
        token: "mock-jwt-token-admin-12345",
        user: {
          id: 1,
          name: "Rayyan Millionaire",
          email: "rayyan.officialx@gmail.com",
          role: "admin",
        }
      });
    }

    // Mock Student User
    if (email === "student@scn.com" && password === "student123") {
      return NextResponse.json({
        token: "mock-jwt-token-student-67890",
        user: {
          id: 2,
          name: "Test Student",
          email: "student@scn.com",
          role: "student",
          college: "Global University",
          major: "Computer Science"
        }
      });
    }

    // Pass-through for any registered user in memory (mock)
    if (password.length >= 6) {
      return NextResponse.json({
        token: "mock-jwt-token-newuser-abcde",
        user: {
          id: Date.now(),
          name: email.split("@")[0],
          email: email,
          role: "student",
        }
      });
    }

    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  } catch (e) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
