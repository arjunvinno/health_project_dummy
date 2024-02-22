import * as types from "./actionType";
import axios from "axios";

const baseUrl = "http://localhost:8080";

const hostUrl ="https://health-project-dummy.onrender.com"

export const apiReducer = (state, action) => {
  switch (action.type) {
    // codes
    case types.getCodes_Loading: {
      let newState = { ...state };
      newState.codes.loading = true;
      newState.codes.data = [{ code: "", description: "...loading" }];
      if (newState.codes.error.message) {
        newState.codes.error.message = "";
      }
      if (newState.codes.success.message) {
        newState.codes.success.message = "";
      }
      return newState;
    }

    case types.getCodes: {
      let newState = { ...state };
      newState.codes.loading = false;

      if (action.payload.data.length > 0) {
        newState.codes.data = action.payload.data;
      } else {
        newState.codes.data = [{ code: "", description: "No Results" }];
      }
      if (newState.codes.error.message) {
        newState.codes.error.message = "";
      }

      return newState;
    }

    case types.getCodes_error: {
      let newState = { ...state };
      newState.codes.loading = false;
      newState.codes.error.message = action.payload;
      if (newState.codes.success.message) {
        newState.codes.success.message = "";
      }
      return newState;
    }

    case types.clearSearchData: {
      let newState = { ...state };
      newState.codes.data = [];
      newState.codes.error.message = "";
      newState.codes.success.message = "";
      return newState;
    }

    //  DiagnosticsCases
    case types.AddDiagnostics_OnPatientId_Loading: {
      let newState = { ...state };
      newState.diagnosticsOnId.loading = true;
      if (newState.diagnosticsOnId.error.message) {
        newState.diagnosticsOnId.error.message = "";
      }
      if (newState.diagnosticsOnId.success.message) {
        newState.diagnosticsOnId.success.message = "";
      }
      return newState;
    }

    case types.AddDiagnostics_OnPatientId: {
      let newState = { ...state };
      newState.diagnosticsOnId.loading = false;
      newState.diagnosticsOnId.data = action.payload.data;
      if (newState.diagnosticsOnId.error.message) {
        newState.diagnosticsOnId.error.message = "";
      }
      newState.diagnosticsOnId.success.message =
        "Diagnostic added successfully";
      return newState;
    }

    case types.AddDiagnostics_OnPatientId_error: {
      let newState = { ...state };
      newState.diagnosticsOnId.loading = false;
      newState.diagnosticsOnId.error.message = action.payload;
      if (newState.diagnosticsOnId.success.message) {
        newState.diagnosticsOnId.success.message = "";
      }
      return newState;
    }

    case types.GetDiagnostics_OnPatientId_Loading: {
      let newState = { ...state };
      newState.diagnosticsOnId.loading = true;
      if (newState.diagnosticsOnId.error.message) {
        newState.diagnosticsOnId.error.message = "";
      }
      if (newState.diagnosticsOnId.success.message) {
        newState.diagnosticsOnId.success.message = "";
      }
      return newState;
    }

    case types.GetDiagnostics_OnPatientId: {
      let newState = { ...state };
      newState.diagnosticsOnId.loading = false;
      newState.diagnosticsOnId.data = action.payload.data;
      if (newState.diagnosticsOnId.error.message) {
        newState.diagnosticsOnId.error.message = "";
      }
      return newState;
    }

    case types.GetDiagnostics_OnPatientId_error: {
      let newState = { ...state };
      newState.diagnosticsOnId.loading = false;
      if (newState.diagnosticsOnId.success.message) {
        newState.diagnosticsOnId.success.message = "";
      }
      newState.diagnosticsOnId.error.message = action.payload;
      return newState;
    }

    case types.DeleteDiagnostics_OnPatientId_Loading: {
      let newState = { ...state };
      newState.diagnosticsOnId.loading = true;
      if (newState.diagnosticsOnId.error.message) {
        newState.diagnosticsOnId.error.message = "";
      }
      if (newState.diagnosticsOnId.success.message) {
        newState.diagnosticsOnId.success.message = "";
      }
      return newState;
    }

    case types.DeleteDiagnostics_OnPatientId: {
      let newState = { ...state };
      newState.diagnosticsOnId.loading = false;
      newState.diagnosticsOnId.data = action.payload.data;
      if (newState.diagnosticsOnId.error.message) {
        newState.diagnosticsOnId.error.message = "";
      }
      newState.diagnosticsOnId.success.message =
        "Diagnostic deleted successfully";
      return newState;
    }

    case types.DeleteDiagnostics_OnPatientId_error: {
      let newState = { ...state };
      newState.diagnosticsOnId.loading = false;
      newState.diagnosticsOnId.error.message = action.payload;
      if (newState.diagnosticsOnId.success.message) {
        newState.diagnosticsOnId.success.message = "";
      }
      return newState;
    }

    case types.UpdateDiagnostics_OnPatientId_Loading: {
      let newState = { ...state };
      newState.diagnosticsOnId.loading = true;
      if (newState.diagnosticsOnId.error.message) {
        newState.diagnosticsOnId.error.message = "";
      }
      if (newState.diagnosticsOnId.success.message) {
        newState.diagnosticsOnId.success.message = "";
      }
      return newState;
    }

    case types.UpdateDiagnostics_OnPatientId: {
      let newState = { ...state };
      newState.diagnosticsOnId.loading = false;
      newState.diagnosticsOnId.data = action.payload.data;
      if (newState.diagnosticsOnId.error.message) {
        newState.diagnosticsOnId.error.message = "";
      }
      newState.diagnosticsOnId.success.message =
        "Diagnostic updated successfully";
      return newState;
    }

    case types.UpdateDiagnostics_OnPatientId_error: {
      let newState = { ...state };
      newState.diagnosticsOnId.loading = false;
      newState.diagnosticsOnId.error.message = action.payload;
      if (newState.diagnosticsOnId.success.message) {
        newState.diagnosticsOnId.success.message = "";
      }
      return newState;
    }

    case types.ClearDiagnosticsAlert_Messages: {
      let newState = { ...state };
      if (newState.diagnosticsOnId.error.message) {
        newState.diagnosticsOnId.error.message = "";
      }
      if (newState.diagnosticsOnId.success.message) {
        newState.diagnosticsOnId.success.message = "";
      }
      return newState;
    }
    // ---------------------------------------------------------------------------------
    // procedure cases
    case types.AddProcedures_OnPatientId_Loading: {
      let newState = { ...state };
      newState.proceduresOnId.loading = true;
      if (newState.proceduresOnId.error.message) {
        newState.proceduresOnId.error.message = "";
      }
      if (newState.proceduresOnId.success.message) {
        newState.proceduresOnId.success.message = "";
      }
      return newState;
    }

    case types.AddProcedures_OnPatientId: {
      let newState = { ...state };
      newState.proceduresOnId.loading = false;
      newState.proceduresOnId.data = action.payload.data;
      if (newState.proceduresOnId.error.message) {
        newState.proceduresOnId.error.message = "";
      }
      newState.proceduresOnId.success.message = "Procedure added successfully";
      return newState;
    }

    case types.AddProcedures_OnPatientId_error: {
      let newState = { ...state };
      newState.proceduresOnId.loading = false;
      newState.proceduresOnId.error.message = action.payload;
      if (newState.proceduresOnId.success.message) {
        newState.proceduresOnId.success.message = "";
      }
      return newState;
    }

    case types.GetProcedures_OnPatientId_Loading: {
      let newState = { ...state };
      newState.proceduresOnId.loading = true;
      if (newState.proceduresOnId.error.message) {
        newState.proceduresOnId.error.message = "";
      }
      if (newState.proceduresOnId.success.message) {
        newState.proceduresOnId.success.message = "";
      }
      return newState;
    }

    case types.GetProcedures_OnPatientId: {
      let newState = { ...state };
      newState.proceduresOnId.loading = false;
      newState.proceduresOnId.data = action.payload.data;
      if (newState.proceduresOnId.error.message) {
        newState.proceduresOnId.error.message = "";
      }
      return newState;
    }

    case types.GetProcedures_OnPatientId_error: {
      let newState = { ...state };
      newState.proceduresOnId.loading = false;
      if (newState.proceduresOnId.success.message) {
        newState.proceduresOnId.success.message = "";
      }
      newState.proceduresOnId.error.message = action.payload;
      return newState;
    }

    case types.DeleteProcedures_OnPatientId_Loading: {
      let newState = { ...state };
      newState.proceduresOnId.loading = true;
      if (newState.proceduresOnId.error.message) {
        newState.proceduresOnId.error.message = "";
      }
      if (newState.proceduresOnId.success.message) {
        newState.proceduresOnId.success.message = "";
      }
      return newState;
    }

    case types.DeleteProcedures_OnPatientId: {
      let newState = { ...state };
      newState.proceduresOnId.loading = false;
      newState.proceduresOnId.data = action.payload.data;
      if (newState.proceduresOnId.error.message) {
        newState.proceduresOnId.error.message = "";
      }
      newState.proceduresOnId.success.message =
        "Procedure deleted successfully";
      return newState;
    }

    case types.DeleteProcedures_OnPatientId_error: {
      let newState = { ...state };
      newState.proceduresOnId.loading = false;
      newState.proceduresOnId.error.message = action.payload;
      if (newState.proceduresOnId.success.message) {
        newState.proceduresOnId.success.message = "";
      }
      return newState;
    }

    case types.UpdateProcedures_OnPatientId_Loading: {
      let newState = { ...state };
      newState.proceduresOnId.loading = true;
      if (newState.proceduresOnId.error.message) {
        newState.proceduresOnId.error.message = "";
      }
      if (newState.proceduresOnId.success.message) {
        newState.proceduresOnId.success.message = "";
      }
      return newState;
    }

    case types.UpdateProcedures_OnPatientId: {
      let newState = { ...state };
      newState.proceduresOnId.loading = false;
      newState.proceduresOnId.data = action.payload.data;
      if (newState.proceduresOnId.error.message) {
        newState.proceduresOnId.error.message = "";
      }
      newState.proceduresOnId.success.message =
        "Procedure updated successfully";
      return newState;
    }

    case types.UpdateProcedures_OnPatientId_error: {
      let newState = { ...state };
      newState.proceduresOnId.loading = false;
      newState.proceduresOnId.error.message = action.payload;
      if (newState.proceduresOnId.success.message) {
        newState.proceduresOnId.success.message = "";
      }
      return newState;
    }

    case types.ClearProceduresAlert_Messages: {
      let newState = { ...state };
      if (newState.proceduresOnId.error.message) {
        newState.proceduresOnId.error.message = "";
      }
      if (newState.proceduresOnId.success.message) {
        newState.proceduresOnId.success.message = "";
      }
      return newState;
    }

    //  patientsCases
    case types.AddPatient_OnAllPatients_Loading: {
      let newState = { ...state };
      newState.allPatients.loading = true;
      if (newState.allPatients.error.message) {
        newState.allPatients.error.message = "";
      }
      if (newState.allPatients.success.message) {
        newState.allPatients.success.message = "";
      }
      return newState;
    }

    case types.AddPatient_OnAllPatients: {
      let newState = { ...state };
      newState.allPatients.loading = false;
      newState.allPatients.data = action.payload.data;
      newState.allPatients.totalCount = action.payload.totalCount;
      if (newState.allPatients.error.message) {
        newState.allPatients.error.message = "";
      }
      newState.allPatients.success.message = "Patient added successfully";
      return newState;
    }

    case types.AddPatient_OnAllPatients_error: {
      let newState = { ...state };
      newState.allPatients.loading = false;
      newState.allPatients.error.message = action.payload;
      if (newState.allPatients.success.message) {
        newState.allPatients.success.message = "";
      }
      return newState;
    }

    case types.GetPatient_OnAllPatients_Loading: {
      let newState = { ...state };
      newState.allPatients.loading = true;
      if (newState.allPatients.error.message) {
        newState.allPatients.error.message = "";
      }
      if (newState.allPatients.success.message) {
        newState.allPatients.success.message = "";
      }
      return newState;
    }

    case types.GetPatient_OnAllPatients: {
      let newState = { ...state };
      newState.allPatients.loading = false;
      newState.allPatients.data = action.payload.data;
      newState.allPatients.totalCount = action.payload.totalCount;
      if (newState.allPatients.error.message) {
        newState.allPatients.error.message = "";
      }
      return newState;
    }

    case types.GetPatient_OnAllPatients_error: {
      let newState = { ...state };
      newState.allPatients.loading = false;
      if (newState.allPatients.success.message) {
        newState.allPatients.success.message = "";
      }
      newState.allPatients.error.message = action.payload;
      return newState;
    }

    case types.ClearPatientsAlert_Messages: {
      let newState = { ...state };
      if (newState.allPatients.error.message) {
        newState.allPatients.error.message = "";
      }
      if (newState.allPatients.success.message) {
        newState.allPatients.success.message = "";
      }
      return newState;
    }
    //  indivisual patients cases
    case types.GetPatient_IndivisualPatient_loading: {
      let newState = { ...state };
      newState.patient.loading = true;
      if (newState.patient.error.message) {
        newState.patient.error.message = "";
      }
      if (newState.patient.success.message) {
        newState.patient.success.message = "";
      }
      return newState;
    }

    case types.GetPatient_IndivisualPatient: {
      let newState = { ...state };
      newState.patient.loading = false;
      newState.patient.data = action.payload.data;
      if (newState.patient.error.message) {
        newState.patient.error.message = "";
      }
      return newState;
    }

    case types.GetPatient_IndivisualPatient_error: {
      let newState = { ...state };
      newState.patient.loading = false;
      if (newState.patient.success.message) {
        newState.patient.success.message = "";
      }
      newState.patient.error.message = action.payload;
      return newState;
    }

    case types.UpdatePatient_IndivisualPatient_Loading: {
      let newState = { ...state };
      newState.patient.loading = true;
      if (newState.patient.error.message) {
        newState.patient.error.message = "";
      }
      if (newState.patient.success.message) {
        newState.patient.success.message = "";
      }
      return newState;
    }

    case types.UpdatePatient_IndivisualPatient: {
      let newState = { ...state };
      newState.patient.loading = false;
      newState.patient.data = action.payload.data;
      if (newState.patient.error.message) {
        newState.patient.error.message = "";
      }
      newState.patient.success.message = "Patient updated successfully";
      return newState;
    }

    case types.UpdatePatient_IndivisualPatient_error: {
      let newState = { ...state };
      newState.patient.loading = false;
      newState.patient.error.message = action.payload;
      if (newState.patient.success.message) {
        newState.patient.success.message = "";
      }
      return newState;
    }
    case types.ClearPatientAlert_Messages: {
      let newState = { ...state };
      if (newState.patient.error.message) {
        newState.patient.error.message = "";
      }
      if (newState.patient.success.message) {
        newState.patient.success.message = "";
      }
      return newState;
    }
    default:
      return state;
  }
};

