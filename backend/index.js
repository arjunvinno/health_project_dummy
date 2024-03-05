const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connection } = require("./config/db");
const { patientRouter } = require("./routes/patients_route");
const { diagnosticRouter } = require("./routes/diagnostic_route");
const { procedureRouter } = require("./routes/procedure_route");
const { storeToDBRouter } = require("./routes/store_db_route");
const { savedCodeRouter } = require("./routes/savedcodes_route");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json("welcome");
});

app.use("", patientRouter);
app.use("", diagnosticRouter);
app.use("", procedureRouter);
app.use("",savedCodeRouter)
app.use("/store", storeToDBRouter);

//Add yours custom port to run the server,default 8080
//run npm i to install dependencies and npm run start to run the server
const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
  try {
    await connection;
    console.log("Connected to DB successfully");
  } catch (err) {
    console.log("Failed to connect to db");
    console.log(err);
  }
  console.log(`Server running at ${PORT}`);
});
