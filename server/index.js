// Import necessary modules
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';


import { writeFile } from "fs/promises";
import fs from "fs"; // Import fs for createWriteStream and other fs operations
import { fileURLToPath } from "url";
import PDFDocument from "pdfkit"; // Make sure to import PDFDocument if you're using it for PDF generation




dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));


const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

mongoose.connect(
  "mongodb+srv://jaibn1234:jaibn1234@jaibn1234.9nt3iqv.mongodb.net/DB?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("\nDB connected");
  }
);

const connectedClients = new Set();

io.on('connection', (socket) => {
  console.log('A user connected');
  connectedClients.add(socket);

  socket.on('disconnect', () => {
    console.log('User disconnected');
    connectedClients.delete(socket);
  });

  socket.on('commentAdded', (data) => {
    const { userId, newsId, text } = data;
    const newsComment = { userId, newsId, text };
    console.log("News Comment :", newsComment);

    connectedClients.forEach((client) => {
      client.emit('commentAdded', newsComment);
    });
  });
});

// User Schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { unique: true, type: String, required: true },
    email: { unique: true, type: String, required: true },
    password: { type: String, required: true },
    userType: String,
    isPremium: { type: Boolean, default: false },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

// News Schema
const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
  },
  { timestamps: true }
);

const News = mongoose.model('News', newsSchema);

// Comment Schema
const commentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    newsId: { type: String, ref: 'News', required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);

// Routes

