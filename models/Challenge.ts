import mongoose from 'mongoose';

const ChallengeSchema = new mongoose.Schema({
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
  fileUrl: {
    type: String,
    required: true,
    validate: {
      validator: function(v: string) {
        return v.startsWith('https://github.com/') || v.startsWith('https://raw.githubusercontent.com/');
      },
      message: 'File URL must be a GitHub link'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Challenge = mongoose.models.Challenge || mongoose.model('Challenge', ChallengeSchema);

export default Challenge;