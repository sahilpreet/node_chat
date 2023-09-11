const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      max: 50,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      max: 200,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      min: 6,
    },
    coverPicture: {
      type: String,
      default: "",
    },
    profilePicture: {
      type: Buffer,
      default: "",
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    desc: {
      type: String,
      max: 200,
    },
    city: {
      type: String,
      max: 100,
    },
    from: {
      type: String,
      max: 100,
    },
    relationship: {
      type: Number,
      enum: [1, 2, 3],
    },
  },
  { timestamps: true }
);

//delete some fields from all the json returning
userSchema.methods.toJSON=function(){
  const user=this
  const userObj=user.toObject()
  delete userObj.profilePicture
  return userObj
}

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
