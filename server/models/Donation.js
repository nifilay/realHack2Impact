import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
    email:    { type: String, required: true, unique: true },
    locations: [{ type: String}],
    createdAt: { type: Date, default: Date.now },
    driver: {type: String, default: null},
    clothing_type: {type: String},
    qr_code_url: {type: String, default: null}
});

export default mongoose.model('Donation', donationSchema);