// POST COMMENTS IN THE DATABASE
app.post('/comment', async (req, res) => {
  try {
    const { userId, newsId, text } = req.body;

    const newsComment = await Comment.create({ userId, newsId, text });
    console.log("News Comment :", newsComment);

    connectedClients.forEach((client) => {
      client.emit('commentAdded', newsComment);
    });

    res.status(200).send({ message: 'Comment added successfully' });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.get('/api/comments', async (req, res) => {
  try {
    const allComments = await Comment.find().populate('userId', 'name');
    res.json(allComments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE COMMENT
app.delete('/api/comments/:commentId', async (req, res) => {
  try {
    const { commentId } = req.params;

    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// SHOW COMMENTS IN THE FRONTEND
app.get('/show-comment', async (req, res) => {
  try {
    const { newsId } = req.query;

    const newsCommentData = await Comment.find({ newsId }).populate('userId', 'name');

    res.send(newsCommentData);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});


// REGISTER USER
app.post("/register", async (req, res) => {
  try {
    const { name, username, email, password, userType } = req.body;

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).send({ message: "User already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
      userType,
      comments: [],
    });

    await newUser.save();

    res.status(201).send({ message: "Successfully Registered, Please login now." });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// LOGIN USER
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.send({ message: "User not registered" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      if (user.userType === "Admin") {
        res.send({ message: "Login Successful - Admin", status: "ok", user: user });
      } else {
        res.send({ message: "Login Successful", status: "ok", user: user });
      }
    } else {
      res.send({ message: "Password didn't match" });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

// FORGOT PASSWORD
app.post("/forgotpassword", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email });

  if (!user) {
    console.error("Error finding user:");
    return res.status(404).json({ Status: "User not existed!" });
  }

  const token = jwt.sign({ id: user._id }, "jwt_secret_key", {
    expiresIn: "1d",
  });

  const url = `http://localhost:3000/reset_password/${user._id}/${token}`;
  const emailHtml = `<h2>Click to reset password : ${url}</h2>`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: true,
    auth: {
      user: "thenewsportal2023@gmail.com",
      pass: "uzxjzmwhvbmjurio",
    },
  });

  const options = {
    from: "thenewsportal2023@gmail.com",
    to: email,
    subject: "The News Portal - Reset Password",
    html: emailHtml,
  };

  const emailSender = await transporter.sendMail(options);
  res.send({
    message: "Check your email",
    status: "ok",
    user: user,
    data: emailSender,
  });
});

// RESET PASSWORD
app.post('/reset-password/:id/:token', async (req, res) => {
  console.log("Received reset password request");
  const { id, token } = req.params;
  const { password } = req.body;
  console.log("ID:", id);
  console.log("Token:", token);
  console.log("Password:", password);

  jwt.verify(token, "jwt_secret_key", async (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Invalid token" });
    }
    try {
      const userExists = await User.findOne({ _id: id });
      if (!userExists) {
        return res.send({ message: "Invalid token or ID" });
      }
      userExists.password = password;

      await userExists.save();
      res.send({ message: "Password Reset done" });
    } catch (error) {
      return res.send({ error: error.message });
    }
  });
  1
});

// GET SINGLE USER
app.get("/getSingleUser/:userID", async (req, res) => {
  try {
    const userID = req.params.userID; 
    const user = await User.findById(userID, {}); 

    // Check if the user is found
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});


// GET ALL USERS
app.get("/getAllUser", async (req, res) => {
  try {
    const allUser = await User.find({});
    res.send(allUser);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

// DELETE USER
app.post("/deleteUser", async (req, res) => {
  const { userID } = req.body;
  try {
    await User.deleteOne({ _id: userID }, function (err, result) {
      if (err) {
        console.error(err);
        return res.status(500).send({ status: "Error", data: "Internal Server Error" });
      }
      console.log(result);
      return res.status(200).json({ status: "OK", data: "Deleted" });
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ status: "Error", data: "Internal Server Error" });
  }
});

// Polls
const pollSchema = new mongoose.Schema({
  question: String,
  options: [
    {
      text: String,
      votes: { type: Number, default: 0 },
    },
  ],
  votedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const Poll = mongoose.model('Poll', pollSchema);







const paymentDetailSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },

    paymentId: {
      type: String,
      required: true,
    },
    plan: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    isPremium: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

const PaymentDetail = mongoose.model("PaymentDetail", paymentDetailSchema);

app.post("/api/store-payment-details", async (req, res) => {
  console.log("Received payment details:", req.body);
  try {
    const { userId, paymentId, plan, date } = req.body;
    const pdfPath = `receipts/${paymentId}.pdf`; // Path where the PDF receipt will be saved

    // Format the date for display
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });
    // Ensure the receipts directory exists
    const receiptsDir = path.join(__dirname, "receipts");
    if (!fs.existsSync(receiptsDir)) {
      fs.mkdirSync(receiptsDir);
    }

    // Generate PDF receipt
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(pdfPath));
    doc.fontSize(24).text("Payment Receipt", 100, 80);
    doc.fontSize(16).moveDown().text(`Date: ${formattedDate}`, 100);
    doc.text(`Payment ID: ${paymentId}`, 100);
    doc.text(`Plan: ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`, 100);
    doc.text(`Amount: ${plan === "monthly" ? "2000" : "10000"}`, 100);
    doc.end();

    // Store payment details
    const paymentDetail = new PaymentDetail({
      userId,
      paymentId,
      plan,
      date,
      isPremium: true,
    });
    await paymentDetail.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: true, // Note: `secure` should be false for port 587, true for port 465
      auth: {
        user: "thenewsportal2023@gmail.com", // Your Gmail address
        pass: "uzxjzmwhvbmjurio", // Your Gmail password or App Password
      },
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { isPremium: true } },
      { new: true }
    );
    console.log("Updated User:", updatedUser);
    const userEmail = updatedUser && updatedUser.email ? updatedUser.email : null;

    //const fallbackEmail = "fallback@example.com";
    // Email content for payment receipt
    const mailOptions = {
      from: "thenewsportal2023@gmail.com", // Sender address
      to: userEmail,//|| fallbackEmail, // Recipient email from the updated user document
      subject: "Payment Receipt - Explore Premium Subscription",
      html: `<p>Hello Reader !!</p>
        <p>You are now an EXPLORE Premium user :)</p>
        <p>You can now use all our premium features.</p>
        <p>Please download your attached payment receipt.</p>`,
      attachments: [
        {
          filename: "PaymentReceipt.pdf",
          path: pdfPath,
          contentType: "application/pdf",
        },
      ],
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
        return res
          .status(500)
          .json({
            message: "Failed to send receipt email",
            error: err.toString(),
          });
      } else {
        console.log("Email sent: " + info.response);
        res.json({
          message:
            "Payment details stored, user updated to premium, and receipt sent successfully.",
        });
      }
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.toString() });
  }
});

app.use('/api/get-receipts', express.static(path.join(__dirname, 'receipts')));

// Assuming you have the necessary Poll model and express setup
app.post('/api/polls/create', async (req, res) => {
  try {
    const { question, options } = req.body;

    if (!question || !options || options.length < 2) {
      return res.status(400).json({ message: 'Invalid poll data' });
    }

    const newPoll = await Poll.create({
      question,
      options: options.map((text) => ({ text, votes: 0 })),
      votedUsers: [],
    });

    res.status(201).json(newPoll);
  } catch (error) {
    console.error('Error creating poll:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/polls/:pollId/vote', async (req, res) => {
  try {
    const { pollId } = req.params;
    const { optionIndex } = req.body;

    const poll = await Poll.findById(pollId);

    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    if (poll.votedUsers.includes(req.userId)) {
      return res.status(400).json({ message: 'User has already voted for this poll' });
    }

    // Update the votes for the selected option
    poll.options[optionIndex].votes += 1;
    // Add the user to the votedUsers array to track their vote
    poll.votedUsers.push(req.userId);

    await poll.save();

    res.json({ message: 'Vote recorded successfully' });
  } catch (error) {
    console.error('Error voting:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Assuming you have the necessary Poll model and express setup
app.get('/api/polls', async (req, res) => {
  try {
    const allPolls = await Poll.find({});
    res.json(allPolls);
  } catch (error) {
    console.error('Error fetching polls:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/polls/:pollId', async (req, res) => {
  const { pollId } = req.params;

  try {
    // Assuming Poll is your model
    const deletedPoll = await Poll.findByIdAndDelete(pollId);

    if (!deletedPoll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    res.json({ message: 'Poll deleted successfully' });
  } catch (error) {
    console.error('Error deleting poll:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
