const express = require("express");
const { requestBodyValidator, requestParamsValidations } = require("../validators/validation_middlewares");
const {
  getDiagosticOnId,
  addDiagnosticOnId,
  deleteDiagosticOnId,
  updateDiagosticOnId,
} = require("../controllers/diagnostic_controller");
const { addDiagnosticValidator, patientParamsValidator, reportsParamsValidator } = require("../validators/validation_schemas");

const diagnosticRouter = express.Router();

diagnosticRouter.post(
  "/diagnostic",
  requestBodyValidator(addDiagnosticValidator),
  addDiagnosticOnId
);

diagnosticRouter.get("/diagnostic/:patientId", requestParamsValidations(patientParamsValidator),getDiagosticOnId);

diagnosticRouter.delete(
  "/diagnostic/:patientId/:reportId", requestParamsValidations(reportsParamsValidator),
  deleteDiagosticOnId
);

diagnosticRouter.patch(
  "/diagnostic/:patientId/:reportId",requestParamsValidations(reportsParamsValidator),
  requestBodyValidator(addDiagnosticValidator),
  updateDiagosticOnId
);

module.exports = { diagnosticRouter };
