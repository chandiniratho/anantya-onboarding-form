const express = require("express");
const cors = require("cors");
const axios = require("axios");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "chandiniratho03@gmail.com",
    pass: "rpofuxtgdybgsczp"
  }
});

app.post("/signup", async (req, res) => {
  try {

    const data = req.body;

    console.log("Received data:", data);

    // send to recruiter API
    const apiResponse = await axios.post(
      "https://anantya-api.onrender.com/onboard",
      data
    );

    console.log("API response:", apiResponse.data);

    // send confirmation email
    await transporter.sendMail({
      from: "chandiniratho03@gmail.com",
      to: data.email,
      subject: "Volunteer Registration Successful",
      html: `
        <h2>Registration Successful</h2>
        <p>Hi ${data.fullname},</p>
        <p>Your volunteer onboarding form has been submitted successfully.</p>
      `
    });

    res.status(200).json({ message: "Signup successful" });

  } catch (error) {

    console.error("FULL ERROR:", error);

    res.status(500).json({
      message: "Internal server error"
    });

  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});