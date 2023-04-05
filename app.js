require('dotenv').config()
const express = require("express");
const path = require("path");
const nodeMailer = require('nodemailer')

const app = express();
app.use(express.json())

app.use(express.static(path.join(__dirname, "public")));

const mainMail = async (name, email, contact, location, message) => {
  const transporter = await nodeMailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.PASSWORD,
    },
  });
  const mailOption = {
    from: process.env.GMAIL_USER,
    to: process.env.EMAIL,
    subject: subject,
    html: `You got a message from 
    Email : ${email}
    Name: ${name}
    Contact: ${contact}
    Location: ${location}
    Message: ${message}`,
  };
  try {
    await transporter.sendMail(mailOption);
    return Promise.resolve("Message Sent Successfully!");
  } catch (error) {
    return Promise.reject(error);
  }
}

app.get("/", (req, res) => {
  res.send("this is backend of contact..");
});

app.post("/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || message) return res.send('field is empty')
    await mainMail(name, email, subject, message);
    res.send("Message Successfully Sent!");
  } catch (error) {
    console.log(error);
    res.send("Message Could not be Sent");
  }
});

app.listen(3000, () => console.log("Server is running!"));