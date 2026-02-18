// components/Footer.tsx
import React from "react";
import Link from "next/link";
import { HiPhone, HiMail, HiClock, HiGlobeAlt } from "react-icons/hi";

export default function Footer() {
  const quickLinks = [
    { title: "صفحه اصلی", href: "/" },
    { title: "درباره دکتر", href: "/about" },
    { title: "خدمات و تخصص‌ها", href: "/services" },
    { title: "رزرو نوبت آنلاین", href: "/appointment" },
    { title: "سوالات متداول", href: "/faq" },
    { title: "تماس با ما", href: "/contact" },
  ];

  const contactInfo = [
    { icon: HiPhone, text: "021-12345678", href: "tel:02112345678" },
    {
      icon: HiMail,
      text: "info@dr-example.ir",
      href: "mailto:info@dr-example.ir",
    },
    // { icon: HiMapPin, text: "تهران، خیابان ولیعصر، پلاک ۱۲۳۴", href: "#" },
    { icon: HiClock, text: "شنبه تا پنج‌شنبه: ۱۶ تا ۲۱", href: "#" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* ستون ۱ - درباره دکتر */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xl">
                د
              </div>
              <h3 className="text-xl font-bold text-white">
                دکتر [نام خانوادگی]
              </h3>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6">
              متخصص [تخصص] با بیش از [X] سال سابقه فعالیت حرفه‌ای. ارائه خدمات
              تخصصی با استفاده از جدیدترین روش‌های درمانی و تجهیزات پیشرفته.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition"
              >
                <HiGlobeAlt className="text-2xl" />
              </a>
              {/* می‌توانید آیکون‌های اینستاگرام، تلگرام و ... اضافه کنید */}
            </div>
          </div>

          {/* ستون ۲ - لینک‌های سریع */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">
              لینک‌های مفید
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-blue-400 transition hover:translate-x-1 inline-block"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ستون ۳ - اطلاعات تماس */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">
              اطلاعات تماس
            </h4>
            <ul className="space-y-4">
              {contactInfo.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.href}
                    className="flex items-center gap-3 text-gray-400 hover:text-blue-400 transition"
                  >
                    <item.icon className="text-xl text-blue-500" />
                    <span>{item.text}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ستون ۴ - ساعات کاری + نقشه کوچک (اختیاری) */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">
              ساعات پذیرش
            </h4>
            <div className="space-y-3 text-gray-400">
              <p>شنبه تا چهارشنبه: ۱۶:۰۰ – ۲۱:۰۰</p>
              <p>پنج‌شنبه: ۱۶:۰۰ – ۱۹:۰۰</p>
              <p className="text-red-400 font-medium">جمعه: تعطیل</p>

              <div className="mt-6 pt-4 border-t border-gray-700">
                <p className="text-sm">
                  مطب واقع در مرکز شهر با دسترسی آسان به وسایل نقلیه عمومی
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-gray-800 bg-gray-950 py-5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} دکتر [نام خانوادگی] – تمامی حقوق محفوظ
          است | طراحی و توسعه با ❤️ توسط [نام شما یا شرکت]
        </div>
      </div>
    </footer>
  );
}
