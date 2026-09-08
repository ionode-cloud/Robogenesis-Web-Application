import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      index: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    company: {
      type: String,
      trim: true,
      default: '',
    },
    enquiryType: {
      type: String,
      trim: true,
      default: 'General Consultation',
    },
    domain: {
      type: String,
      trim: true,
      default: 'General Robotics',
    },
    interest: {
      type: String,
      trim: true,
      default: '',
    },
    message: {
      type: String,
      trim: true,
      default: '',
    },
    projectDetails: {
      type: String,
      trim: true,
      default: '',
    },
    budget: {
      type: String,
      trim: true,
      default: '',
    },
    timeline: {
      type: String,
      trim: true,
      default: '',
    },
    sourceTab: {
      type: String,
      trim: true,
      default: 'Contact Us',
    },
    status: {
      type: String,
      enum: ['new', 'in-review', 'resolved'],
      default: 'new',
      index: true,
    },
    submittedAt: {
      type: String,
      default: () => new Date().toISOString(),
    },
  },
  {
    timestamps: true,
  }
);

export const EnquiryModel = mongoose.models.Enquiry || mongoose.model('Enquiry', enquirySchema);
export default EnquiryModel;
