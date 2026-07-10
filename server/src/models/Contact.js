import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a sender name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add a contact email'],
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    message: {
      type: String,
      required: [true, 'Please add a message content'],
    },
    subject: {
      type: String,
      default: '',
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Contact = mongoose.model('Contact', contactSchema);
export default Contact;
