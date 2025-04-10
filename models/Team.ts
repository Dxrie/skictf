import mongoose from "mongoose";

export interface ITeam extends mongoose.Document {
  name: string;
  members: mongoose.Types.ObjectId[];
  leader: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  score: number;
  showInLeaderboard: boolean;
  teamCode: string;
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
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Team leader is required"],
    },
    score: {
      type: Number,
      default: 0,
    },
    showInLeaderboard: {
      type: Boolean,
      default: true,
    },
    teamCode: {
      type: String,
      required: [true, "Team code is required"],
      unique: true,
      trim: true,
      maxlength: [6, "Team code cannot be longer than 6 characters"],
    },
  },
  { timestamps: true },
);

// Middleware to ensure leader inclusion
teamSchema.pre("save", async function (next) {
  // Ensure leader is included in members
  if (!this.members.includes(this.leader)) {
    this.members.push(this.leader);
  }
  next();
});

export const Team =
  mongoose.models.Team || mongoose.model<ITeam>("Team", teamSchema);
