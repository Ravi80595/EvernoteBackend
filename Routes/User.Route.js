const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const UserRouter = express.Router()
const {authenticate} = require("../Middelwares/authenticate")

const { UserModel, BriefModel, addBriefsToUser } = require("../Modles/User.model")


UserRouter.post("/signup",async(req,res)=>{
    const {name,brandName,email,password,noOfinfluencers,brandObjective,dileverable,genere,landingCost,remarks}= req.body
    const userPresent = await UserModel.findOne({email})
    if(userPresent){
        res.status(201).send({"msg":"User Already Exists"})
    }
try{
    bcrypt.hash(password,4,async function(err,hash){
        const user = new UserModel({email,password:hash,name,brandName,noOfinfluencers,brandObjective,dileverable,genere,landingCost,remarks})
        await user.save()
        res.send({"msg":"Signup Successfull"})
    })

}
catch(err){
    console.log(err)
    res.send(400).send({"err":"Something went wrong"})
}
})


UserRouter.post("/briefs/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const { briefs } = req.body;
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).send({ "msg": "User not found" });
        }

        // Validate that each brief object is provided
        if (!briefs || !Array.isArray(briefs) || briefs.length === 0) {
            return res.status(400).send({ "msg": "Invalid or empty briefs array" });
        }

        const briefIds = [];
        for (const brief of briefs) {
            // Create the Brief document
            const createdBrief = await BriefModel.create(brief);
            // Push the Brief's _id to the user's briefs array
            user.briefs.push(createdBrief._id);
            // Store the Brief's _id for response (optional)
            briefIds.push(createdBrief._id);
        }

        await user.save();
        res.status(201).send({ "msg": "Briefs added successfully", briefIds });
    } catch (err) {
        console.error(err);
        res.status(500).send({ "err": "Something went wrong" });
    }
});


// Show all users
UserRouter.get("/allUsers", async (req, res) => {
    try {
        const allUsers = await UserModel.find({})
        .populate('reports')
        .populate('suggested')
        .populate('selected')
        .populate('briefs') 
        .populate('rejected');
        res.status(200).send({"msg": "All Users", "data": allUsers});
    } catch (err) {
        console.log(err);
        res.status(400).send({"err": "Something went wrong"});
    }
});


// Login here

UserRouter.post("/login",async(req,res)=>{
    const {email,password} = req.body
    try{
        const user = await UserModel.find({email})
        if(user.length>0){
            const hashed_password = user[0].password
            bcrypt.compare(password,hashed_password,function(err,result){
                if(result){
                    const token= jwt.sign({"userID":user[0]._id},'ravi')
                    res.status(200).send({"msg":"Login Success","token":token})
                }else{
                    res.status(400).send({"msg":"Login Failed"})
                }
            })
        }else{
            res.status(400).send({"msg":"Login Failed"})
        }
    }
    catch(err){
        console.log(err)
        res.send(400).send({"err":"Something went wrong"})
    }
})


UserRouter.get("/userProfile", authenticate, async (req, res) => {
    const userID = req.body.userID;
    try {
      const user = await UserModel.findById(userID)
        .populate('reports')
        .populate('suggested')
        .populate('selected')
        .populate('briefs') 
        .populate('rejected');
      if (!user) {
        return res.status(404).send({ "error": "User not found" });
      }
      res.status(200).send({ "msg": "User Details are Here", "Data": user });
    } catch (err) {
      console.log(err);
      res.status(500).send({ "error": "Internal server error" });
    }
  });
  

// User Profile Update Method

UserRouter.patch("/userProfileEdit",authenticate,async(req,res)=>{
    const userID = req.body.userID
    try{
        const updateUser = await UserModel.findByIdAndUpdate({_id:userID},req.body)
        res.status(200).send({'msg':"Profile Updated"})
    }
    catch(err){
        console.log(err)
        res.status(400).send({'err':"Something went wrong"})
    }
})


UserRouter.patch("/suggested", async (req, res) => {
    const userID = req.body.userID;
    const influencerIDToUpdate = req.body.influencerID;
    console.log(userID,influencerIDToUpdate)
    try {
        const updateUser = await UserModel.findByIdAndUpdate(
            { _id: userID },
            { $addToSet: { suggested: influencerIDToUpdate } }, // Use $addToSet to add only if not already present
            { new: true } // Return the updated document
        );
        if (!updateUser) {
            return res.status(404).send({ msg: "User not found" });
        }

        res.status(200).send({ msg: "Profile Updated", user: updateUser });
    } catch (err) {
        console.error(err);
        res.status(500).send({ err: "Something went wrong" });
    }
});


UserRouter.patch("/selected", async (req, res) => {
    const userID = req.body.userID;
    const influencerIDToUpdate = req.body.influencerID;
    try {
        const updateUser = await UserModel.findByIdAndUpdate(
            { _id: userID },
            {
                $addToSet: { selected: influencerIDToUpdate }
            },
            { new: true }
        );

        if (!updateUser) {
            return res.status(404).send({ msg: "User not found" });
        }

        res.status(200).send({ msg: "Profile Updated", user: updateUser });
    } catch (err) {
        console.error(err);
        res.status(500).send({ err: "Something went wrong" });
    }
});


UserRouter.patch("/removeFromSelected", async (req, res) => {
    const userID = req.body.userID;
    const influencerIDToRemove = req.body.influencerID;

    try {
        const updateUser = await UserModel.findByIdAndUpdate(
            { _id: userID },
            {
                $pull: { selected: influencerIDToRemove }
            },
            { new: true }
        );

        if (!updateUser) {
            return res.status(404).send({ msg: "User not found" });
        }

        res.status(200).send({ msg: "Profile Updated", user: updateUser });
    } catch (err) {
        console.error(err);
        res.status(500).send({ err: "Something went wrong" });
    }
});


UserRouter.patch('/rejected', async (req, res) => {
    const userID = req.body.userID;
    const influencerIDToUpdate = req.body.influencerID;
  
    try {
      const updateUser = await UserModel.findByIdAndUpdate(
        { _id: userID },
        {
          $addToSet: { rejected: influencerIDToUpdate }
        },
        { new: true }
      );
      if (!updateUser) {
        return res.status(404).send({ msg: 'User not found' });
      }
      res.status(200).send({ msg: 'Profile Updated', user: updateUser });
    } catch (err) {
      console.error(err);
      res.status(500).send({ err: 'Something went wrong' });
    }
});


UserRouter.patch("/removeFromRejected", async (req, res) => {
    const userID = req.body.userID;
    const influencerIDToRemove = req.body.influencerID;
    try {
        const updateUser = await UserModel.findByIdAndUpdate(
            { _id: userID },
            {
                $pull: { rejected: influencerIDToRemove }
            },
            { new: true }
        );

        if (!updateUser) {
            return res.status(404).send({ msg: "User not found" });
        }

        res.status(200).send({ msg: "Profile Updated", user: updateUser });
    } catch (err) {
        console.error(err);
        res.status(500).send({ err: "Something went wrong" });
    }
});



module.exports={
    UserRouter
}