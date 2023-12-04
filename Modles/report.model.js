const mongoose = require("mongoose")
const {GetCurrentDate,GetCurrentTime} = require("../Utils/DataStructure")

const GetCurrent1Date=GetCurrentDate()
const GetCurrent1Time=GetCurrentTime()

const reportSchema = mongoose.Schema({
    reportName: String,
    postsLive: String,
    reach: String,
    budget: String,
    engagements: String,
    influencers: [String],
    NoteDate:{type:String,default:GetCurrent1Date},
    NoteTime:{type:String,default:GetCurrent1Time}
})


const reportModel = mongoose.model("report",reportSchema)

module.exports={
    reportModel
}