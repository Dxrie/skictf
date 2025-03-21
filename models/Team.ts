import mongoose from "mongoose";
import { IUser } from "./User";

export interface ITeam extends mongoose.Document {
  name: string;
  members: mongoose.Types.ObjectId[];
  leader: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const teamSchema = new mongoose.Schema<ITeam>(
  {
    name: {
      type: String,
      required: [true, "Team name is required"],
      unique: true,
      trim: true,
    },
    members: {
      type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }]
    },
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Team leader is required"]
    }
  },
  { timestamps: true }
);

// Middleware to ensure leader inclusion
teamSchema.pre("save", async function(next) {
  // Ensure leader is included in members
  if (!this.members.includes(this.leader)) {
    this.members.push(this.leader);
  }
  next();
});

export const Team = mongoose.models.Team || mongoose.model<ITeam>("Team", teamSchema);