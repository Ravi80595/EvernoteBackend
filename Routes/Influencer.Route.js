const express = require("express")

const {influencerModel} = require("../Modles/influencers.model")
const influencerRouter = express.Router()




influencerRouter.get("/influencers",async(req,res)=>{
    try{
        const notes = await influencerModel.find()
        res.status(200).send(notes)
    }
    catch(err){
        console.log(err)
        res.status(400).send({"err":"Something went wrong"})
    }
})


// Endpoint for creating a new influencer
influencerRouter.post("/create", async (req, res) => {
    console.log(req.body)
    try {
        // Extract influencer data from the request body
        const { name, instagram, youtube, email, phone, message,followers,views} = req.body;

        // Validate required fields
        if (!name || !instagram || !email) {
            return res.status(400).send({ "error": "Name, Instagram, and Email are required fields" });
        }

        // Create a new influencer instance
        const newInfluencer = new influencerModel({
            name,
            instagram,
            youtube,
            email,
            phone,
            message,
            followers,
            views
        });

        // Save the new influencer to the database
        const savedInfluencer = await newInfluencer.save();

        res.status(201).send(savedInfluencer);
    } catch (err) {
        console.error(err);
        res.status(500).send({ "error": "Internal Server Error" });
    }
});



// Endpoint for updating influencer details
influencerRouter.put("/update/:id", async (req, res) => {
    try {
        const influencerId = req.params.id;

        // Validate if the provided ID is valid
        if (!influencerId || !influencerId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({ "error": "Invalid influencer ID" });
        }

        // Find the influencer by ID
        const existingInfluencer = await influencerModel.findById(influencerId);
        // Check if the influencer exists
        if (!existingInfluencer) {
            return res.status(404).send({ "error": "Influencer not found" });
        }
        // Update influencer details with the data from the request body
        existingInfluencer.set(req.body);

        // Update the NoteDate and NoteTime
        existingInfluencer.NoteDate = GetCurrentDate();
        existingInfluencer.NoteTime = GetCurrentTime();

        // Save the updated influencer to the database
        const updatedInfluencer = await existingInfluencer.save();

        res.status(200).send(updatedInfluencer);
    } catch (err) {
        console.error(err);
        res.status(500).send({ "error": "Internal Server Error" });
    }
});



// Endpoint for deleting an influencer
influencerRouter.delete("/:id", async (req, res) => {
    try {
        const influencerId = req.params.id;
        if (!influencerId || !influencerId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({ "error": "Invalid influencer ID" });
        }
        const existingInfluencer = await influencerModel.findById(influencerId);
        if (!existingInfluencer) {
            return res.status(404).send({ "error": "Influencer not found" });
        }
        await existingInfluencer.remove();
        res.status(204).send(); // 204 No Content - indicates successful deletion
    } catch (err) {
        console.error(err);
        res.status(500).send({ "error": "Internal Server Error" });
    }
});




module.exports = {
    influencerRouter
}