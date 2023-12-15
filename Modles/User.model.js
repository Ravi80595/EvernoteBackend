const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name:String,
    brandName:String,
    email:String,
    password:String,
    noOfInfluencers:String,
    brandObjective:String,
    dileverable:String,
    genere:String,
    landingCost:String,
    remarks:String,
    suggested:[],
    reports:[{ type: mongoose.Schema.Types.ObjectId, ref: 'report' }],
    influencersList:[mongoose.Types.ObjectId]
})

const UserModel = mongoose.model("User",userSchema)


module.exports={
    UserModel
}