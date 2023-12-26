const mongoose = require("mongoose")
const {GetCurrentDate,GetCurrentTime} = require("../Utils/DataStructure")

const GetCurrent1Date=GetCurrentDate()
const GetCurrent1Time=GetCurrentTime()

const reportSchema = mongoose.Schema({
    reportName: String,
    influencersLive:String,
    postsLive: String,
    reach: String,
    budget: String,
    engagements: String,
    likes:String,
    comments:String,
    engagementRate:String,
    cpe:String,
    updates:String,
    influencers: [{ type: mongoose.Schema.Types.ObjectId, ref: "influencer" }],
    NoteDate:{type:String,default:GetCurrent1Date},
    NoteTime:{type:String,default:GetCurrent1Time}
})


const reportModel = mongoose.model("report",reportSchema)

module.exports={
    reportModel
}