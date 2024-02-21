const { procedureModel } = require("../models/procedure_model");
const { getData, deleteData, updateData } = require("../helpers/dbQuery");

const addProcedure = async (req, res) => {
  try {
    const {
      date,
      code,
      signer,
      comments,
      filter,
      user_id,
      description,
      procedure_type,
    } = req.body;

    const new_procedurelModel = new procedureModel({
      date,
      code,
      signer,
      comments,
      filter,
      user_id,
      description,
      procedure_type,
    });
    let AllProcedures;
    try {
      await new_procedurelModel.save();
      AllProcedures = await getData(procedureModel, {
        user_id,
        procedure_type: req.body.procedure_type,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error._message, error: true });
    }

    res.status(200).send({
      data: AllProcedures,
      message: "procedure saved successfully",
      success: true,
    });
  } catch ({ error }) {
    console.log(error);
    res.status(500).send({ message: error, error: true });
  }
};

const getProceduresOnId = async (req, res) => {
  try {
    const { patientId: _id, procedureType: procedure_type } = req.params;
    const proceduresData = await getData(procedureModel, {
      user_id: _id,
      procedure_type,
    });
    res.status(200).send({ data: proceduresData, message: "success" });
  } catch (error) {
    res.status(500).send({ message: error, error: true });
  }
};

const deleteProcedureOnId = async (req, res) => {
  try {
    const { patientId: user_id, reportId: _id } = req.params;
    const deleteResult = await deleteData(procedureModel, { user_id, _id });

    if (deleteResult.success) {
      const reports = await getData(procedureModel, { user_id });
      deleteResult["data"] = reports;
      return res.status(200).send(deleteResult);
    } else if (deleteResult.error) {
      return res.status(500).send(deleteResult);
    }
  } catch (error) {
    res.status(500).send({ message: error, error: true });
  }
};

const updateProcedureOnId = async (req, res) => {
  try {
    const { patientId: user_id, reportId: _id } = req.params;
    const dataToUpdate = req.body;
    const updateResult = await updateData(
      procedureModel,
      { user_id, _id },
      dataToUpdate
    );
    if (updateResult.success) {
      const reports = await getData(procedureModel, {
        user_id,
        procedure_type: req.body.procedure_type,
      });
      updateResult["data"] = reports;
      return res.status(200).send(updateResult);
    } else if (updateResult.error) {
      return res.status(500).send(updateResult);
    }
  } catch (error) {
    res.status(500).send({ message: error, error: true });
  }
};

module.exports = {
  addProcedure,
  getProceduresOnId,
  deleteProcedureOnId,
  updateProcedureOnId,
};
