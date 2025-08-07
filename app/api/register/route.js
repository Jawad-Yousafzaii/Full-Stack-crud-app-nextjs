// app/api/register/route.js
import dbConnect from "../../../lib/dbConnect";
import User from "../../models/User";
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await dbConnect();
    const { email, password } = await request.json();

    const newUser = new User({ email, password });
    await newUser.save();

    return NextResponse.json({ message: "User created successfully" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error creating user", error: error.message }, { status: 500 });
  }
}