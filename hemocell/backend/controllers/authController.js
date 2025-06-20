import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Donor from '../models/donorModel.js';
import Receiver from '../models/receiverModel.js';
import nodemailer from "nodemailer";
import Chat from '../models/chatModel.js';

import fs from "fs/promises";
const systemPrompt = await fs.readFile("chatPrompt.txt", "utf8");




// Register User
export const registerUser = async (req, res) => {
  try {
    console.log("Register Request Body:", req.body);

    const { password, userType } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    req.body.password = hashedPassword;

    if (userType === 'receiver') {
      req.body.userType = 'receiver';
      const newReceiver = new Receiver(req.body);
      await newReceiver.save();
      res.status(201).json({ message: 'Receiver registered successfully' });

    } else if (userType === 'donor') {
      req.body.userType = 'donor';
      const newDonor = new Donor(req.body);
      await newDonor.save();
      res.status(201).json({ message: 'Donor registered successfully' });

    } else {
      res.status(400).json({ message: 'Invalid user type' });
    }

  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: 'Registration failed', error });
  }
};

// Login User
export const loginUser = async (req, res) => {
  const { email, password, userType } = req.body;

  try {
    const Model = userType === 'receiver' ? Receiver : Donor;

    const user = await Model.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, userType },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token, message: "Login successful" ,user});
  } catch (error) {
    res.status(500).json({ message: "Error logging in user", error });
  }
};

