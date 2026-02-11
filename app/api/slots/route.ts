import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Slot from "@/models/Slot";

interface CreateSlotBody {
  date: string;
  startTime: string;
  endTime: string;
}

// GET همه Slotهای آزاد بر اساس تاریخ
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    const slots = await Slot.find({ date, isBooked: false }).sort({
      startTime: 1,
    });
    return NextResponse.json(slots);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// POST ایجاد Slot جدید
export async function POST(req: Request) {
  try {
    await connectDB();
    const body: CreateSlotBody = await req.json();
    const { date, startTime, endTime } = body;

    if (!date || !startTime || !endTime) {
      return NextResponse.json(
        { error: "date, startTime, and endTime are required" },
        { status: 400 },
      );
    }

    const existing = await Slot.findOne({ date, startTime, endTime });
    if (existing) {
      return NextResponse.json(
        { error: "This slot already exists" },
        { status: 409 },
      );
    }

    const slot = await Slot.create({ date, startTime, endTime });
    return NextResponse.json({ slot }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
