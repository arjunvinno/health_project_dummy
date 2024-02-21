import React, { useContext, useEffect, useState } from "react";
import CustomField from "../Custom-fields/CustomFields";
import "./PatientFields.css";
import { Box, Button, Tooltip } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { fetchData, updateData } from "../../context/ApiReducer";
import { ActionContext } from "../../context/ActionContext";
import * as types from "../../context/actionType";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import AlertPopUp from "../Alert-popup/AlertPopUp";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
const PatientFields = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const [patientData, setPatientData] = useState({});
  const [edit, setEdit] = useState(false);
  const [errors, setErrors] = useState({});
  const [alertData, setAlertData] = useState({
    severity: "",
    message: "",
  });
  const {
    apiDispatch,

    datas: { patient },
    handleBackDropOpen,
    handleBackDropClose,
    handleAlertOpen,
  } = useContext(ActionContext);

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  useEffect(() => {
    (async () => {
      await fetchData(
        apiDispatch,
        {
          loading: types.GetPatient_IndivisualPatient_loading,
          dataType: types.GetPatient_IndivisualPatient,
          error: types.GetPatient_IndivisualPatient_error,
        },
        "patients",
        {
          userId: patientId,
        }
      );
    })();
    return () => {
      apiDispatch({ type: types.ClearPatientAlert_Messages });
    };
  }, []);

  useEffect(() => {
    if (patient.loading) {
      handleBackDropOpen();
    } else {
      if (patient.data) {
        setPatientData(patient.data);
      }
      if (patient.success.message) {
        setAlertData({
          severity: "success",
          message: patient.success.message,
        });
      }
      if (patient.error.message) {
        setAlertData({
          severity: "error",
          message: patient.error.message,
        });
      }
      setTimeout(() => {
        setAlertData({ severity: "", message: "" });
        apiDispatch({ type: types.ClearPatientAlert_Messages });
      }, 1500);
      handleBackDropClose();
    }
  }, [
    patient.loading,
    patient.data,
    patient.error.message,
    patient.success.message,
  ]);

  useEffect(() => {
    if (alertData.message) {
      handleAlertOpen();
    }
  }, [alertData.message]);

  const validateForm = () => {
    const newErrors = {};
    for (let key in patientData) {
      if (
        !patientData[key] &&
        key !== "_id" &&
        key !== "__v" &&
        key !== "lastName"
      ) {
        newErrors[key] = `${key
          .toUpperCase()
          .split("_")
          .join(" ")} is required`;
      } else {
        delete newErrors[key];
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const validateNumber = (value) => {
    return isNaN(value) || parseInt(value) < 0
      ? "Please enter a valid number (min value: 0)"
      : "";
  };

  const handleChange = (event) => {
    let formattedDate;
    let key = event?.target && event.target.name;

    if (!key) {
      const date = new Date(event);
      let [day, month, year] = date.toLocaleString().split(",")[0].split("/");
      formattedDate = new Date(`${year}-${month}-${day}`)
        .toISOString()
        .split("T")[0];
    }
    let value = key && event.target.value;
    let data = { ...patientData };
    if (key) {
      data[key] = value;
    } else {
      data["dob"] = formattedDate;
    }
    setPatientData(data);
    setErrors({});
  };

  const onUpdate = async () => {
    if (validateForm()) {
      setEdit(false);

      let body = {
        ...patientData,
      };
      delete body._id;
      delete body.__v;
      body.age = +body.age;
      body.mrnNo = +body.mrnNo;
      body.nhsNo = +body.nhsNo;
      !body.lastName && delete body.lastName;

      await updateData(
        apiDispatch,
        {
          loading: types.UpdatePatient_IndivisualPatient_Loading,
          dataType: types.UpdatePatient_IndivisualPatient,
          error: types.UpdatePatient_IndivisualPatient_error,
        },
        "patient",
        { userId: patientData._id },
        body
      );
    }
  };

  function formatDate(dateString) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
  }

  const onEdit = () => {
    setEdit(true);
  };

  const enableUpdateBtn = () => {
    for (let key in patient.data) {
      if (patientData[key] !== patient.data[key]) {
        return false;
      }
    }
    return true;
  };

  const onCancel = () => {
    setEdit(false);
    setPatientData(patient.data);
    setErrors({});
  };

  const navToPatients = () => {
    navigate("/patients");
  };

  return (
    <div className="patient-cont">
      <AlertPopUp
        severity={alertData.severity}
        message={alertData.message}
      ></AlertPopUp>
      <Box className="actions">
        {" "}
        <Button
          variant="contained"
          onClick={navToPatients}
          className="lookUpbtn"
        >
          Patient look up
        </Button>{" "}
      </Box>
      <div className="form">
        <div className="actionBtns">
          {edit ? (
            <>
              <Tooltip arrow title="Cancel" placement="top">
                <CloseIcon
                  onClick={(e) => onCancel()}
                  className={"cancelIcon"}
                ></CloseIcon>
              </Tooltip>
              <Button
                onClick={onUpdate}
                disabled={edit && enableUpdateBtn()}
                sx={{
                  minWidth: "fit-content",
                  padding: "0px",
                  marginLeft: "10px",
                }}
                className={edit && enableUpdateBtn() ? "disabled" : ""}
              >
                <Tooltip arrow title="Save" placement="top">
                  <SaveIcon className={"saveIcon"}></SaveIcon>
                </Tooltip>
              </Button>
            </>
          ) : (
            <Tooltip arrow title="Edit" placement="top">
              <EditIcon className={"editIcon"} onClick={onEdit}></EditIcon>
            </Tooltip>
          )}
        </div>
        <div className="cont-child">
          <CustomField
            label="FIRST NAME"
            type="text"
            textColor="#222"
            width="5rem"
            value={patientData.firstName}
            disabled={!edit}
            onChange={handleChange}
            // focused={true}
            name="firstName"
            error={!!errors["firstName"]}
            helperText={errors["firstName"]}
          ></CustomField>
          <CustomField
            label="LAST NAME"
            type="text"
            textColor="#222"
            width="50%"
            value={patientData.lastName}
            disabled={!edit}
            name="lastName"
            onChange={handleChange}
            error={!!errors["lastName"]}
            helperText={errors["lastName"]}
          ></CustomField>
        </div>
        <div className="left-details">
          <CustomField
            label="GENDER"
            select
            options={genderOptions}
            value={patientData.gender}
            placeholder="Select any"
            width="4 rem"
            disabled={!edit}
            name="gender"
            onChange={handleChange}
            error={!!errors["gender"]}
            helperText={errors["gender"]}
          ></CustomField>
          <CustomField
            label="AGE"
            type="number"
            validate={validateNumber}
            value={patientData.age}
            disabled={!edit}
            name="age"
            onChange={handleChange}
            error={!!errors["age"]}
            helperText={errors["age"]}
          ></CustomField>
          <div className={"dateField"}>
            <div className="cont-label">
              <label>
                DOB <span>:</span>
              </label>
            </div>

            <div style={{ width: "100%" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  fullWidth
                  className={"dateFielddate"}
                  defaultValue={dayjs(patientData.dob)}
                  onChange={(e) => handleChange(e)}
                  maxDate={dayjs()}
                  views={["year", "month", "day"]}
                  sx={{ width: "100%!important", marginRight: "0px" }}
                  disabled={!edit}
                />{" "}
              </LocalizationProvider>
              <p className={"dobAlert"}>{errors["dob"]}</p>
            </div>
          </div>
        </div>
        <div className="right-details">
          <CustomField
            label="MRN NO"
            type="number"
            validate={validateNumber}
            value={patientData.mrnNo}
            disabled={!edit}
            name="mrnNo"
            onChange={handleChange}
            error={!!errors["mrnNo"]}
            helperText={errors["mrnNo"]}
          ></CustomField>

          <CustomField
            label="NHS NO"
            type="number"
            validate={validateNumber}
            value={patientData.nhsNo}
            disabled={!edit}
            onChange={handleChange}
            name="nhsNo"
            error={!!errors["nhsNo"]}
            helperText={errors["nhsNo"]}
          ></CustomField>
        </div>
      </div>
    </div>
  );
};

export default PatientFields;
