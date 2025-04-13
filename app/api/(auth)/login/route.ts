import connectDB from "@/app/lib/db/db";
import User from "@/app/models/user.model";

import { NextResponse } from "next/server";

export async function GET() {
    try {
      await connectDB();
      console.log("Connected to MongoDB");
      const users = await User.find({email: String});
      return NextResponse.json(users);
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 }
      );
    }
  }