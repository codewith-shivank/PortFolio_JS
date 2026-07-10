import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a client name'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Please add a job role'],
    },
    company: {
      type: String,
      required: [true, 'Please add a company name'],
    },
    quote: {
      type: String,
      required: [true, 'Please add a client review quote'],
    },
    avatar: {
      type: String,
      default: '👤',
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
export default Testimonial;
