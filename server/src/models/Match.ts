import mongoose, { Document, Schema } from 'mongoose';

export interface IMatch extends Document {
  jobId: string;
  userId: string;
  employerId: string;
  jobTitle: string;
  companyName: string;
  matchedAt: Date;
  status: 'pending' | 'active' | 'closed';
  lastMessageAt?: Date;
}

const matchSchema = new Schema({
  jobId: { type: String, required: true },
  userId: { type: String, required: true },
  employerId: { type: String, required: true },
  jobTitle: { type: String, required: true },
  companyName: { type: String, required: true },
  matchedAt: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['pending', 'active', 'closed'],
    default: 'pending'
  },
  lastMessageAt: { type: Date }
}, {
  timestamps: true
});

// Create a compound index for efficient match checking
matchSchema.index({ jobId: 1, userId: 1 }, { unique: true });

export const Match = mongoose.model<IMatch>('Match', matchSchema);
