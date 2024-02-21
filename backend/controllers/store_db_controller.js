// To store procedures and diagnostics to DB.
// Store local xls file data to DB
const readline = require("readline");
const fs = require("fs");
const xlsx = require("xlsx");
const StoreDiagnosticsModel = require("../models/store_diagnostic_model");
const StoreProceduresModel = require("../models/store_procedure_model");
const path = require("path");
const {
  OpcsCodeModel,
  CcsdCodeModel,
  Icd10CodeModel,
} = require("../models/codes_model");

const config = {
  xlsPaths: {
    diagnostics: "/home/anisha/Downloads/diagnostics.xls", // path to the xml file
    procedures: "/home/anisha/Downloads/procedures.xls",
  },
  collections: {
    diagnostics: "diagnostics_data",
    procedures: "procedures_data",
  },
};

const addDataToCollection = async (xlsFilePath, Model, res) => {
  try {
    const workbook = xlsx.readFile(xlsFilePath);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    await Model.insertMany(sheetData);
    res.status(200).json({
      message: `Data successfully inserted into MongoDB collection: ${Model.collection.name}`,
      error: false,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message, error: true });
  }
};

const addDataToCollectionFromTextFile = async (xlsFilePath, Model, res) => {
  try {
    let data = [];
    const filePath = path.join(__dirname, xlsFilePath);
    const fileStream = fs.createReadStream(filePath);
    ("/home/anisha/Desktop/health-record-project/backend/ codes/OPCS48CodesAndTitlesNov2016V1.txt");
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      const [code, description] = line.split("\t");
      data.push({ code, description });
    }

    await Model.insertMany(data);
    res.status(200).json({
      message: `Data successfully inserted into MongoDB collection: ${Model.collection.name}`,
      error: false,
      data: data,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message, error: true });
  }
};

const getDataFromCollection = async (Model, req, res) => {
  try {
    const searchQuery = req.query.search;
    if (searchQuery) {
      const regexQuery = new RegExp(searchQuery, "i");
      const result = await Model.find({
        $or: [{ description: regexQuery }],
      });

      res.status(200).json({ data: result, error: false });
    } else {
      res.status(200).json({ data: [], error: false });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message, error: true });
  }
};

// const getDataFromCollection = async (Model, req, res) => {
//   try {
//     const searchQuery = req.query.search;
//     if (searchQuery) {
//       const regexQuery = new RegExp(searchQuery, "i");
//       const cursor = Model.find({ $or: [{ description: regexQuery }] }).cursor();

//       res.status(200);
//       res.write('[');

//       let first = true;

//       cursor.on('data', (doc) => {
//         if (!first) {
//           res.write(',');
//         } else {
//           first = false;
//         }
//         res.write(JSON.stringify(doc));
//       });

//       cursor.on('error', (err) => {
//         console.error("Error:", err);
//         res.status(500).json({ message: err.message, error: true });
//       });

//       cursor.on('end', () => {
//         res.write(']');
//         res.end();
//       });
//     } else {
//       res.status(200).json({ data: [], error: false });
//     }
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ message: error.message, error: true });
//   }
// };

const addDiagnosticsData = async (req, res) => {
  await addDataToCollection(
    config.xlsPaths.diagnostics,
    StoreDiagnosticsModel,
    res
  );
};

const addProceduresData = async (re, res) => {
  await addDataToCollection(
    config.xlsPaths.procedures,
    StoreProceduresModel,
    res
  );
};

const addOPCSdata = async (req, res) => {
  await addDataToCollectionFromTextFile(
    "../ codes/OPCS48CodesAndTitlesNov2016V1.txt",
    OpcsCodeModel,
    res
  );
};

const addCCSDdata = async (req, res) => {
  // await addDataToCollectionFromTextFile(
  //   "../ codes/OPCS48CodesAndTitlesNov2016V1.txt",
  //   CcsdCodeModel,
  //   res
  // );
  await addDataToCollection(config.xlsPaths.procedures, CcsdCodeModel, res);
};

const addICD10data = async (req, res) => {
  await addDataToCollectionFromTextFile(
    "../ codes/ICD-10 Codes",
    Icd10CodeModel,
    res
  );
};
const getDiagnosticsData = async (req, res) => {
  await getDataFromCollection(StoreDiagnosticsModel, req, res);
};

const getProceduresData = async (req, res) => {
  await getDataFromCollection(StoreProceduresModel, req, res);
};

const getOpcsCodesData = async (req, res) => {
  await getDataFromCollection(OpcsCodeModel, req, res);
};

const getCcsdCodesData = async (req, res) => {
  await getDataFromCollection(CcsdCodeModel, req, res);
};

const getIcd10CodesData = async (req, res) => {
  await getDataFromCollection(Icd10CodeModel, req, res);
};
module.exports = {
  addDiagnosticsData,
  addProceduresData,
  getDiagnosticsData,
  getProceduresData,
  addOPCSdata,
  getOpcsCodesData,
  getCcsdCodesData,
  getIcd10CodesData,
  addCCSDdata,
  addICD10data,
};
