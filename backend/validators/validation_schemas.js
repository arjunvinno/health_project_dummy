const Joi = require("joi");

const getAllPatientsQueryValidator = {
  validate: {
    query: Joi.object({
      page: Joi.string().required(),
      limit: Joi.string().required(),
      firstName: Joi.string(),
      dob: Joi.date().max("now"),
      mrnNo: Joi.string(),
      nhsNo: Joi.string(),
      startDate: Joi.date(),
      endDate: Joi.date(),
    }),
  },
};

const getSavedCodesValidator ={
  validate: {
    query: Joi.object({
      page: Joi.string().required(),
      limit: Joi.string().required(),
      type: Joi.string().valid("icd_10", "opcs-4","ccsd","")
    }),
  },
}
const patientParamsValidator = {
  validate: {
    params: Joi.object({
      patientId: Joi.string().hex().length(24).required(),
    }),
  },
};

const reportsParamsValidator = {
  validate: {
    params: Joi.object({
      patientId: Joi.string().hex().length(24).required(),
      reportId: Joi.string().hex().length(24).required(),
    }),
  },
};

const reportsOnfilterValidator = {
  validate: {
    params: Joi.object({
      patientId: Joi.string().hex().length(24).required(),
      procedureType: Joi.string().required().valid("nhs", "private"),
    }),
  },
};

const addPatientValidator = {
  validate: {
    payload: Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string(),
      gender: Joi.string().required().valid("male", "female", "other"),
      age: Joi.number().integer().required().options({ convert: false }),
      dob: Joi.date().required().max("now"),
      mrnNo: Joi.number().integer().required().options({ convert: false }),
      nhsNo: Joi.number().integer().required().options({ convert: false }),
    }),
  },
};

const addDiagnosticValidator = {
  validate: {
    payload: Joi.object({
      date: Joi.date().required(),
      icd_10: Joi.string().required(),
      signer: Joi.string().required(),
      snomed_code: Joi.string(),
      filter: Joi.string()
        .required()
        .valid("diagnoses", "co_morbidities", "con_diagnoses"),
      user_id: Joi.string().hex().length(24).required(),
      comments: Joi.string().required(),
      description: Joi.string().required(),
    }),
  },
};

const addProcedureValidator = {
  validate: {
    payload: Joi.object({
      procedure_type: Joi.string().required().valid("nhs", "private"),
      description: Joi.string().required(),
      code: Joi.string().required(),
      comments: Joi.string().required(),
      date: Joi.date().required(),
      signer: Joi.string().required(),
      user_id: Joi.string().hex().length(24).required(),
      filter: Joi.string()
        .required()
        .valid("surgical_procedures", "ward_procedures", "relevant_procedures"),
    }),
  },
};

const addSavedCodeValidator = {
  validate: {
    payload: Joi.object({
      code: Joi.string().required(),
      description: Joi.string().required(),
      type: Joi.string()
        .required()
        .valid("icd_10", "opcs-4", "ccsd"),
    }),
  },
}

module.exports = {
  addPatientValidator,
  addDiagnosticValidator,
  addProcedureValidator,
  getAllPatientsQueryValidator,
  patientParamsValidator,
  reportsParamsValidator,
  reportsOnfilterValidator,
  addSavedCodeValidator,
  getSavedCodesValidator
};
