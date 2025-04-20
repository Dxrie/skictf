import mongoose, { Schema, Document } from "mongoose";

export interface IFinish extends Document {
  finish: boolean;
}

const FinishSchema: Schema = new Schema({
  finish: { type: Boolean, required: true },
});

export const FinishModel =
  mongoose.models.Finish || mongoose.model<IFinish>("Finish", FinishSchema);
