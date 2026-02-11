import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Reservation from "@/models/Reservation";
import Slot from "@/models/Slot";

// POST: رزرو کردن یک Slot
interface CreateReservationBody {
  slotId: string;
  patientId?: string;
  patientName: string;
  phone: string;
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body: CreateReservationBody = await req.json();
    const { slotId, patientId, patientName, phone } = body;

    if (!slotId || !patientName || !phone) {
      return NextResponse.json(
        { error: "slotId, patientName and phone are required" },
        { status: 400 },
      );
    }

    const slot = await Slot.findById(slotId);
    if (!slot)
      return NextResponse.json({ error: "Slot not found" }, { status: 404 });
    if (slot.isBooked)
      return NextResponse.json(
        { error: "Slot is already booked" },
        { status: 409 },
      );

    // ایجاد رزرو
    const reservation = await Reservation.create({
      slotId,
      patientId,
      patientName,
      phone,
      status: "pending",
    });

    // علامت گذاری Slot به booked
    slot.isBooked = true;
    await slot.save();

    return NextResponse.json({ reservation }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// GET: لیست رزروها
export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get("patientId");

    const filter: any = {};
    if (patientId) filter.patientId = patientId;

    const reservations = await Reservation.find(filter)
      .populate("slotId", "date startTime endTime")
      .sort({ createdAt: -1 });

    return NextResponse.json({ reservations });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PATCH: لغو رزرو
export async function PATCH(req: Request) {
  try {
    await connectDB();

    const { reservationId } = await req.json();
    if (!reservationId)
      return NextResponse.json(
        { error: "reservationId is required" },
        { status: 400 },
      );

    const reservation = await Reservation.findById(reservationId);
    if (!reservation)
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 },
      );

    if (reservation.status === "cancelled") {
      return NextResponse.json(
        { error: "Reservation already cancelled" },
        { status: 409 },
      );
    }

    // لغو رزرو
    reservation.status = "cancelled";
    await reservation.save();

    // آزاد کردن Slot
    const slot = await Slot.findById(reservation.slotId);
    if (slot) {
      slot.isBooked = false;
      await slot.save();
    }

    return NextResponse.json({ message: "Reservation cancelled successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
