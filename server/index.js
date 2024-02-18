import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

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

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      unique: true,
      type: String,
      required: true,
    },
    email: {
      unique: true,
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = new mongoose.model("User", userSchema);

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const News = mongoose.model('News', newsSchema);

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    newsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'News',
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);

app.get('/news', async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.send(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

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
    });

    await newUser.save();

    res.status(201).send({ message: "Successfully Registered, Please login now." });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

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

app.post("/forgortpassword", async (req, res) => {
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
    port: 465,
    secure: true,
    auth: {
      user: "thenewsportal2023@gmail.com",
      pass: "uzxjzmwhvbmjurio",
    },
  });

  const options = {
    from: "it24img@gmail.com",
    to: email,
    subject: "Explore - Reset Password",
    html: emailHtml,
  };

  const emailSender = await transporter.sendMail(options);

  res.send({ message: "Check your email", user: user, data: emailSender });
});

app.post('/reset-password/:id/:token', async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

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
      return res.send({ error: error });
    }
  });
});

app.listen(3000, () => {
  console.log("BE started at port 3000");
});
