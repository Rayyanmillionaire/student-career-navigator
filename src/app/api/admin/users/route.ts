import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.includes("admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Mock Users Directory
    const users = [
      { id: 1, name: "Rayyan Millionaire", email: "rayyan.officialx@gmail.com", role: "admin", college: "Tech University", major: "Software Engineering" },
      { id: 2, name: "Test Student", email: "student@scn.com", role: "student", college: "Global University", major: "Computer Science" },
      { id: 3, name: "Alice Johnson", email: "alice.j@example.com", role: "student", college: "State College", major: "Data Science" },
      { id: 4, name: "Bob Smith", email: "bob.s@example.com", role: "student", college: "Tech University", major: "Business" },
      { id: 5, name: "Eve Williams", email: "eve.w@example.com", role: "student", college: "Global University", major: "Design" }
    ];

    return NextResponse.json(users);
  } catch (e) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
