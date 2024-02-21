const { deleteData, getData, updateData } = require("../helpers/dbQuery");
const { diagnosticsModel } = require("../models/diagnostic_model");

const addDiagnosticOnId = async (req, res) => {
  try {
    const {
      date,
      icd_10,
      signer,
      comments,
      snomed_code,
      filter,
      user_id,
      description,
    } = req.body;

    const new_diagnostics = new diagnosticsModel({
      date,
      icd_10,
      signer,
      comments,
      snomed_code,
      filter,
      user_id,
      description,
    });
    let AllDiagnosis;
    try {
      await new_diagnostics.save();
      AllDiagnosis = await getData(diagnosticsModel, { user_id });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error._message, error: true });
    }

    res.status(200).send({
      data: AllDiagnosis,
      message: "Diagnostics saved successfully",
      success: true,
    });
  } catch ({ error }) {
    console.log(error);
    res.status(500).send({ message: error.message, error: true });
  }
};

const getDiagosticOnId = async (req, res) => {
  try {
    const { patientId: _id } = req.params;
    const diagnosticsData = await getData(diagnosticsModel, { user_id: _id });
    res.status(200).send({ data: diagnosticsData, message: "success" });
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteDiagosticOnId = async (req, res) => {
  try {
    const { patientId: user_id, reportId: _id } = req.params;
    const deleteResult = await deleteData(diagnosticsModel, { user_id, _id });

    if (deleteResult.success) {
      const reports = await getData(diagnosticsModel, { user_id });
      deleteResult["data"] = reports;
      return res.status(200).send(deleteResult);
    } else if (deleteResult.error) {
      return res.status(500).send(deleteResult);
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateDiagosticOnId = async (req, res) => {
  try {
    const { patientId: user_id, reportId: _id } = req.params;
    const dataToUpdate = req.body;
    const updateResult = await updateData(
      diagnosticsModel,
      { user_id, _id },
      dataToUpdate
    );
    if (updateResult.success) {
      const reports = await getData(diagnosticsModel, { user_id });
      updateResult["data"] = reports;
      return res.status(200).send(updateResult);
    } else if (updateResult.error) {
      return res.status(500).send(updateResult);
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  addDiagnosticOnId,
  getDiagosticOnId,
  deleteDiagosticOnId,
  updateDiagosticOnId,
};
