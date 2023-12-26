const mongoose = require("mongoose")
const {GetCurrentDate,GetCurrentTime} = require("../Utils/DataStructure")

const GetCurrent1Date=GetCurrentDate()
const GetCurrent1Time=GetCurrentTime()


const influencerSchema = mongoose.Schema({
    name: String,
    instagram: String,
    youtube: String,
    email: String,
    phone: String,
    message: String,
    followers:String,
    views:String,
    AddDate:{type:String,default:GetCurrent1Date},
    AddTime:{type:String,default:GetCurrent1Time}
  });


const influencerModel = mongoose.model("influencer",influencerSchema)

module.exports={
    influencerModel
}