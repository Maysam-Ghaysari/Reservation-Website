"use client";
import { FC, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { validatePhone, validatePassword, validateName } from "@/utility/auth";

const RegisterForm = () => {
  // ۱. استیت‌های فرم
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    password: "",
  });
  const [clientError, setClientError] = useState("");

  // ۲. تعریف Mutation مستقیماً در کامپوننت
  const {
    mutate,
    isPending,
    error: serverError,
  } = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await axios.post("/api/auth/register", data);
      return response.data;
    },
    onSuccess: () => {
      alert("ثبت‌نام با موفقیت انجام شد! حالا می‌توانید وارد شوید.");
    },
  });

  // ۳. هندل کردن ارسال فرم
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setClientError("");

    // اعتبار سنجی کلاینت
    if (!validateName(formData.fullName))
      return setClientError("نام وارد شده معتبر نیست.");
    if (!validatePhone(formData.phone))
      return setClientError("شماره تماس معتبر نیست.");
    if (!validatePassword(formData.password))
      return setClientError("رمز عبور باید حداقل ۸ کاراکتر و ترکیبی باشد.");

    // ارسال به سرور
    mutate(formData);
  };

  return (
    <div className="max-w-md mx-auto space-y-6 p-6 bg-white rounded-2xl shadow-lg">
      {/* عنوان */}
      <div className="text-right">
        <h1 className="text-3xl font-bold text-gray-800 font-[vazir]">
          ایجاد حساب کاربری
        </h1>
        <p className="text-gray-500 text-sm mt-2 font-[vazir]">
          لطفاً اطلاعات خود را وارد کنید
        </p>
      </div>

      {/* فرم */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* نام و نام خانوادگی */}
        <input
          type="text"
          placeholder="نام و نام خانوادگی"
          value={formData.fullName}
          onChange={(e) =>
            setFormData({ ...formData, fullName: e.target.value })
          }
          className="w-full p-3 bg-gray-500 border border-gray-200 rounded-xl text-right outline-none placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all font-[vazir]"
        />

        {/* شماره تماس */}
        <input
          type="text"
          placeholder="شماره تماس (مثلاً ۰۹۱۲...)"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full p-3 bg-gray-500 border border-gray-200 rounded-xl text-right outline-none placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all font-[vazir]"
        />

        {/* رمز عبور */}
        <input
          type="password"
          placeholder="رمز عبور"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className="w-full p-3 bg-gray-500 border border-gray-200 rounded-xl text-right outline-none placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all font-[vazir]"
        />

        {/* نمایش خطا */}
        {(clientError || serverError) && (
          <div className="flex items-center gap-2 bg-red-50 p-3 rounded-lg border border-red-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-red-500 "
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.681-1.36 3.446 0l6.518 11.591c.75 1.334-.213 2.91-1.723 2.91H3.462c-1.51 0-2.473-1.576-1.723-2.91L8.257 3.1zM11 13a1 1 0 10-2 0 1 1 0 002 0zm-1-5a1 1 0 00-.993.883L9 9v3a1 1 0 001.993.117L11 12V9a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-red-600 text-sm font-[vazir]">
              {clientError ||
                (serverError as any)?.response?.data?.message ||
                "خطایی در ثبت‌نام رخ داد"}
            </p>
          </div>
        )}

        {/* دکمه ثبت‌نام */}
        <button
          type="submit"
          disabled={isPending}
          className={`w-full py-3 rounded-xl text-white font-bold text-lg shadow-md transition-all ${
            isPending
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:from-blue-600 hover:to-blue-700 active:scale-95 shadow-blue-300"
          }`}
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              در حال ثبت‌نام...
            </span>
          ) : (
            "تایید و عضویت"
          )}
        </button>
      </form>

      {/* لینک ورود */}
      <div className="text-center pt-3">
        <p className="text-gray-600 text-sm font-[vazir]">
          قبلاً عضو شده‌اید؟{" "}
          <button className="text-blue-600 font-bold hover:underline">
            وارد شوید
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
