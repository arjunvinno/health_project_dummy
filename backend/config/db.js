const mongoose=require("mongoose")
require('dotenv').config()
const connection=mongoose.connect(process.env.MONGO_URL) //Replace with your mongoDb URL to connect with db
module.exports={
    connection
}