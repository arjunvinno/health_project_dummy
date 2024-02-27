const express = require("express");
const { requestBodyValidator, requestQueryValidations } = require("../validators/validation_middlewares");
const { addSavedCodeValidator, getSavedCodesValidator } = require("../validators/validation_schemas");
const {addSavedCode,getSavedCodes} =require("../controllers/savedcodes_controller")

const savedCodeRouter = express.Router();

savedCodeRouter.post("/mysavedcodes",requestBodyValidator(addSavedCodeValidator),addSavedCode)

savedCodeRouter.get("/mysavedcodes",requestQueryValidations(getSavedCodesValidator),getSavedCodes)

module.exports={savedCodeRouter}