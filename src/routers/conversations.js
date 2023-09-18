const router = require("express").Router();
const Conversation = require("../models/conversations");

//new conv
router.post("", async (req, res) => {
  try {
    const enteredConversation = new Conversation({
        member:[req.body.senderId,req.body.receiverId]
  });
  const savedConversation=await enteredConversation.save()
    res.status(200).json(savedConversation);
  } catch (error) {
    res.status(500).json(error);
  }
});

//get conv of a user

router.get("/:userId",async(req,res)=>{
    try {
        const conservation=await Conversation.find({
            member: {$in:[req.params.userId]}
        })
        res.status(200).json(conservation)
    } catch (error) {
        res.status(500).json(error)        
    }
})

// get conv of 2 users

router.get("/find/:firstUserId/:secondUserId",async(req,res)=>{
  try {
      const conservation=await Conversation.findOne({
          member: {$all:[req.params.firstUserId,req.params.secondUserId]}
      })
      res.status(200).json(conservation)
  } catch (error) {
      res.status(500).json(error)        
  }
})

module.exports = router;
