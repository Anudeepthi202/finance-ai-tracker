import express from "express";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google", async (req, res) => {
  const { token } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  
  let user = await User.findOne({ googleId: payload.sub });
  if (!user) {
    user = await User.create({
      googleId: payload.sub,
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
    });
  }

  const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.cookie("token", jwtToken, { httpOnly: true }).json({ user });
});

export default router;
