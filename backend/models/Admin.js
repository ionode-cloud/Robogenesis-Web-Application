import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    plainPassword: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      default: 'Root Administrator',
    },
    labAccess: {
      type: String,
      default: 'Full System Root',
    },
  },
  {
    timestamps: true,
  }
);

export const AdminModel = mongoose.models.Admin || mongoose.model('Admin', adminSchema);
export default AdminModel;
