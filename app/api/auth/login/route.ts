import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/config/db";
import User from "@/models/User";
import { verifyPassword, generateAccessToken } from "@/utility/auth";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { phone, password } = await req.json();

    // ۱. بررسی وجود کاربر
    const user = await User.findOne({ phone });
    if (!user) {
      return NextResponse.json(
        { message: "کاربری با این شماره یافت نشد" },
        { status: 404 },
      );
    }

    // ۲. تایید پسورد
    const isPasswordCorrect = await verifyPassword(password, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: "شماره تماس یا رمز عبور اشتباه است" },
        { status: 401 },
      );
    }

    // ۳. تولید توکن
    const accessToken = generateAccessToken({ id: user._id, role: user.role });

    await User.findOneAndUpdate({ phone });
    // ۴. تنظیم توکن در کوکی (برای امنیت بیشتر)
    const response = NextResponse.json(
      {
        message: "خوش آمدید",
        user: { fullName: user.fullName, role: user.role },
      },
      { status: 200 },
    );

    response.cookies.set("token", accessToken, {
      httpOnly: true, // غیرقابل دسترسی توسط جاوااسکریپت (امنیت در برابر XSS)
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // ۷ روز
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ message: "خطای سرور" }, { status: 500 });
  }
}
