import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Please add a company name'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Please add a job role'],
      trim: true,
    },
    duration: {
      type: String,
      required: [true, 'Please add job duration details (e.g. 2024 - Present)'],
    },
    description: {
      type: String,
      required: [true, 'Please add experience description'],
    },
    achievements: {
      type: [String],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Experience = mongoose.model('Experience', experienceSchema);
export default Experience;
