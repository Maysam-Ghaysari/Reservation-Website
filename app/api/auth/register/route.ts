import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/config/db";
import User from "@/models/User";
import {
  hashPassword,
  validatePhone,
  validatePassword,
  validateName,
} from "@/utility/auth";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { fullName, phone, password, role } = body;

    // ۱. اعتبار سنجی فیلدها (Server-side Validation)
    if (
      !validateName(fullName) ||
      !validatePhone(phone) ||
      !validatePassword(password)
    ) {
      return NextResponse.json(
        { message: "اطلاعات وارد شده معتبر نیست" },
        { status: 400 },
      );
    }

    // ۲. بررسی تکراری نبودن کاربر (User Existence)
    const isUserExist = await User.findOne({ phone });

    if (isUserExist) {
      return NextResponse.json(
        { message: "کاربری با این شماره تماس قبلاً ثبت‌نام کرده است" },
        { status: 422 },
      );
    }

    // ۳. هش کردن پسورد (Security)
    const hashedPassword = await hashPassword(password);

    // ۴. ایجاد کاربر جدید
    const newUser = await User.create({
      fullName,
      phone,
      password: hashedPassword,
      role: role || "USER", // اگر رولی فرستاده نشد، پیش‌فرض USER
    });

    // ۵. پاسخ موفقیت‌آمیز (بدون فرستادن پسورد در پاسخ)
    return NextResponse.json(
      {
        message: "ثبت‌نام با موفقیت انجام شد",
        user: { fullName: newUser.fullName, phone: newUser.phone },
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Register API Error:", error);
    return NextResponse.json(
      { message: "خطای سرور", error: error.message },
      { status: 500 },
    );
  }
}
