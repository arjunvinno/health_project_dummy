const express = require("express");
const { addDiagnosticsData, addProceduresData, getDiagnosticsData, getProceduresData, addOPCSdata, getOpcsCodesData, getCcsdCodesData, getIcd10CodesData, addCCSDdata, addICD10data } = require("../controllers/store_db_controller");

const storeToDBRouter = express.Router();

storeToDBRouter.post("/diagnostics", addDiagnosticsData);
storeToDBRouter.post("/procedures", addProceduresData);
storeToDBRouter.post("/opcscode", addOPCSdata);
storeToDBRouter.post("/ccsdcode", addCCSDdata);
storeToDBRouter.post("/icd10code", addICD10data);

storeToDBRouter.get("/diagnostics", getDiagnosticsData);
storeToDBRouter.get("/procedures", getProceduresData);
storeToDBRouter.get("/opcscode", getOpcsCodesData);
storeToDBRouter.get("/ccsdcode", getCcsdCodesData);
storeToDBRouter.get("/icd10code", getIcd10CodesData);

module.exports = { storeToDBRouter };
