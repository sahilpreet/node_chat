const mongoose=require("mongoose")

const postSchema=new mongoose.Schema({
    userId:{
        type:String,
        required:true,
    },
    desc:{
        type:String,
        max:200
    },
    img:{
        type:Buffer,
    },
    likes:{
        type:Array,
        default:[],
    }
},{timestamps:true})

//delete some fields from all the json returning
postSchema.methods.toJSON=function(){
    const user=this
    const userObj=user.toObject()
    delete userObj.img
    return userObj
}

const postModel=mongoose.model("Post",postSchema)

module.exports=postModel