export const getByLoc = async (req, res) => {
  const { location } = req.body;
  console.log("Received Request:", req.body);

  try {
    const query = {};
    if (location) {
      const locationString = Array.isArray(location) ? location.join(" ") : location;
      const locationParts = locationString.split(/\s+/).map(loc => loc.trim());

      // Query users (donors) by location with regex
      query.location = { $regex: new RegExp(locationParts.join("|"), 'i') };
    }

    const users = await Donor.find(query);

    if (users.length === 0) {
      return res.status(404).json({ message: 'No donors found matching the criteria' });
    }

    // Format the response with relevant user (donor) details
    const usersWithDetails = users.map((user) => {
      return {
        id: user._id,
        name: user.name,
        email: user.email,
        bloodGroup: user.bloodGroup,
        location: user.location,
        phone: user.phone,
      };
    });

    res.json(usersWithDetails);
  } catch (error) {
    console.error('Error fetching donors:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const requestBlood = async (req, res) => {
  const { donorEmail, receiverEmail ,Type } = req.body;

  console.log("Request from:", receiverEmail, "to:", donorEmail);

  try {
    const date = new Date();

    const donor = await Donor.findOne({ email: donorEmail });
    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    const requestData = {
      donorEmail,
      receiverEmail,
      date,
      status: "Pending"
    };

    // Push request to donor
    donor.requests.push(requestData);
    await donor.save();

    // Try to find receiver, if exists add request to them
    const receiver = await Receiver.findOne({ email: receiverEmail });
    if (receiver) {
      receiver.requests.push({
        donorEmail,
        date,
        status: "Pending"
      });
      await receiver.save();
    }

    sendEmailNotification(donorEmail, receiverEmail, requestData, Type);

    return res.status(200).json({ message: "Request sent successfully" });
  } catch (error) {
    console.error("Blood request error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Function to send email notification to the donor
function sendEmailNotification(donorEmail, receiverEmail, request, Type) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Customize email content based on the request Type
  let subject = "New Blood Donation Request";
  let htmlContent = `
    <h2>Blood Donation Request</h2>
    <p>Dear Donor,</p>
    <p>You have received a new blood donation request from <strong>${receiverEmail}</strong>.</p>
    <p><strong>Request Details:</strong></p>
    <ul>
      <li><strong>Donor Email:</strong> ${donorEmail}</li>
      <li><strong>Receiver Email:</strong> ${receiverEmail}</li>
      <li><strong>Request Type:</strong> ${Type}</li>
      <li><strong>Request Date:</strong> ${new Date(request.date).toLocaleString()}</li>
      <li><strong>Status:</strong> ${request.status}</li>
    </ul>
    <p>Please review the request and take appropriate action.</p>
    <p>Thank you for your continued support in saving lives.</p>
    <p><strong>Your Blood Donation Team</strong></p>
    <p><small>If you did not request a blood donation, please ignore this email.</small></p>
  `;

  // If Emergency, adjust subject and highlight urgency
  if (Type === "Emergency") {
    subject = "🚨 EMERGENCY Blood Donation Request - Immediate Help Needed!";
    htmlContent = `
      <h2 style="color: red;">🚨 Emergency Blood Request</h2>
      <p>Dear Donor,</p>
      <p><strong style="color: red;">Urgent blood is required immediately!</strong></p>
      <p>You have received an <strong>emergency</strong> blood request from <strong>${receiverEmail}</strong>.</p>
      <p><strong>Request Details:</strong></p>
      <ul>
        <li><strong>Donor Email:</strong> ${donorEmail}</li>
        <li><strong>Receiver Email:</strong> ${receiverEmail}</li>
        <li><strong>Request Type:</strong> ${Type}</li>
        <li><strong>Request Date:</strong> ${new Date(request.date).toLocaleString()}</li>
        <li><strong>Status:</strong> ${request.status}</li>
      </ul>
      <p style="color: red; font-weight: bold;">Please respond as soon as possible to help save a life!</p>
      <p>Thank you for your selfless service.</p>
      <p><strong>Your Blood Donation Team</strong></p>
      <p><small>If you did not request this, please ignore this email.</small></p>
    `;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: donorEmail,
    subject,
    html: htmlContent,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

export const acceptBloodRequest = async (req, res) => {
  const { requestId, receiverEmail, Status } = req.body;

  try {
    // Update donor request
    const donor = await Donor.findOne({ "requests._id": requestId });
    if (!donor) return res.status(404).json({ message: "Donor not found" });

    const request = donor.requests.id(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = Status;
    await donor.save();

    // Update receiver request using donorEmail and date
    const receiver = await Receiver.findOne({ email: receiverEmail });
    if (receiver) {
      const receiverRequest = receiver.requests.find(req =>
        req.donorEmail === donor.email &&
        new Date(req.date).getTime() === new Date(request.date).getTime()
      );

      if (receiverRequest) {
        receiverRequest.status = Status;
        await receiver.save();
      }
    }

    sendEmailToReceiver(receiverEmail, donor.email);

    return res.status(200).json({ message: `Request ${Status} successfully` });
  } catch (error) {
    console.error("Error accepting blood request:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Function to send an email to the receiver
function sendEmailToReceiver(receiverEmail, donorEmail) {
  const transporter = nodemailer.createTransport({
    service: "gmail",  // Replace with your email service
    auth: {
      user: process.env.EMAIL_USER,  // Your email address
      pass: process.env.EMAIL_PASS,  // Your email password or app-specific password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: receiverEmail,  // Send email to receiver
    subject: "Blood Request Accepted",
    text: `Your blood request to ${donorEmail} has been accepted. Please contact the donor for further details.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}


export const getUserByEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const donor = await Donor.findOne({ email });
    if (donor) return res.status(200).json({ user: donor, role: "donor" });

    const receiver = await Receiver.findOne({ email });
    if (receiver) return res.status(200).json({ user: receiver, role: "receiver" });

    return res.status(404).json({ message: "User not found" });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMessages= async (req, res) => {
  try {
    const { roomId } = req.params;
    console.log("Room ID received in backend:", roomId);

    const chat = await Chat.findOne({ roomId }).sort({timestamp:1}); // Find the chat document by roomId

    if (!chat) {
      return res.status(404).json({ message: "No chat found for this roomId" });
    }

    res.status(200).json({ messages: chat.messages }); // Return the messages array
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

export const chatBot = async (req, res) => {
  try {
    const userQuestion = req.body.message;
    if (!userQuestion) {
      return res.status(400).json({ error: "No message provided" });
    }

    const chatPrompt = await fs.readFile("chatPrompt.txt", "utf8");

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: chatPrompt },
          { role: "user", content: userQuestion },
        ],
      }),
    });

    const result = await response.json();
    console.log("Full OpenRouter response:", result);

    const reply = result?.choices?.[0]?.message?.content;
    if (reply) {
      return res.status(200).json({ reply });
    } else {
      return res.status(200).json({ reply: "⚠️ Sorry, I couldn't generate a proper response." });
    }
  } catch (error) {
    console.error("Chatbot error:", error.message);
    return res.status(500).json({ error: "AI error" });
  }
};

