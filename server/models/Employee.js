import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  location: { type: String},
  driver: {type: String}
});

export default mongoose.model('Employee', employeeSchema);
