import mongoose from 'mongoose';
const { Schema } = mongoose;

const AnswerSchema = new Schema({
  questionId: String,
  // For different types, we keep a generic structure
  value: Schema.Types.Mixed
}, { _id: false });

const ResponseSchema = new Schema({
  formId: { type: Schema.Types.ObjectId, ref: 'Form', required: true },
  answers: [AnswerSchema],
  meta: {
    userAgent: String,
    ip: String
  },
  submittedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Response', ResponseSchema);
