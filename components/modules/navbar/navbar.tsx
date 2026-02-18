// components/Navbar.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaBars,
  FaTimes,
  FaCalendarAlt,
  FaUser,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";

const navLinks = [
  { title: "صفحه اصلی", href: "/" },
  { title: "درباره دکتر", href: "/about" },
  { title: "خدمات", href: "/services" },
  { title: "مقالات", href: "/blog" },
  { title: "تماس با ما", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-[vazir]  ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm"
          : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 md:h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white text-xl">
              د
            </div>
            <Link href="/" className="text-xl  text-gray-900 md:text-2xl">
              دکتر [نام خانوادگی]
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-blue-600  transition-colors relative group"
              >
                {link.title}
                <span className="absolute -bottom-1 right-0 left-0 h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-right" />
              </Link>
            ))}
          </nav>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-4 font-[vazir] ">
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 font-[vazir]  transition"
            >
              <FaSignInAlt size={18} />
              ورود
            </Link>

            <Link
              href="/appointment"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-[vazir]  px-5 py-2.5 rounded-lg transition shadow-sm hover:shadow"
            >
              <FaCalendarAlt size={18} className="font-[vazir] " />
              رزرو نوبت
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[500px] border-t" : "max-h-0"
        } bg-white shadow-lg`}
      >
        <div className="px-4 py-6 space-y-5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-lg  text-gray-800 hover:text-blue-600 py-1 transition"
              onClick={() => setIsOpen(false)}
            >
              {link.title}
            </Link>
          ))}

          <div className="pt-4 border-t border-gray-200 space-y-4">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 w-full py-3 text-gray-700  border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              onClick={() => setIsOpen(false)}
            >
              <FaSignInAlt size={20} />
              ورود به حساب
            </Link>

            <Link
              href="/appointment"
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-sm"
              onClick={() => setIsOpen(false)}
            >
              <FaCalendarAlt size={20} />
              دریافت نوبت جدید
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
