const express = require("express");
const {
  addPatient,
  getPatientsByPagination,
  getIndivisualPatient,
  updateIndivisualPatient,
} = require("../controllers/patients_controller");
const {
  requestBodyValidator,
  requestQueryValidations,
  requestParamsValidations,
} = require("../validators/validation_middlewares");
const {
  addPatientValidator,
  getAllPatientsQueryValidator,
  patientParamsValidator,
} = require("../validators/validation_schemas");

const patientRouter = express.Router();

patientRouter.post(
  "/patient",
  requestBodyValidator(addPatientValidator),
  addPatient
);

patientRouter.get(
  "/patients",
  requestQueryValidations(getAllPatientsQueryValidator),
  getPatientsByPagination
);

patientRouter.get(
  "/patients/:patientId",
  requestParamsValidations(patientParamsValidator),
  getIndivisualPatient
);

patientRouter.patch(
  "/patient/:patientId",
  requestBodyValidator(addPatientValidator),
  updateIndivisualPatient
);

module.exports = { patientRouter };
