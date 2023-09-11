const router = require("express").Router();
const Post = require("../models/posts");
const User = require("../models/users");
const { all } = require("./auth");
const multer = require("multer");
const sharp = require("sharp");

router.get("/", (req, res) => {
  res.send("posts");
});

router.post("/", async (req, res) => {
  try {
    const newPost = await new Post(req.body);
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await Post.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("post has been updated");
    } else {
      res.status(500).json("you can only update your posts");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("post has been deleted");
    } else {
      res.status(500).json("you can only delete your posts");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).send("post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).send("post has been disiked");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      // post.img = "";
      res.status(200).send(post);
    } else {
      res.status(200).send("no post found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/timeline/:userId", async (req, res) => {
  try {
    const d1=Date.now()
    console.log(req.body.followings)
    const currentUser = req.body.followings
    // const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: req.params.userId });
    const friendPosts = await Promise.all(
      currentUser.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    const d2=Date.now();
    console.log((d2-d1)/60)
    res.status(200).send(userPosts.concat(...friendPosts));
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json(error);
  }
});

const productImage = multer({
  limits: 5 * 1000 * 1000,
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|png|jpg)$/)) {
      return cb(new Error("please upload an image"));
    }
    cb(undefined, true);
  },
});

router.post("/image/upload", productImage.single("file"), async (req, res) => {
  try {
    console.log(req.body, req.file.buffer);
    const imageBuffer = await sharp(req.file.buffer)
      .png()
      .toBuffer()
      .catch((err) => {
        console.log(err);
      });
    const enteredPost = await new Post({
      userId: req.body.userId,
      desc: req.body.desc,
    });
    enteredPost.img = imageBuffer;
    const savedPost = await enteredPost.save();
    res.status(200).json(savedPost);
    // res.status(200).json("image uploaded")
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/image/download/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.set("Content-Type", "image/png");
    res.status(200).send(post.img);
  } catch (error) {
    res.status(500).send(error);
  }
});

// router.post("/",(req,res)=>{

// })

module.exports = router;
