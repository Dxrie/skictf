import mongoose from "mongoose";

const ChallengeSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
  },
  fileUrls: {
    type: [
      {
        type: String,
        required: true,
      },
    ],
    required: true,
    default: [],
  },
  solves: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  solveCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  flag: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  published: {
    type: Boolean,
    default: false,
  },
});

// Add index for better query performance
ChallengeSchema.index({ title: 1 });
ChallengeSchema.index({ category: 1 });
ChallengeSchema.index({ points: 1 });

const Challenge =
  mongoose.models.Challenge || mongoose.model("Challenge", ChallengeSchema);

export default Challenge;
