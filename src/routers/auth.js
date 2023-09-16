const router = require("express").Router();
const express = require("express")
const User = require("../models/users");
const bcyrpt=require("bcrypt")
const multer = require("multer");
const sharp=require("sharp")

const userImage = multer({
  limits: 5 * 1000 * 1000,
  // fileFilter(req, file, cb) {
  //   if (!file.originalname.match(/\.(jpeg|png|jpg)$/)) {
  //     return cb(new Error("please upload an image"));
  //   }
  //   cb(undefined, true);
  // },
});



router.post("/register", userImage.single("file"),async (req, res) => {
  try {
    const imageBuffer=await sharp(req.file.buffer).png().toBuffer().catch(err=>{console.log(err)})
    const salt= await bcyrpt.genSalt(10)
    const hashedpasssword = await bcyrpt.hash(req.body.password,salt)
    const user = await new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedpasssword,
      profilePicture:imageBuffer
    });
    const newUser = await user.save();
    res.status(200).json(newUser);
  } catch (error) {
    res.send({ error: error });
  }
});

router.post("/login",async(req,res)=>{
  try {
    const user= await User.findOne({email:req.body.email})
    user.profilePicture=""
    !user && res.status(404).send("user not found")
    
    
    const userPasswordMatched= await bcyrpt.compare(req.body.password,user.password)
    !userPasswordMatched && res.status(400).send("password not matched")


    res.status(200).json(user)
    
  } catch (error) {
    res.status(500).json(error)
  }
})

module.exports = router;
