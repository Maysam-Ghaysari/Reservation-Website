import mongoose, { Schema, model, models, Document } from "mongoose";

export interface ISlot extends Document {
  date: string; // "2026-02-10"
  startTime: string; // "10:00"
  endTime: string; // "10:30"

  isBooked: boolean;
}

const slotSchema = new Schema<ISlot>(
  {
    date: {
      type: String,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    isBooked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Slot = models.Slot || model<ISlot>("Slot", slotSchema);

export default Slot;
