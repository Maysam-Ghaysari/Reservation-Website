import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  phone: string;
  email?: string;
  password: string;

  role: "USER" | "DOCTOR";

  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
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
      enum: ["USER", "DOCTOR"],
      default: "USER",
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const User = models.User || model<IUser>("User", userSchema);

export default User;
