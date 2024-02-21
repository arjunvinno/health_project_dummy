const mongoose = require("mongoose");

const DiagnosticsSchema = new mongoose.Schema({
  diagnostics: { type: String },
  code: { type: String },
  description: { type: String },
});

const StoreDiagnosticsModel = mongoose.model(
  "Diagnostics_data",
  DiagnosticsSchema
);

module.exports = StoreDiagnosticsModel;
