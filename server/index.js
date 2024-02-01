import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
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

// Routes

app.get('/news', async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.send(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.post('/news', async (req, res) => {
  try {
    const { title, description, imageUrl } = req.body;
    const news = new News({
      title,
      description,
      imageUrl,
    });

    await news.save();
    res.send({ status: 'ok', message: 'News added successfully' });
  } catch (error) {
    console.error('Error adding news:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.get('/comments/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate that userId is a valid ObjectId (assuming it's an ObjectId)
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send({ error: 'Invalid ObjectId for userId' });
    }

    const comments = await Comment.find({ userId: mongoose.Types.ObjectId(userId) }).sort({ createdAt: -1 });
    res.send(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.post('/comments', async (req, res) => {
  try {
    const { userId, newsId, text } = req.body;

    // Validate that userId and newsId are valid ObjectIds
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(newsId)) {
      return res.status(400).send({ error: 'Invalid ObjectId for userId or newsId' });
    }

    const comment = new Comment({
      userId: mongoose.Types.ObjectId(userId),
      newsId: mongoose.Types.ObjectId(newsId),
      text,
    });

    await comment.save();
    res.send({ status: 'ok', message: 'Comment added successfully' });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

// ... (existing routes)

app.listen(3000, () => {
  console.log("BE started at port 3000");
});
