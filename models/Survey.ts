import mongoose from "mongoose";

const SurveySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    interestedCategory: {
      type: String,
      enum: [
        "Web Exploitation",
        "Digital Forensics",
        "Cryptography",
        "Reverse Engineering",
        "Binary Exploitation",
        "Miscellaneous",
      ],
      required: true,
    },
    difficultCategory: {
      type: String,
      enum: [
        "Web Exploitation",
        "Digital Forensics",
        "Cryptography",
        "Reverse Engineering",
        "Binary Exploitation",
        "Miscellaneous",
      ],
      required: true,
    },
    mostChallengingChallenge: {
      type: String,
      required: true,
    },
    bestAuthor: {
      type: String,
      required: true,
    },
    feedback: {
      type: String,
      required: true,
    },
  },
  {timestamps: true}
);

const Survey = mongoose.models.Survey || mongoose.model("Survey", SurveySchema);

export default Survey;
