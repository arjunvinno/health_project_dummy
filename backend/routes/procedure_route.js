const express = require("express");
const { requestBodyValidator, requestParamsValidations } = require("../validators/validation_middlewares");
const { addProcedureValidator, reportsParamsValidator, reportsOnfilterValidator } = require("../validators/validation_schemas");
const {
  addProcedure,
  getProceduresOnId,
  deleteProcedureOnId,
  updateProcedureOnId,
} = require("../controllers/procedure_controller");

const procedureRouter = express.Router();

procedureRouter.post(
  "/procedure",
  requestBodyValidator(addProcedureValidator),
  addProcedure
);

procedureRouter.get("/procedure/:patientId/:procedureType",requestParamsValidations(reportsOnfilterValidator), getProceduresOnId);

procedureRouter.delete("/procedure/:patientId/:reportId",requestParamsValidations(reportsParamsValidator), deleteProcedureOnId);

procedureRouter.patch(
  "/procedure/:patientId/:reportId",requestParamsValidations(reportsParamsValidator),
  requestBodyValidator(addProcedureValidator),
  updateProcedureOnId
);

module.exports = { procedureRouter };
