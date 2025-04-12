import mongoose from "mongoose";

const FbSchema = new mongoose.Schema(
  {
    challengeId: {
      type: String,
      ref: "Challenge",
      required: true,
    },
    teamId: {
      type: String,
      ref: "Team",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Fb = mongoose.models.Fb || mongoose.model("Fb", FbSchema);

export default Fb;
