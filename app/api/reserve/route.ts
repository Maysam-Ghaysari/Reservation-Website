import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Slot from "@/models/Slot";
import Reservation from "@/models/Reservation";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { slotId, patientName, phone } = body;

    if (!slotId || !patientName || !phone) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    // ✅ جلوگیری از رزرو همزمان (خیلی مهم)
    const slot = await Slot.findOneAndUpdate(
      { _id: slotId, isBooked: false },
      { isBooked: true },
      { new: true },
    );

    if (!slot) {
      return NextResponse.json(
        { error: "This slot is already booked" },
        { status: 409 },
      );
    }

    // ساخت رزرو
    const reservation = await Reservation.create({
      slotId,
      patientName,
      phone,
      status: "pending",
    });

    return NextResponse.json({
      message: "Reservation successful",
      reservation,
    });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