export const fetchData = async (dispatch, types, path, params, queryParams) => {
  try {
    let url;
    if (params) {
      url = params.procedureType
        ? `${hostUrl}/${path}/${params.userId}/${params.procedureType}`
        : `${hostUrl}/${path}/${params.userId}`;
    } else {
      url = `${hostUrl}/${path}`;
    }

    if (!queryParams) {
      queryParams = {};
    }

    dispatch({ type: types.loading });
    const response = await axios.get(url, {
      params: queryParams,
    });
    dispatch({ type: types.dataType, payload: response.data });
  } catch (error) {
    console.log(error);
    dispatch({
      type: types.error,
      payload: error?.response?.data?.message
        ? error.response.data.message
        : error?.response?.data?.error?.message
        ? error.response.data.error.message
        : error.message,
    });
    console.error(`Error fetching ${types.dataType}:`, error);
  }
};

export const saveData = async (dispatch, types, path, body) => {
  try {
    dispatch({ type: types.loading });
    const response = await axios.post(`${hostUrl}/${path}`, body);
    dispatch({ type: types.dataType, payload: response.data });
  } catch (error) {
    console.log(error);
    dispatch({
      type: types.error,
      payload: error?.response?.data?.message
        ? error.response.data.message
        : error?.response?.data?.error?.message
        ? error.response.data.error.message
        : error.message,
    });
    console.error(`Error fetching ${types.dataType}:`, error);
  }
};

