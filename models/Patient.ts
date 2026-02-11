import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IPatient extends Document {
  fullName: string;
  phone: string;
  email?: string;

  role: "PATIENT" | "DOCTOR" | "ADMIN";

  createdAt: Date;
  updatedAt: Date;
}

const patientSchema = new Schema<IPatient>(
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
      enum: ["PATIENT", "DOCTOR", "ADMIN"],
      default: "PATIENT",
    },
  },
  { timestamps: true },
);

const Patient = models.Patient || model<IPatient>("Patient", patientSchema);

export default Patient;
