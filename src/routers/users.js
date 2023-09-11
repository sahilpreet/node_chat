const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/users");

// router.get("/", (req, res) => {
//   res.send("user");
// });

router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        res.status(500).json(error);
      }
      try {
        const user = await User.findByIdAndUpdate(req.params.id, {
          $set: req.body,
        });
        !user && res.status(404).json("user not found");
        res.status(200).json("Account has been updated");
      } catch (error) {
        res.status(500).json(error);
      }
    }
  } else {
    res.status(403).json("account not updated");
  }
});

router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      !user && res.status(404).json("user not found");
      res.status(200).json("Account has been deleted");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("you can only delete your account");
  }
});

router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    !user && res.status(404).json("user not found");
    // const { createdAt, updatedAt, password, ...minimalInfo } = user._doc;
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/image/download/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.set("Content-Type", "image/png");
    res.status(200).send(user.profilePicture);
  } catch (error) {
    res.status(500).send(error);
  }
});

//get friends
router.get("/friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
    res.status(200).json(friendList);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/:id/follow", async (req, res) => {
  if (req.body.userId != req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      !user && !currentUser && res.status(404).json("user not found");
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("followed user success");
      } else {
        res.status(403).json("you have already followed the user");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("you cannot follow yourself");
  }
});

router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId != req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      !user && !currentUser && res.status(404).json("user not found");
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("Unfollowed user success");
      } else {
        res.status(403).json("you do not follow the user");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("you cannot follow yourself");
  }
});

router.get("/search", async (req, res) => {
  try {
    const user = await User.find({
      username: { $regex: req.query.name, $options: "i" },
    });
    // const { createdAt, updatedAt, password, profilePicture, ...minimalInfo } =
    //   user;
    // console.log(minimalInfo);
    user.filter((u)=>u["password"]="")
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
