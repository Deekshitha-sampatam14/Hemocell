import express from "express";
import { registerUser, loginUser, getByLoc, requestBlood, acceptBloodRequest ,getUserByEmail,getMessages,chatBot} from "../controllers/authController.js";

const router = express.Router();

// Register route
router.post("/register", registerUser);

// Login route
router.post("/login", loginUser);

// Route to get donors by location
router.post('/get-donors-by-location', getByLoc);

// Route to request blood
router.post("/request-blood", requestBlood);

// Route to accept a blood request
router.patch("/accept-blood-request", acceptBloodRequest);  // New route to accept a blood donation request

router.post("/get-user-by-email", getUserByEmail);

router.get("/get-messages/:roomId",getMessages);

router.post("/chatbot",chatBot);

export default router;
