const express = require('express')
const cors = require('cors')

const {connection } =require("./config/db")
const {UserRouter} = require('./Routes/User.Route')
const {noteRouter} = require("./Routes/Notes.Route")
const {reportRouter}= require("./Routes/Reports.Route")
const {influencerRouter}= require("./Routes/Influencer.Route")
// const {authenticate} = require('./Middelwares/authenticate')
const { influencerModel } = require('./Modles/influencers.model'); // Update the path accordingly




const app = express()


app.use(cors())
app.use(express.json())

// app.get("/",(req,res)=>{
//     res.status(200).send({"msg":"welcome to main page of API"})
// })

app.use("/user",UserRouter)
app.use("/report",reportRouter)
app.use("/influencer",influencerRouter)
// app.use(authenticate)

// app.use("/",noteRouter)



// app.use("/", async (req, res) => {
//     console.log('data added')
//     try {
//       const influencerDataArray = []
//       const savedInfluencers = await influencerModel.insertMany(influencerDataArray);
//       console.log(savedInfluencers)
//       res.status(201).send({ message: 'Influencers added successfully', influencers: savedInfluencers });
//     } catch (error) {
//       console.error(error);
//       res.status(500).send({ error: 'Internal Server Error' });
//     }
//   });




app.listen(2147,async()=>{
    try{
        await connection
        console.log("Connected to Database")
    }
    catch(err){
        console.log(err)
        console.log("connection failed")
    }
    console.log("Listning on Port 2147")
})