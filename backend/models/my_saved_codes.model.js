const mongoose = require("mongoose");

const savedCodeShema = mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default:""
  },
  type: {
    type: String,
    enum: ["icd_10", "opcs-4", "ccsd"],
    required: true,
  },
  fequency: {
    type: Number,
    default:0
  },
});

const savedCodeModel=mongoose.model('savedcode',savedCodeShema)

module.exports={savedCodeModel}
