import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a project title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a project description'],
    },
    image: {
      type: String,
      required: [true, 'Please add an image URL'],
    },
    github: {
      type: String,
      default: '#',
    },
    liveUrl: {
      type: String,
      default: '#',
    },
    techStack: {
      type: [String],
      required: [true, 'Please add tech stack tags'],
    },
    category: {
      type: String,
      enum: ['fullstack', 'frontend', 'backend', 'mobile'],
      default: 'frontend',
    },
    featured: {
      type: Boolean,
      default: false,
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

const Project = mongoose.model('Project', projectSchema);
export default Project;
