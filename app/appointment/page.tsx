"use client";

import { useState } from "react";
import { format, isToday, addDays, isBefore } from "date-fns";
import { faIR } from "date-fns/locale";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface AvailableSlot {
  _id: number;
  date: string; // "2026-02-20"
  startTime: string; // "10:00"
  endTime: string; // "10:15"
  isBooked: boolean;
}

interface ReservationForm {
  patientName: string;
  phone: string;
  note: string;
}

const fetchAvailableSlots = async (date: string): Promise<AvailableSlot[]> => {
  const { data } = await axios.get(`/api/slots?date=${date}`);
  return data;
};

const createReservation = async (payload: {
  slotId: number;
  patientName: string;
  phone: string;
  note?: string;
}) => {
  const { data } = await axios.post("/api/reservations", payload);
  return data;
};

export default function AppointmentBooking() {
  const queryClient = useQueryClient();

  const [selectedDate, setSelectedDate] = useState(() =>
    format(new Date(), "yyyy-MM-dd"),
  );
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [form, setForm] = useState<ReservationForm>({
    patientName: "",
    phone: "",
    note: "",
  });

  const {
    data: slots = [],
    isLoading,
    isError,
  } = useQuery<AvailableSlot[]>({
    queryKey: ["available-slots", selectedDate],
    queryFn: () => fetchAvailableSlots(selectedDate),
    select: (data) => data.filter((s) => !s.isBooked),
    staleTime: 2 * 60 * 1000, // 2 دقیقه
  });

  const mutation = useMutation({
    mutationFn: createReservation,
    onSuccess: () => {
      queryClient.setQueryData<AvailableSlot[]>(
        ["available-slots", selectedDate],
        (old = []) => old.filter((s) => s._id !== selectedSlotId),
      );
      setSelectedSlotId(null);
      setForm({ patientName: "", phone: "", note: "" });
    },
  });

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
    setSelectedSlotId(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSlotId) {
      alert("لطفاً یک زمان انتخاب کنید");
      return;
    }
    if (!form.patientName.trim() || !form.phone.trim()) {
      alert("نام و شماره تماس الزامی است");
      return;
    }
    if (!/^09[0-9]{9}$/.test(form.phone)) {
      alert("شماره موبایل نامعتبر است");
      return;
    }

    mutation.mutate({
      slotId: selectedSlotId,
      patientName: form.patientName,
      phone: form.phone,
      note: form.note || undefined,
    });
  };

  const today = format(new Date(), "yyyy-MM-dd");
  const maxDate = format(addDays(new Date(), 60), "yyyy-MM-dd"); // مثلاً ۲ ماه جلوتر

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10 px-4 sm:px-6 lg:px-8 font-[vazir] ">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
        {/* هدر */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-7 text-white">
          <h1 className="text-2xl md:text-3xl font-[vazir] ">
            رزرو نوبت ویزیت
          </h1>
          <p className="mt-2 text-blue-100">
            زمان مناسب خود را انتخاب کنید و نوبت خود را ثبت نمایید
          </p>
        </div>

        <div className="p-6 md:p-8">
          {/* انتخاب تاریخ */}
          <div className="mb-10">
            <label className="block text-gray-700 font-[vazir]  mb-3 text-lg">
              تاریخ ویزیت
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              min={today}
              max={maxDate}
              className="w-full max-w-xs px-4 py-3 border border-gray-300 rounded-xl 
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                       transition-all outline-none shadow-sm"
            />
            <p className="mt-2 text-sm text-gray-500">
              {format(new Date(selectedDate), "EEEE dd MMMM yyyy", {
                locale: faIR,
              })}
            </p>
          </div>

          {/* لیست اسلات‌ها */}
          <div className="mb-12">
            <h2 className="text-xl font-[vazir]  text-gray-800 mb-5 flex items-center gap-2">
              زمان‌های موجود
              {selectedDate && (
                <span className="text-base font-[vazir]  text-gray-500">
                  ({format(new Date(selectedDate), "dd MMMM", { locale: faIR })}
                  )
                </span>
              )}
            </h2>

            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="h-14 bg-gray-200 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : isError ? (
              <div className="text-center py-12 text-red-600 bg-red-50 rounded-xl">
                خطا در دریافت زمان‌ها. لطفاً دوباره تلاش کنید.
              </div>
            ) : slots.length === 0 ? (
              <div className="text-center py-12 text-gray-600 bg-gray-50 rounded-xl border border-dashed">
                هیچ نوبت آزادی برای این تاریخ وجود ندارد
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                {slots.map((slot) => (
                  <button
                    key={slot._id}
                    onClick={() => setSelectedSlotId(slot._id)}
                    className={`
                      py-3.5 px-4 rounded-xl text-center transition-all duration-200
                      border shadow-sm
                      ${
                        selectedSlotId === slot._id
                          ? "bg-blue-600 text-white border-blue-700 ring-2 ring-blue-300/50 scale-[1.03]"
                          : "bg-white text-blue-800 border-blue-200 hover:bg-blue-50 hover:border-blue-300 active:bg-blue-100"
                      }
                    `}
                  >
                    {slot.startTime} – {slot.endTime}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* فرم رزرو */}
          {selectedSlotId && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-xl  text-gray-800 pb-3 border-b">
                اطلاعات بیمار
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700  mb-2">
                    نام و نام خانوادگی <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="patientName"
                    value={form.patientName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl 
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    شماره همراه <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleInputChange}
                    required
                    pattern="09[0-9]{9}"
                    placeholder="09123456789"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl 
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  توضیحات / علائم (اختیاری)
                </label>
                <textarea
                  name="note"
                  value={form.note}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl 
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                />
              </div>

              {mutation.isError && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center">
                  {mutation.error instanceof Error
                    ? mutation.error.message
                    : "خطایی در ثبت نوبت رخ داد. لطفاً دوباره امتحان کنید."}
                </div>
              )}

              {mutation.isSuccess && (
                <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-center">
                  نوبت شما با موفقیت ثبت شد ✓
                </div>
              )}

              <button
                type="submit"
                disabled={mutation.isPending || isLoading}
                className={`
                  w-full py-4 px-6 text-white rounded-xl
                  transition-all duration-200 shadow-md
                  ${
                    mutation.isPending || isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                  }
                `}
              >
                {mutation.isPending
                  ? "در حال ثبت نوبت..."
                  : "تأیید و رزرو نوبت"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
