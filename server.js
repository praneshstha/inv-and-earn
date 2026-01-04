const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is working!");
});

// -------------------
// Contact Form Route
// -------------------
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.json({ success: false, msg: "All fields are required" });
  }

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "praneshstha100@gmail.com",        
      pass: "Mig33.com"           
    }
  });

  try {
    await transporter.sendMail({
      from: email,
      to: "praneshstha100@gmail.com",          
      subject: `Message from ${name}`,
      text: message
    });

    res.json({ success: true, msg: "Message sent successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, msg: "Error sending message" });
  }
});

// -------------------
// Pricing Subscription Route
// -------------------
app.post("/subscribe", (req, res) => {
  const { name, email, bankAcc, planAmount } = req.body;

  if (!name || !email || !bankAcc || !bankIFSC || !planAmount) {
    return res.json({ success: false, msg: "All fields are required." });
  }

  console.log("New Subscription:", req.body);

  res.json({ success: true, msg: `Subscribed to ${planAmount} plan successfully!` });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
