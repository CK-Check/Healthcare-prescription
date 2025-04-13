import { NextResponse } from 'next/server';
import db from '../../../lib/db/db';
import User from '@/app/models/user.model';
import connectDB from '../../../lib/db/db';

export async function GET() {
  try {
    await connectDB();  
    console.log("Connected to MongoDB");
    const doctor = await User.find({
      where: { role: 'doctor' },
      select: {
        id: true,
        name: true,
        email: true,
        specialty: true
      }
    });

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching doctor data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch doctor data' },
      { status: 500 }
    );
  }
} 