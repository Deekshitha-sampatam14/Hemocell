import mongoose from 'mongoose';

const donorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  location: {type: String, required: true },
  bloodGroup: { type: String, required: true },
  userType: { type: String, enum: ['donor'], required: true },
  requests: [
    {
        donorEmail: String,
        receiverEmail: String,
        date: Date,
        status: { type: String, enum: ['Pending', 'Accepted', 'Declined','Done'] }
    }
],
});

const Donor = mongoose.model("Donor", donorSchema);
export default Donor;
