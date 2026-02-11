"use client";
import React from "react";
import Link from "next/link";
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineLocationMarker,
  HiOutlinePhone,
  HiChevronLeft,
} from "react-icons/hi";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 font-[vazir]" dir="rtl">
      {/* --- Navbar --- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-xl font-bold text-blue-700">دکتر علی محمدی</div>
          <div className="hidden md:flex gap-8 text-gray-600 font-medium text-sm">
            <a href="#about" className="hover:text-blue-600 transition">
              بیوگرافی
            </a>
            <a href="#services" className="hover:text-blue-600 transition">
              خدمات
            </a>
            <a href="#contact" className="hover:text-blue-600 transition">
              تماس و آدرس
            </a>
          </div>
          <Link
            href="/login-register"
            className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold hover:bg-blue-700 transition-all text-sm shadow-md shadow-blue-100"
          >
            ورود / ثبت‌نام بیمار
          </Link>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="max-w-7xl mx-auto px-6 py-12 lg:py-20 flex flex-col lg:flex-row items-center gap-12">
        {/* تصویر دکتر */}
        <div className="w-full lg:w-1/2 flex justify-center order-2 lg:order-1">
          <div className="relative">
            <div className="absolute -inset-4 bg-blue-200 rounded-[2rem] rotate-6 opacity-30"></div>
            <div className="relative w-72 h-72 md:w-[400px] md:h-[400px] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="/images/doctor-portrait.jpg" // عکس دکتر را اینجا قرار بده
                alt="Dr. Ali Mohammadi"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* توضیحات */}
        <div className="w-full lg:w-1/2 text-right space-y-8 order-1 lg:order-2">
          <div className="space-y-4">
            <span className="bg-blue-100 text-blue-800 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider">
              متخصص و جراح مغز و اعصاب
            </span>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 leading-[1.3]">
              مشاوره و رزرو آنلاین نوبت <br />
              <span className="text-blue-600">دکتر علی محمدی</span>
            </h1>
            <p className="text-slate-600 text-lg leading-relaxed">
              با بیش از ۱۵ سال تجربه در جراحی‌های پیچیده و درمان‌های نوین. هدف
              ما بازگرداندن سلامتی و لبخند به لبان شماست. هم‌اکنون می‌توانید
              زمان حضور خود را به‌صورت آنلاین رزرو کنید.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              href="/reserve"
              className="flex-1 bg-blue-600 text-white text-center py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-xl shadow-blue-200"
            >
              <HiOutlineCalendar size={24} />
              رزرو نوبت حضوری
            </Link>
            <Link
              href="#about"
              className="flex-1 bg-white border border-slate-200 text-slate-700 text-center py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 transition"
            >
              مشاهده بیوگرافی
            </Link>
          </div>
        </div>
      </section>

      {/* --- Quick Info Cards --- */}
      <section className="bg-white border-y border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <InfoCard
            icon={<HiOutlineClock className="text-blue-600" size={32} />}
            title="ساعات حضور"
            desc="شنبه تا چهارشنبه - ۱۶:۰۰ الی ۲۰:۰۰"
          />
          <InfoCard
            icon={
              <HiOutlineLocationMarker className="text-red-500" size={32} />
            }
            title="آدرس مطب"
            desc="تهران، خیابان ولیعصر، ساختمان پزشکان..."
          />
          <InfoCard
            icon={<HiOutlinePhone className="text-green-600" size={32} />}
            title="شماره تماس"
            desc="۰۲۱-۸۸۰۰۰۰۰۰"
          />
        </div>
      </section>

      {/* --- About Section --- */}
      <section
        id="about"
        className="max-w-4xl mx-auto px-6 py-20 text-center space-y-6"
      >
        <h2 className="text-3xl font-bold text-slate-800">درباره پزشک</h2>
        <div className="h-1.5 w-20 bg-blue-600 mx-auto rounded-full"></div>
        <p className="text-slate-600 leading-[2] text-lg">
          دکتر علی محمدی فارغ‌التحصیل ممتاز دانشگاه علوم پزشکی تهران و دارای
          فلوشیپ تخصصی از دانشگاه آلمان هستند. ایشان با انجام بیش از ۱۰۰۰ جراحی
          موفق، یکی از پیشگامان در حوزه جراحی‌های میکروسکوپی در ایران شناخته
          می‌شوند.
        </p>
      </section>
    </div>
  );
}

// کامپوننت کارت اطلاعات
function InfoCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:scale-105">
      <div className="p-3 bg-white rounded-xl shadow-sm">{icon}</div>
      <div className="text-right">
        <h4 className="font-bold text-slate-800 mb-1">{title}</h4>
        <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
