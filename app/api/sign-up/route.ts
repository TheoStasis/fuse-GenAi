import dbConnect from "@/lib/dbConnect";
import User from "@/models/User.model";
import bcrypt from "bcryptjs";
import { ApiResponse } from "@/types/ApiResponse";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();

    // Validate input
    if (!username || !email || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "All fields are required",
        } as ApiResponse),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Check if username already exists
    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Username already taken",
        } as ApiResponse),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Check if email already exists
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Email already registered",
        } as ApiResponse),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Hash password and create user (verified by default)
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isVerified: true, // Automatically verified
      conversationHistory: [],
    });
    
    // Save without strict validation for optional fields
    await newUser.save({ validateBeforeSave: false });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Account created successfully",
      } as ApiResponse),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Error in sign-up route:", err);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal Server Error",
      } as ApiResponse),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
