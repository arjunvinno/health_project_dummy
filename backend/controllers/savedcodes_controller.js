const { savedCodeModel }= require("../models/my_saved_codes_model")


const getSavedCodes = async (req,res) => {
  try {
    let skip=0
    let { page, limit,type } = req.query;
    if (page && limit) {
        skip = page * limit;
    }
    let totalCount;
    let savedCodeData;
    if(type){
      savedCodeData = await savedCodeModel.find({type}).skip(skip).limit(limit);
      totalCount = await savedCodeModel.find({type});
    }else{
      savedCodeData = await savedCodeModel.find({}).skip(skip).limit(limit);
      totalCount = await savedCodeModel.find({});
    }
   
    res.status(200).send({ data: savedCodeData,  totalCount: totalCount.length,message: "success" });
  } catch (error) {
    res.status(500).send({ message: error, error: true });
  }
};

const addSavedCode = async (req,res) => {
  try {
    const { code, description, type } = req.body;
    const existingCode = await savedCodeModel.findOne({ code });

    if (existingCode) {
      existingCode.frequency += 1;
      await existingCode.save();
      res.status(200).send({ data: [], message: "Increased frequency by one" });
    } else {
      await savedCodeModel.create({ code, description, type, frequency: 1 });
      res
        .status(200)
        .send({ data: [], message: "Code added to mysavedcodes successfully" });
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: error, error: true });
  }
};

module.exports={getSavedCodes,addSavedCode}


