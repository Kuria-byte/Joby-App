import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  matchId: string;
  senderId: string;
  content: string;
  readAt?: Date;
  type: 'text' | 'image' | 'file';
}

const messageSchema = new Schema({
  matchId: { type: Schema.Types.ObjectId, ref: 'Match', required: true },
  senderId: { type: String, required: true },
  content: { type: String, required: true },
  readAt: { type: Date },
  type: { 
    type: String, 
    enum: ['text', 'image', 'file'],
    default: 'text'
  }
}, {
  timestamps: true
});

// Create indexes for efficient querying
messageSchema.index({ matchId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1, createdAt: -1 });

export const Message = mongoose.model<IMessage>('Message', messageSchema);
