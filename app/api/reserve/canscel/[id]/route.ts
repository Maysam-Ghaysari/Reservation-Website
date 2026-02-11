import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Reservation from "@/models/Reservation";
import Slot from "@/models/Slot";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();

    const reservation = await Reservation.findById(params.id);

    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 },
      );
    }

    // آزاد کردن slot
    await Slot.findByIdAndUpdate(reservation.slotId, {
      isBooked: false,
    });

    // لغو رزرو
    reservation.status = "cancelled";
    await reservation.save();

    return NextResponse.json({
      message: "Reservation cancelled successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
