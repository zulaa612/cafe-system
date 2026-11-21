import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/app/db";
import { users } from "@/app/db/schema";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const name = body.name?.trim();
    const phone = body.phone;

    if (
      typeof name !== "string" ||
      name.length < 2 ||
      name.length > 100 ||
      typeof phone !== "string" ||
      !/^\+976\d{8}$/.test(phone)
    ) {
      return NextResponse.json(
        { error: "Invalid name or phone number" },
        { status: 400 },
      );
    }

    const [user] = await db
      .insert(users)
      .values({ clerkId: userId, name, phone })
      .onConflictDoUpdate({
        target: users.clerkId,
        set: { name, phone },
      })
      .returning();

    return NextResponse.json(
      { message: "Profile saved", user },
      { status: 200 },
    );
  } catch (error) {
    console.error("Onboarding failed:", error);
    return NextResponse.json(
      { error: "Unable to save profile." },
      { status: 500 },
    );
  }
}
