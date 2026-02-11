"use client";
import { FC, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [formData, setFormData] = useState({ phone: "", password: "" });
  const router = useRouter();

  const {
    mutate,
    isPending,
    error: serverError,
  } = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await axios.post("/api/auth/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      // هدایت کاربر بر اساس نقش (User یا Doctor)
      if (data.user.role === "DOCTOR") {
        router.push("/doctor-panel");
      } else {
        router.push("/dashboard");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.phone && formData.password) {
      mutate(formData);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg space-y-6">
      {/* عنوان */}
      <div className="text-right font-[vazir]">
        <h1 className="text-3xl font-bold text-gray-800">ورود به حساب</h1>
        <p className="text-gray-500 text-sm mt-2">
          خوشحالیم که دوباره شما را می‌بینیم
        </p>
      </div>

      {/* فرم */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* شماره تماس */}
        <input
          type="text"
          placeholder="شماره تماس"
          className="w-full p-3 bg-gray-500 border border-gray-200 rounded-xl text-right outline-none placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all font-[vazir]"
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />

        {/* رمز عبور */}
        <input
          type="password"
          placeholder="رمز عبور"
          className="w-full p-3 bg-gray-500 border border-gray-200 rounded-xl text-right outline-none placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all font-[vazir]"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />

        {/* نمایش خطا */}
        {serverError && (
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
              {(serverError as any)?.response?.data?.message || "خطایی رخ داد"}
            </p>
          </div>
        )}

        {/* دکمه ورود */}
        <button
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
              در حال بررسی...
            </span>
          ) : (
            "ورود به پنل"
          )}
        </button>
      </form>

      {/* لینک ثبت‌نام */}
      <div className="text-center font-[vazir]">
        <p className="text-gray-600 text-sm">
          حساب کاربری ندارید؟{" "}
          <button className="text-blue-600 font-bold hover:underline">
            ثبت‌نام کنید
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
