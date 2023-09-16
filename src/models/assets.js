const mongoose=require("mongoose")

const assetSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    desc:{
        type:String,
        max:200
    },
    img:{
        required:true,
        type:Buffer,
    },
},{timestamps:true})

const assetModel=mongoose.model("Asset",assetSchema)

module.exports=assetModel