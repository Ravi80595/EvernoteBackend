const express = require("express")

const {reportModel} = require("../Modles/report.model")
const reportRouter = express.Router()
// const {authenticate} =require("../Middelwares/authenticate")


// All notes from Here for users

reportRouter.get("/reports",async(req,res)=>{
    // const user=req.body.userID
    try{
        const notes = await reportModel.find()
        res.status(200).send({"msg":"All Notes Here",notes})
    }
    catch(err){
        console.log(err)
        res.status(400).send({"err":"Something went wrong"})
    }
})

// note Create Method

reportRouter.post("/create",async(req,res)=>{
    const {reportName,postsLive,reach,budget,engagements,influencers} = req.body
    try{    
        const new_note = new reportModel({
            reportName,postsLive,reach,budget,engagements,influencers
        })
        await new_note.save()
        res.status(200).send({'msg':"New Report Created Successfully"})
    }   
    catch(err){
        console.log(err)
        res.status(400).send({"err":"Something went wrong"})
    }
})

// Notes Update Method

noteRouter.patch("/update/:noteID",authenticate,async(req,res)=>{
    const noteID  = req.params.noteID
    const userID = req.body.userID
    const notes = await NoteModel.findOne({_id:noteID})
    if(userID !==notes.userID){
        res.status(400).send({"msg":"User is not Authorized"})
    }
    try{
         await NoteModel.findByIdAndUpdate({_id:noteID},req.body)
         res.status(200).send({"msg":"Note Updated successfully"})
    }
    catch(err){
        console.log(err)
        res.status(400).send({"err":"Something went wrong"})
    }
})

// Delete Method Here

noteRouter.delete("/delete/:noteID",authenticate,async(req,res)=>{
    const noteID = req.params.noteID
    const userID = req.body.userID
    const note = await NoteModel.findOne({_id:noteID})
    if(userID !== note.userID){
        res.status(400).send({"msg":"User is not Authorized"})
    }else{
        await NoteModel.findByIdAndDelete({_id:noteID})
        res.status(200).send({"msg":"Note Deleted successfully"})
    }
})

// All Notes for admin

noteRouter.get("/notess",async(req,res)=>{
    try{
        const notes = await NoteModel.find()
        res.status(200).send({"msg":"All User Here",notes})
    }
    catch(err){
        console.log(err)
        res.status(400).send({"err":"Something went wrong"})
    }
})


module.exports = {
    reportRouter
}