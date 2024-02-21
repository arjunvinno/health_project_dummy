async function getData(model, query) {
  const requiredData = await model.find(query);
  return requiredData;
}

async function deleteData(model, query) {
  try {
    let res = await model.deleteOne(query);
    if (res.deletedCount === 1) {
      return { message: "Deleted successfully", success: true };
    } else {
      return { message: "Report not found/Already deleted", success: true };
    }
  } catch (error) {
    return { message: error, error: true };
  }
}

async function updateData(model, query, updateData) {
  try {
    let res = await model.findOneAndUpdate(query, updateData, { new: true });
    if (res.updatedCount === 1) {
      return { message: "Updated successfully", success: true };
    } else {
      return { message: "Report not found", success: true };
    }
  } catch (error) {
    return { message: error, error: true };
  }
}

module.exports = { getData, deleteData, updateData };
