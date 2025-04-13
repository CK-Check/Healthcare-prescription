import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db/db';
import User from '@/app/models/user.model';

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectDB();
    
    const user = new User(body);
    await user.save();
    
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
} 