const mongoose = require("mongoose")


const briefSchema = mongoose.Schema({
    agencyName:String,
    breifBudget:String,
    briefCategory:String,
    briefDealType:String,
    briefGenre:String,
    briefInfluencers:String,
    briefLocation:String,
    briefMetrics:String,
    briefName:String,
    briefPlatform:String
});

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
    suggested:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'influencer'  // Reference to the Influencer model
          }
         ],
            selected:[
                {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'influencer'  // Reference to the Influencer model
            }],
            rejected:[
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'influencer'  // Reference to the Influencer model
                }
            ],
    reports:[{ type: mongoose.Schema.Types.ObjectId, ref: 'report' }],
    influencersList:[mongoose.Types.ObjectId],
    briefs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Brief' }]
})

const UserModel = mongoose.model("User",userSchema)
const BriefModel = mongoose.model('Brief', briefSchema);


// Function to add briefs to a user
const addBriefsToUser = async (userId, briefs) => {
    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            return { success: false, message: "User not found" };
        }

        // Validate that each brief ID exists before adding to the user
        for (const briefId of briefs) {
            const brief = await BriefModel.findById(briefId);
            if (!brief) {
                return { success: false, message: `Brief with ID ${briefId} not found` };
            }
        }

        // Add the brief IDs to the user
        user.briefs.push(...briefs);

        await user.save();
        return { success: true, message: "Briefs added successfully" };
    } catch (err) {
        console.error(err);
        return { success: false, message: "Something went wrong" };
    }
};


module.exports={
    UserModel,
    BriefModel,
    addBriefsToUser
}