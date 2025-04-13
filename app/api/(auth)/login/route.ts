import connectDB from "@/app/lib/db/db";
import User from "@/app/models/user.model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    await connectDB();
    console.log("Connected to MongoDB");

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if password matches
    if (user.password !== password) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user.toObject();
    
    return NextResponse.json({
      message: "Login successful",
      user: userWithoutPassword
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Failed to process login" },
      { status: 500 }
    );
  }
}