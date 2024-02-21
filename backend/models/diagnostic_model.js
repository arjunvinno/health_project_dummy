const mongoose = require("mongoose");

const diagnosticSchema = mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  icd_10: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  signer: {
    type: String,
    required: true,
  },
  comments: {
    type: String,
    required: true,
  },
  snomed_code: {
    type: String,
    default:""
  },
  filter: {
    type: String,
    enum: ["diagnoses", "co_morbidities", "con_diagnoses"],
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

const diagnosticsModel = mongoose.model("diagnostic", diagnosticSchema);

module.exports = { diagnosticsModel };
