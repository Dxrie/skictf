import mongoose, { Schema, Document } from "mongoose";

export interface ILog extends Document {
  memberId: string;
  challengeId: string;
  solvedAt: Date;
}

const LogSchema: Schema = new Schema({
  memberId: {
    type: String,
    ref: "User",
    required: true,
  },
  challengeId: {
    type: String,
    ref: "Challenge",
    required: true,
  },
  solvedAt: {
    type: Date,
    required: true,
  },
});

export const Log =
  mongoose.models.Log || mongoose.model<ILog>("Log", LogSchema);
