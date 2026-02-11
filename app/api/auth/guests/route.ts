import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Guest, { IGuest } from "@/models/Guest";

// تایپ body
interface CreatePatientBody {
  fullName: string;
  phone: string;
  email?: string;
  role?: "Guest";
}

export async function POST(req: Request) {
  try {
    // 1️⃣ اتصال به دیتابیس
    await connectDB();

    // 2️⃣ گرفتن body و تایپینگ
    const body: CreatePatientBody = (await req.json()) as CreatePatientBody;
    const { fullName, phone, email, role } = body;

    // 3️⃣ اعتبارسنجی اولیه
    if (!fullName || !phone) {
      return NextResponse.json(
        { error: "fullName and phone are required" },
        { status: 400 },
      );
    }

    // 4️⃣ ایجاد Patient جدید
    const patient = await Guest.create({
      fullName,
      phone,
      email,
      role,
    });

    // 5️⃣ برگرداندن پاسخ موفق
    return NextResponse.json({ patient }, { status: 201 });
  } catch (error: any) {
    console.error(error);

    // خطای Duplicate key
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Phone or email already exists" },
        { status: 409 },
      );
    }

    // خطای سرور
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
