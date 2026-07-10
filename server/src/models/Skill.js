import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a skill name'],
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please add a skill category'],
      enum: ['frontend', 'backend', 'database', 'tools'],
      default: 'frontend',
    },
    proficiency: {
      type: Number,
      required: [true, 'Please add proficiency percentage'],
      min: 0,
      max: 100,
    },
    icon: {
      type: String,
      default: '💻',
    },
    certified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Skill = mongoose.model('Skill', skillSchema);
export default Skill;
