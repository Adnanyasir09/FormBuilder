import mongoose from 'mongoose';

const { Schema } = mongoose;

const CategorizeSchema = new Schema({
  categories: [{ key: String, label: String }],
  // Each item has a correctCategoryKey for evaluation
  items: [{ id: String, label: String, correctCategoryKey: String }]
}, { _id: false });

const ClozeBlankSchema = new Schema({
  key: String,              // e.g. "1", "2"
  answer: String,           // correct answer
  options: [String]         // optional choices (if you want dropdown)
}, { _id: false });

const ClozeSchema = new Schema({
  text: String,             // e.g. "The __1__ rises in the __2__."
  blanks: [ClozeBlankSchema]
}, { _id: false });

const CompQSchema = new Schema({
  qid: String,
  questionText: String,
  kind: { type: String, enum: ['mcq','short'], default: 'mcq' },
  options: [String],        // used if kind === 'mcq'
  answer: String            // store correct answer (optional in real exams)
}, { _id: false });

const ComprehensionSchema = new Schema({
  passage: String,
  questions: [CompQSchema]
}, { _id: false });

const QuestionSchema = new Schema({
  type: { type: String, enum: ['categorize','cloze','comprehension'], required: true },
  order: Number,
  title: String,            // short label
  prompt: String,           // instruction shown to user
  required: { type: Boolean, default: true },
  imageUrl: String,         // per-question image
  settings: {
    categorize: CategorizeSchema,
    cloze: ClozeSchema,
    comprehension: ComprehensionSchema
  }
}, { _id: false });

const FormSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  headerImageUrl: String,
  theme: {
    accent: String,
    font: String
  },
  questions: [QuestionSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Form', FormSchema);
