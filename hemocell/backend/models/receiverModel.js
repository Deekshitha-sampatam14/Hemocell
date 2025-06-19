import mongoose from 'mongoose';

const receiverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  location: {type: String, required: true },
  bloodGroup: { type: String, required: true },
  userType: { type: String, enum: ['receiver'], required: true },
  requests: [
    {
        donorEmail: String,
        date: Date,
        status: { type: String, enum: ['Pending', 'Accepted', 'Declined','Done'] }
    }
  ],
});

const Receiver = mongoose.model("Receiver", receiverSchema);
export default Receiver;