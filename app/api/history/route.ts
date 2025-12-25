// app/api/history/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import History from "@/app/models/History";
import mongoose from "mongoose";

// GET - Fetch history for user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session?.user?._id || !mongoose.Types.ObjectId.isValid(session.user._id)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const userObjectId = new mongoose.Types.ObjectId(session.user._id);
    
    // Fetch history entries for the authenticated user, sorted by newest first
    const history = await History.find({ userId: userObjectId })
      .sort({ createdAt: -1 })
      .limit(50) // Limit to 50 most recent entries
      .lean(); // Return plain JS objects
    
    return NextResponse.json({ success: true, data: history });
  } catch (error) {
    console.error("Error fetching history:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}

// POST - Save a new history entry
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session?.user?._id || !mongoose.Types.ObjectId.isValid(session.user._id)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const body = await req.json();
    const { topic, interest, result } = body;
    
    if (!topic || !interest || !result) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const userObjectId = new mongoose.Types.ObjectId(session.user._id);
    
    // Create new history entry for the authenticated user
    const historyEntry = new History({
      userId: userObjectId,
      topic,
      interest,
      result,
      createdAt: new Date(),
    });
    
    await historyEntry.save();
    
    return NextResponse.json({ 
      success: true, 
      message: "History saved successfully",
      data: historyEntry 
    });
  } catch (error) {
    console.error("Error saving history:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save history" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a history entry by ID
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?._id || !mongoose.Types.ObjectId.isValid(session.user._id)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing history ID" },
        { status: 400 }
      );
    }
    
    const deleted = await History.findOneAndDelete({
      _id: id,
      userId: new mongoose.Types.ObjectId(session.user._id),
    });
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "History entry not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "History entry deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting history:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete history" },
      { status: 500 }
    );
  }
}

