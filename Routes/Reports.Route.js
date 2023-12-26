const express = require("express")

const {reportModel} = require("../Modles/report.model")
const {UserModel}= require("../Modles/User.model")
const reportRouter = express.Router()



reportRouter.get("/reports", async (req, res) => {
    try {
        // Populate the influencers details when fetching reports
        const notes = await reportModel.find().populate('influencers').exec();
        res.status(200).send(notes);
    } catch (err) {
        console.log(err);
        res.status(400).send({ "err": "Something went wrong" });
    }
});


reportRouter.post("/create", async (req, res) => {
    const { reportName, postsLive, reach, budget, engagements, influencers,influencersLive,likes,comments,engagementRate,cpe } = req.body;
    try {
        if (influencers && !Array.isArray(influencers)) {
            return res.status(400).send({ "error": "Influencers must be an array of influencer IDs" });
        }
        if (influencers) {
            for (const influencerId of influencers) {
                if (!influencerId.match(/^[0-9a-fA-F]{24}$/)) {
                    return res.status(400).send({ "error": "Invalid influencer ID in the influencers array" });
                }
            }
        }
        const newReport = new reportModel({
            reportName,
            postsLive,
            reach,
            budget,
            engagements,
            influencersLive,
            likes,
            comments,
            engagementRate,
            cpe,
            influencers: influencers || []
        });
        await newReport.save();
        res.status(200).send({ 'msg': "New Report Created Successfully" });
    } catch (err) {
        console.log(err);
        res.status(400).send({ "err": "Something went wrong" });
    }
});


reportRouter.put("/update/:reportId", async (req, res) => {
    const reportId = req.params.reportId;
    const updatedReportData = req.body;
    console.log(reportId, updatedReportData);
  
    try {
      const existingReport = await reportModel.findById(reportId);
      if (!existingReport) {
        return res.status(404).send({ "error": "Report not found" });
      }
      existingReport.reportName = updatedReportData.reportName || existingReport.reportName
      existingReport.postsLive = updatedReportData.postsLive
      existingReport.reach = updatedReportData.reach
      existingReport.budget = updatedReportData.budget
      existingReport.engagements = updatedReportData.engagements
      existingReport.influencersLive = updatedReportData.influencersLive
      existingReport.likes = updatedReportData.likes
      existingReport.comments = updatedReportData.comments
      existingReport.engagementRate = updatedReportData.engagementRate
      existingReport.cpe = updatedReportData.cpe,
      existingReport.updates=updatedReportData.updates
      if (updatedReportData.influencers && Array.isArray(updatedReportData.influencers)) {
        // If influencers array is provided, add new data to it
        if (updatedReportData.influencers.length > 0) {
          existingReport.influencers = [...existingReport.influencers, ...updatedReportData.influencers];
        }
      }
      await existingReport.save();
      res.status(200).send({ 'msg': "Report updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).send({ "error": "Internal server error" });
    }
  });
  




reportRouter.delete("/:reportId", async (req, res) => {
    const reportId = req.params.reportId;
    try {
      const existingReport = await reportModel.findById(reportId);
  
      if (!existingReport) {
        return res.status(404).send({ "error": "Report not found" });
      }
  
      // Delete the report
      await existingReport.remove();
  
      res.status(200).send({ 'msg': "Report deleted successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).send({ "err": "Internal server error" });
    }
});




// POST /assign-report/:userId
reportRouter.post("/assignReport/:userId", async (req, res) => {
    const userId = req.params.userId;
    const reportData = req.body; 

    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).send({ "error": "User not found" });
        }
        const newReport = new reportModel(reportData);
        await newReport.save();
        user.reports.push(newReport._id);
        await user.save();
        res.status(201).send({ 'msg': "Report assigned to user successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).send({ "error": "Internal server error" });
    }
});


reportRouter.get("/:reportId", async (req, res) => {
    const reportId = req.params.reportId;

    try {
        const report = await reportModel.findById(reportId).populate('influencers').exec();
        if (!report) {
            return res.status(404).send({ "error": "Report not found" });
        }

        res.status(200).send(report);
    } catch (err) {
        console.log(err);
        res.status(400).send({ "err": "Something went wrong" });
    }
});

module.exports = {
    reportRouter
}