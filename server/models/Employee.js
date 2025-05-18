\import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  location: { type: String},
  name: {type: String}
});

export default mongoose.model('Employee', employeeSchema);
