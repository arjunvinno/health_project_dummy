const mongoose = require("mongoose");

const ProceduresSchema = new mongoose.Schema({
  procedures: { type: String },
  code: { type: String },
  description: { type: String },
  hospital: { type: String },
});

const StoreProceduresModel = mongoose.model("Procedures_data", ProceduresSchema);

module.exports = StoreProceduresModel;
