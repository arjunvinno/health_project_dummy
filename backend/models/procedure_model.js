const mongoose = require("mongoose");

const procedureSchema = mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  comments: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  signer: {
    type: String,
    required: true,
  },
  filter: {
    type: String,
    enum: ["surgical_procedures", "ward_procedures", "relevant_procedures"],
    required: true,
  },
  procedure_type: {
    type: String,
    enum: ["nhs", "private"],
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

const procedureModel = mongoose.model("procedure", procedureSchema);

module.exports = { procedureModel };
