import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IReservation extends Document {
  slotId: mongoose.Types.ObjectId;

  patientId?: mongoose.Types.ObjectId;

  patientName: string;
  phone: string;

  status: "pending" | "confirmed" | "cancelled";
}

const reservationSchema = new Schema<IReservation>(
  {
    slotId: {
      type: Schema.Types.ObjectId,
      ref: "Slot",
      required: true,
      unique: true, // جلوگیری از رزرو دوباره
    },

    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: false,
    },

    patientName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const Reservation =
  models.Reservation || model<IReservation>("Reservation", reservationSchema);

export default Reservation;
