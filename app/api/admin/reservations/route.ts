import { NextResponse } from "next/server";
import connectDB from "@/config/db";

import Reservation from "@/models/Reservation";

export async function GET() {
  try {
    await connectDB();

    const reservations = await Reservation.find()
      .populate("slotId")
      .sort({ createdAt: -1 });

    return NextResponse.json(reservations);
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
