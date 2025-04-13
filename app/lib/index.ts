import { NextRequest, NextResponse } from "next/server";
import connectDB from "./db/db";
import User from "../models/user.model";

export const GET = async () => {
    try {
        await connectDB();
        const users = await User.find();
        return new NextResponse(JSON.stringify(users), { status: 200 });
    } catch (error: any) {
        return new NextResponse("Error fetching users" + error.message, { status: 500 });
    }
};