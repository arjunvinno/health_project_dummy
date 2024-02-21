const mongoose = require("mongoose");
// schemas
const opcsCodeSchema = new mongoose.Schema({
  code: { type: String },
  description: { type: String },
});

const ccsdCodeSchema = new mongoose.Schema({
  code: { type: String },
  description: { type: String },
});

const icd10CodeSchema = new mongoose.Schema({
  code: { type: String },
  description: { type: String },
});
// --------------------

// models--------------
const OpcsCodeModel = mongoose.model(
  "opcsCodes",
  opcsCodeSchema
);

const CcsdCodeModel = mongoose.model(
  "ccsdCodes",
  ccsdCodeSchema
);

const Icd10CodeModel = mongoose.model(
  "icd10Codes",
  icd10CodeSchema
);


module.exports = {OpcsCodeModel,CcsdCodeModel,Icd10CodeModel};
