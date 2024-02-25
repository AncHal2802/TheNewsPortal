//  import express from 'express';
// import cors from 'cors';
// import mongoose from 'mongoose';
// import jwt from 'jsonwebtoken';
// import nodemailer from 'nodemailer';
// import bcrypt from 'bcrypt';
// import dotenv from 'dotenv';
// import http from 'http';

// import { Server } from 'socket.io'; // Change the import

// dotenv.config();

// const app = express();
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(cors());

// const server = http.createServer(app);  

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173", // Add the origin of your frontend application
//     methods: ["GET", "POST"],
//   },
// });

// mongoose.connect(
//   "mongodb+srv://jaibn1234:jaibn1234@jaibn1234.9nt3iqv.mongodb.net/DB?retryWrites=true&w=majority",
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   },
//   () => {
//     console.log("\nDB connected");
//   }
// );

// const connectedClients = new Set();

// io.on('connection', (socket) => {
//   console.log('A user connected');
//   connectedClients.add(socket);

//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//     connectedClients.delete(socket);
//   });

//   socket.on('commentAdded', (data) => {
//     const { userId, newsId, text } = data;
//     const newsComment = { userId, newsId, text };
//     console.log("News Comment :", newsComment);

//     connectedClients.forEach((client) => {
//       client.emit('commentAdded', newsComment);
//     });
//   });
// });

// // User Schema
// const userSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     username: { unique: true, type: String, required: true },
//     email: { unique: true, type: String, required: true },
//     password: { type: String, required: true },
//     userType: String,
//     isPremium: { type: String, enums: [true, false], default: false },
//     comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
//   },
//   { timestamps: true }
// );

// const User = mongoose.model("User", userSchema);

// // News Schema
// const newsSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     description: { type: String, required: true },
//     imageUrl: { type: String, required: true },
//   },
//   { timestamps: true }
// );

// const News = mongoose.model('News', newsSchema);

// // Comment Schema
// const commentSchema = new mongoose.Schema(
//   {
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     newsId: { type: String, ref: 'News', required: true },
//     text: { type: String, required: true },
//   },
//   { timestamps: true }
// );

// const Comment = mongoose.model('Comment', commentSchema);

// // Routes

// // POST COMMENTS IN THE DATABASE
// app.post('/comment', async (req, res) => {
//   try {
//     const { userId, newsId, text } = req.body;

//     const newsComment = await Comment.create({ userId, newsId, text });
//     console.log("News Comment :", newsComment);

//     connectedClients.forEach((client) => {
//       client.emit('commentAdded', newsComment);
//     });

//     res.status(200).send({ message: 'Comment added successfully' });
//   } catch (error) {
//     console.error('Error adding comment:', error);
//     res.status(500).send({ error: 'Internal Server Error' });
//   }
// });

// // SHOW COMMENTS IN THE FRONTEND
// // SHOW COMMENTS IN THE FRONTEND
// app.get('/show-comment', async (req, res) => {
//   try {
//     const { newsId } = req.query;

//     const newsCommentData = await Comment.find({ newsId }).populate('userId', 'name');

//     res.send(newsCommentData);
//   } catch (error) {
//     console.error('Error fetching comments:', error);
//     res.status(500).send({ error: 'Internal Server Error' });
//   }
// });


// // REGISTER USER
// app.post("/register", async (req, res) => {
//   try {
//     const { name, username, email, password, userType } = req.body;

//     const existingUser = await User.findOne({ email: email });
//     if (existingUser) {
//       return res.status(400).send({ message: "User already registered" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new User({
//       name,
//       username,
//       email,
//       password: hashedPassword,
//       userType,
//       comments: [],
//     });

//     await newUser.save();

//     res.status(201).send({ message: "Successfully Registered, Please login now." });
//   } catch (error) {
//     console.error("Error during registration:", error);
//     res.status(500).send({ error: "Internal Server Error" });
//   }
// });

// // LOGIN USER
// app.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email: email });

//     if (!user) {
//       return res.send({ message: "User not registered" });
//     }

//     const passwordMatch = await bcrypt.compare(password, user.password);

//     if (passwordMatch) {
//       if (user.userType === "Admin") {
//         res.send({ message: "Login Successful - Admin", status: "ok", user: user });
//       } else {
//         res.send({ message: "Login Successful", status: "ok", user: user });
//       }
//     } else {
//       res.send({ message: "Password didn't match" });
//     }
//   } catch (error) {
//     console.error('Error during login:', error);
//     res.status(500).send({ error: 'Internal Server Error' });
//   }
// });

// // FORGOT PASSWORD
// app.post("/forgortpassword", async (req, res) => {
//   const { email } = req.body;

//   const user = await User.findOne({ email: email });

//   if (!user) {
//     console.error("Error finding user:");
//     return res.status(404).json({ Status: "User not existed!" });
//   }

//   const token = jwt.sign({ id: user._id }, "jwt_secret_key", {
//     expiresIn: "1d",
//   });

//   const url = `http://localhost:3000/reset_password/${user._id}/${token}`;
//   const emailHtml = `<h2>Click to reset password : ${url}</h2>`;

//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true,
//     auth: {
//       user: "thenewsportal2023@gmail.com",
//       pass: "uzxjzmwhvbmjurio",
//     },
//   });

//   const options = {
//     from: "it24img@gmail.com",
//     to: email,
//     subject: "Explore - Reset Password",
//     html: emailHtml,
//   };

//   const emailSender = await transporter.sendMail(options);

//   res.send({ message: "Check your email", user: user, data: emailSender });
// });

// // RESET PASSWORD
// app.post('/reset-password/:id/:token', async (req, res) => {
//   const { id, token } = req.params;
//   const { password } = req.body;

//   jwt.verify(token, "jwt_secret_key", async (err, decoded) => {
//     if (err) {
//       return res.status(401).send({ message: "Invalid token" });
//     }
//     try {
//       const userExists = await User.findOne({ _id: id });
//       if (!userExists) {
//         return res.send({ message: "Invalid token or ID" });
//       }
//       userExists.password = password;

//       await userExists.save();
//       res.send({ message: "Password Reset done" });
//     } catch (error) {
//       return res.send({ error: error.message });
//     }
//   });
// });

// // GET ALL USERS
// app.get("/getAllUser", async (req, res) => {
//   try {
//     const allUser = await User.find({});
//     res.send(allUser);
//   } catch (error) {
//     return res.status(500).send({ error: error.message });
//   }
// });

// // DELETE USER
// app.post("/deleteUser", async (req, res) => {
//   const { userID } = req.body;
//   try {
//     await User.deleteOne({ _id: userID }, function (err, result) {
//       if (err) {
//         console.error(err);
//         return res.status(500).send({ status: "Error", data: "Internal Server Error" });
//       }
//       console.log(result);
//       return res.status(200).json({ status: "OK", data: "Deleted" });
//     });
//   } catch (error) {
//     console.error('Error deleting user:', error);
//     return res.status(500).json({ status: "Error", data: "Internal Server Error" });
//   }
// });

// // Existing routes or any additional routes can be added here

// server.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });





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



dotenv.config();

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
    isPremium: { type: String, enums: [true, false], default: false },
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

// SHOW COMMENTS IN THE FRONTEND
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

// RESET PASSWORD
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
      return res.send({ error: error.message });
    }
  });
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

app.get('/polls', (req, res) => {
  res.send('<h1>Poll Page</h1><Poll />');
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});



