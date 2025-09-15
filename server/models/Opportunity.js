import mongoose from 'mongoose';

const opportunitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['Job', 'Scholarship', 'Internship', 'Other'], required: true },
  description: { type: String, required: true },
  link: { type: String }, // Optional: link to external site
  postedBy: { type: String, default: 'Admin' }, // You can store user ID if needed
  deadline: { type: Date }, // Optional
}, {
  timestamps: true
});

const Opportunity = mongoose.model('Opportunity', opportunitySchema);
export default Opportunity;
