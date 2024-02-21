const Joi = require("joi");

const emailCustomMessages = {
  "string.base": "Email is not valid",
  "string.email": "Email is not valid",
  "string.empty": "Email is required",
  "any.required": "Email is required",
};

const passwordCustomMessages = {
  "string.base": "Password is not valid",
  "string.empty": "password is required",
  "any.required": "password is required",
  "string.pattern.base":
    "password must contain uppercase letter and lower case letter and number and special characters",
  "string.min": "password must contain 8 characters",
  "string.max": "password can have 15 characters maximum",
};

const signupValidatorOptions = {
  validate: {
    payload: Joi.object({
      username: Joi.string().required(),
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages(emailCustomMessages),

      password: Joi.string()
        .min(8)
        .max(15)
        .required()
        .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/)
        .messages(passwordCustomMessages),
    }),
    failAction: async (request, res, error) => {
      throw error;
    },
  },
};

const passwordValidationOptions = {
  validate: {
    payload: Joi.object({
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages(emailCustomMessages),

      password: Joi.string()
        .min(8)
        .max(15)
        .required()
        .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/)
        .messages(passwordCustomMessages),
    }),
    failAction: async (request, res, error) => {
      throw error;
    },
  },
};

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

module.exports = {
  signupValidatorOptions,
  passwordValidationOptions,
  addPatientValidator,
  addDiagnosticValidator,
  addProcedureValidator,
  getAllPatientsQueryValidator,
  patientParamsValidator,
  reportsParamsValidator,
  reportsOnfilterValidator,
};
