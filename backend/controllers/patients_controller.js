const { getData, updateData } = require("../helpers/dbQuery");
const { diagnosticsModel } = require("../models/diagnostic_model");
const { patientsModel } = require("../models/patient_model");
const { procedureModel } = require("../models/procedure_model");
const addPatient = async (req, res) => {
  try {
    const { firstName, lastName, gender, age, dob, mrnNo, nhsNo } = req.body;
    const new_patient = new patientsModel({
      firstName,
      lastName,
      gender,
      age,
      dob,
      mrnNo,
      nhsNo,
    });
    let AllPatients;
    let totalCount;
    try {
      let patient = await patientsModel.findOne({ mrnNo });
      if (!patient) {
        await new_patient.save();
        AllPatients = await patientsModel.find({}).skip(0).limit(5);
        totalCount = await getData(patientsModel, {});
      } else {
        return res.status(409).json({
          message: "Duplicate MRN number. Please provide a unique MRN number.",
          error: true,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        message: "Bad request",
        error: true,
      });
    }
    res.status(200).send({
      message: "Patient added successful",
      success: true,
      data: AllPatients,
      totalCount: totalCount.length,
    });
  } catch ({ error }) {
    console.log(error);
    res.status(500).json({ message: error, error: true });
  }
};

const getPatientsByPagination = async (req, res) => {
  try {
    let query = { ...req.query };
    let { page, limit } = req.query;
    let skip;
    if (req.query.firstName) {
      const regexQuery = new RegExp(req.query.firstName, "i");
      delete query.firstName;
      query = { $or: [{ firstName: regexQuery }], ...query };
    }
    if (req.query.startDate && req.query.endDate) {
      const from = req.query.startDate;
      const to = req.query.endDate;
      let filterDiaIds = await diagnosticsModel
        .find({ date: { $gte: from, $lte: to } })
        .distinct("user_id");
      let filterProceIds = await procedureModel
        .find({ date: { $gte: from, $lte: to } })
        .distinct("user_id");
      let uniqueIds = [];

      const mergedArray = filterDiaIds.concat(filterProceIds);

      uniqueIds = [...new Set(mergedArray)];

      skip = page * limit;
      delete query.startDate;
      delete query.endDate;
      query = { _id: { $in: uniqueIds }, ...query };
    } else if (req.query.startDate) {
      return res
        .status(400)
        .send({ message: "Must include endDate", error: true });
    } else if (req.query.endDate) {
      return res
        .status(400)
        .send({ message: "Must include startDate", error: true });
    }
    if (page && limit) {
      skip = page * limit;
      delete query.limit;
      delete query.page;
    }
    let patients = await patientsModel.find(query).skip(skip).limit(limit);
    let totalCount = await patientsModel.find(query);
    res.status(200).send({
      data: patients,
      message: "success",
      totalCount: totalCount.length,
    });
  } catch ({ error }) {
    console.log(error, "=======>error");
    res.status(500).send({ message: error, error: true });
  }
};

const getIndivisualPatient = async (req, res) => {
  try {
    let { patientId: _id } = req.params;
    let patient = await patientsModel.findOne({ _id });
    if (patient) {
      res
        .status(200)
        .send({ message: "success", success: true, data: patient });
    } else {
      res.status(404).send({ message: "NOT FOUND", error: true });
    }
  } catch ({ error }) {
    res.status(500).send({ message: error, error: true });
  }
};

const updateIndivisualPatient = async (req, res) => {
  try {
    const { patientId: _id } = req.params;
    const dataToUpdate = req.body;
    const updateResult = await updateData(patientsModel, { _id }, dataToUpdate);
    if (updateResult.success) {
      const patientData = await patientsModel.findOne({ _id });
      updateResult["data"] = patientData;
      return res.status(200).send(updateResult);
    } else if (updateResult.error) {
      return res.status(500).send(updateResult);
    }
  } catch (error) {
    res.status(500).send({ message: error, error: true });
  }
};

module.exports = {
  addPatient,
  getPatientsByPagination,
  getIndivisualPatient,
  updateIndivisualPatient,
};
