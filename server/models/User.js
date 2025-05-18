import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  email:    { type:String, required:true, unique:true },
  password: { type:String, required:true },
});
userSchema.pre('save', async function() {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});
userSchema.methods.comparePassword = function(raw) {
  return bcrypt.compare(raw, this.password);
};

export default mongoose.model('User', userSchema);