export const deleteData = async (dispatch, types, path, params) => {
  try {
    dispatch({ type: types.loading });
    const response = await axios.delete(
      `${hostUrl}/${path}/${params.userId}/${params.reportId}`
    );
    dispatch({ type: types.dataType, payload: response.data });
  } catch (error) {
    dispatch({
      type: types.error,
      payload: error?.response?.data?.message
        ? error.response.data.message
        : error?.response?.data?.error?.message
        ? error.response.data.error.message
        : error.message,
    });
    console.error(`Error fetching ${types.dataType}:`, error);
  }
};

export const updateData = async (dispatch, types, path, params, updateData) => {
  try {
    let url = `${hostUrl}/${path}`;
    if (params.userId) {
      url = `${url}/${params.userId}`;
    }
    if (params.reportId) {
      url = `${url}/${params.reportId}`;
    }
    dispatch({ type: types.loading });
    const response = await axios.patch(url, updateData);
    dispatch({ type: types.dataType, payload: response.data });
  } catch (error) {
    dispatch({
      type: types.error,
      payload: error?.response?.data?.message
        ? error.response.data.message
        : error?.response?.data?.error?.message
        ? error.response.data.error.message
        : error.message,
    });
    console.error(`Error fetching ${types.dataType}:`, error);
  }
};
