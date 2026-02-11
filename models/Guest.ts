import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IGuest extends Document {
  fullName: string;
  phone: string;
  email?: string;
  role: "Guest";
  slotId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const patientSchema = new Schema<IGuest>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
    },

    role: {
      type: String,
      enum: ["Guest"],
      default: "Guest",
    },
    slotId: {
      type: Schema.Types.ObjectId,
      ref: "Slot",
      required: true,
      unique: true, // جلوگیری از رزرو دوباره
    },
  },
  { timestamps: true },
);

const Guest = models.Patient || model<IGuest>("Guest", patientSchema);

export default Guest;
