const mongoose = require("mongoose");

const patientShema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    default:""
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  mrnNo: {
    type: Number,
    required: true,
    unique:true
  },
  nhsNo: {
    type: Number,
    required: true,
  },
});

const patientsModel=mongoose.model('patient',patientShema)

module.exports={patientsModel}
