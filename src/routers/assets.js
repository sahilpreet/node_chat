const router = require("express").Router();
const Post = require("../models/posts");
const User = require("../models/users");
const Asset = require("../models/assets");
const { all } = require("./auth");
const multer = require("multer");
const sharp = require("sharp");

const assetImage = multer({
  limits: 5 * 1000 * 1000,
  // fileFilter(req, file, cb) {
  //   if (!file.originalname.match(/\.(jpeg|png|jpg)$/)) {
  //     return cb(new Error("please upload an image"));
  //   }
  //   cb(undefined, true);
  // },
});

router.post("/image/upload", assetImage.single("file"), async (req, res) => {
  try {
    console.log(req.body, req.file.buffer);
    const imageBuffer = await sharp(req.file.buffer)
      .resize({ height: 500, width: 500 })
      .png()
      .toBuffer()
      .catch((err) => {
        console.log(err);
      });
    const enteredasset = await new Asset({
      name: req.body.name,
    });
    enteredasset.img = imageBuffer;
    const savedasset = await enteredasset.save();
    res.status(200).json(enteredasset);
    // res.status(200).json("image uploaded")
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/image/download/:name", async (req, res) => {
  try {
    const asset = await Asset.findOne({name:req.params.name});
    res.set("Content-Type", "image/png");
    res.status(200).send(asset.img);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
