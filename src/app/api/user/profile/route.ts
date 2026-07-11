import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Simulate finding the user based on token
    const token = authHeader.split(" ")[1];
    
    let user = {
      id: Date.now(),
      name: "Test User",
      email: "student@scn.com",
      role: "student"
    };

    if (token.includes("admin")) {
      user = {
        id: 1,
        name: "Rayyan Millionaire",
        email: "rayyan.officialx@gmail.com",
        role: "admin"
      };
    }

    return NextResponse.json(user);
  } catch (e) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updates = await request.json();
    
    // Just echo back the updates merged with a mock user
    return NextResponse.json({
      success: true,
      user: {
        id: 2,
        name: updates.name || "Test Student",
        email: updates.email || "student@scn.com",
        role: "student",
        ...updates
      }
    });
  } catch (e) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
