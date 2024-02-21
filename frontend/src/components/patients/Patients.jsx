import React, { useContext, useEffect, useState } from "react";
import styles from "./Patients.module.css";
import {
  Button,
  Container,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField,
} from "@mui/material";
import * as types from "../../context/actionType";
import Customtable from "../table/Customtable";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";
import { ActionContext } from "../../context/ActionContext";
import Filter from "./FilterComponent.jsx/Filter";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { fetchData, saveData } from "../../context/ApiReducer";
import AlertPopUp from "../Alert-popup/AlertPopUp";
import ScrollToTop from "../ScrollToTop";

const Patients = () => {
  const [errors, setErrors] = useState({});
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const defaultDataKeys = [
    "firstName",
    "gender",
    "age",
    "dob",
    "mrnNo",
    "nhsNo",
    "startDate",
    "endDate",
  ];

  const initialQueryParams = () => {
    const params = new URLSearchParams(window.location.search);
    const initialParams = { page: 0, limit: 5 }; // Default values
    defaultDataKeys.forEach((filter) => {
      if (params.get(filter)) {
        initialParams[filter] = params.get(filter);
      }
    });
    return initialParams;
  };
  const [queryParams, setQueryParams] = useState(initialQueryParams());
  const [open, setOpen] = React.useState(false);
  const {
    setDataRow1,
    apiDispatch,
    datas: { allPatients },
    handleBackDropOpen,
    handleBackDropClose,
    handleAlertOpen,
  } = useContext(ActionContext);

  const today = dayjs();

  const [alertData, setAlertData] = useState({
    severity: "",
    message: "",
  });

  let initialData = {
    firstName: "",
    lastName: "",
    gender: "",
    age: "",
    dob: null,
    mrnNo: "",
    nhsNo: "",
  };
  const tableHeaders = [
    {
      title: "NAME",
      subTitle: "",
      key: "firstName",
    },
    {
      title: "GENDER",
      subTitle: "",
      key: "gender",
    },
    {
      title: "AGE",
      subTitle: "",
      key: "age",
    },
    {
      title: "DOB",
      subTitle: "",
      key: "dob",
    },
    {
      title: "MRN NO",
      subTitle: "",
      key: "mrnNo",
    },
    {
      title: "NHS NO",
      subTitle: "",
      key: "nhsNo",
    },
  ];

  const [patientData, setPatientData] = useState(initialData);

  useEffect(() => {
    (async () => {
      await fetchData(
        apiDispatch,
        {
          loading: types.GetPatient_OnAllPatients_Loading,
          dataType: types.GetPatient_OnAllPatients,
          error: types.GetPatient_OnAllPatients_error,
        },
        "patients",
        "",
        queryParams
      );
    })();
    return () => {
      apiDispatch({ type: types.ClearPatientsAlert_Messages });
    };
  }, [queryParams]);

  useEffect(() => {
    setQueryParams({ ...queryParams, page: page, limit: rowsPerPage });
  }, [page, rowsPerPage]);

  useEffect(() => {
    if (allPatients.loading) {
      handleBackDropOpen();
    } else {
      if (allPatients.data.length > 0) {
        setDataRow1(allPatients.data);
      } else {
        setDataRow1([]);
      }
      if (allPatients.success.message) {
        setAlertData({
          severity: "success",
          message: allPatients.success.message,
        });
      }

      if (allPatients.error.message) {
        setAlertData({
          severity: "error",
          message: allPatients.error.message,
        });
      }
      setTimeout(() => {
        setAlertData({ severity: "", message: "" });
        apiDispatch({ type: types.ClearPatientsAlert_Messages });
      }, 1500);
      handleBackDropClose();
    }
  }, [
    allPatients.loading,
    allPatients.data,
    allPatients.error.message,
    allPatients.success.message,
  ]);

  useEffect(() => {
    if (alertData.message) {
      handleAlertOpen();
    }
  }, [alertData.message]);

  const applyFilter = () => {
    const params = new URLSearchParams(window.location.search);
    if (page > 0) {
      setPage(0);
    }
    let newqueryParams = { page: 0, limit: rowsPerPage };

    defaultDataKeys.forEach((filter) => {
      if (params.get(filter)) {
        newqueryParams[filter] = params.get(filter);
      }
    });
    setQueryParams(newqueryParams);
  };

  const onSave = async () => {
    if (validateForm()) {
      let body = {
        ...patientData,
      };
      body.age = +body.age;
      body.mrnNo = +body.mrnNo;
      body.nhsNo = +body.nhsNo;
      !body.lastName && delete body.lastName;
      await saveData(
        apiDispatch,
        {
          loading: types.AddPatient_OnAllPatients_Loading,
          dataType: types.AddPatient_OnAllPatients,
          error: types.AddPatient_OnAllPatients_error,
        },
        "patient",
        body
      );
      handleClose();
    }
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

  const validateForm = () => {
    const newErrors = {};
    for (let key in patientData) {
      if (!patientData[key] && key !== "lastName") {
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

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setPatientData(initialData);
    setErrors({});
    setOpen(false);
  };

  return (
    <div>
      <ScrollToTop></ScrollToTop>
      <Container className={styles.container} maxWidth="xl">
        <AlertPopUp
          severity={alertData.severity}
          message={alertData.message}
        ></AlertPopUp>
        <div className={styles.btnWrapper}>
          <Button
            className={styles.addBtn}
            component="label"
            variant="contained"
            onClick={handleClickOpen}
            startIcon={<AddIcon />}
          >
            Add Patient
          </Button>
          <Dialog
            // onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            maxWidth="lg"
            open={open}
            disableScrollLock={true}
            className={styles.dialogContainer}
          >
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
              Add Patient
            </DialogTitle>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
            <DialogContent className={styles.contentBody} dividers>
              <div className={styles.modalWrapper}>
                <TextField
                  style={{ maxWidth: "48%", minWidth: "48%" }}
                  id="outlined-basic"
                  label="First name*"
                  variant="outlined"
                  name="firstName"
                  disableScrollLock={true}
                  onChange={(e) => handleChange(e)}
                  value={patientData.firstName}
                  error={!!errors["firstName"]}
                  helperText={errors["firstName"]}
                />
                <TextField
                  style={{ maxWidth: "48%", minWidth: "48%" }}
                  id="outlined-basic"
                  label="Last name"
                  variant="outlined"
                  name="lastName"
                  onChange={(e) => handleChange(e)}
                  value={patientData.lastName}
                  error={!!errors["lastName"]}
                  helperText={errors["lastName"]}
                  disableScrollLock={true}
                />
              </div>
              <div className={styles.modalWrapper}>
                <TextField
                  select
                  id="outlined-basic"
                  label="Gender*"
                  variant="outlined"
                  style={{ maxWidth: "48%", minWidth: "48%" }}
                  SelectProps={{
                    displayEmpty: true,
                    renderValue: (selected) => (selected ? selected : ""),
                  }}
                  name="gender"
                  onChange={(e) => handleChange(e)}
                  value={patientData.gender}
                  error={!!errors["gender"]}
                  helperText={errors["gender"]}
                  disableScrollLock={true}
                >
                  {genderOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  style={{ maxWidth: "48%", minWidth: "48%" }}
                  id="outlined-basic"
                  label="Age*"
                  type="number"
                  variant="outlined"
                  name="age"
                  onChange={(e) => handleChange(e)}
                  value={patientData.age}
                  error={!!errors["age"]}
                  helperText={errors["age"]}
                  disableScrollLock={true}
                />
              </div>
              <div className={styles.modalWrapper}>
                <div style={{ width: "100%" }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      fullWidth
                      defaultValue={dayjs(patientData.dob)}
                      onChange={(e) => handleChange(e)}
                      maxDate={today}
                      views={["year", "month", "day"]}
                      sx={{ width: "100%!important" }}
                      error={!!errors["dob"]}
                      helperText={errors["dob"]}
                      label="DOB"
                    />{" "}
                  </LocalizationProvider>
                  <p className={styles.dobAlert}>{errors["dob"]}</p>
                </div>

                <TextField
                  style={{ maxWidth: "48%", minWidth: "48%" }}
                  id="outlined-basic"
                  label="MRN no*"
                  type="number"
                  variant="outlined"
                  name="mrnNo"
                  onChange={(e) => handleChange(e)}
                  value={patientData.mrnNo}
                  error={!!errors["mrnNo"]}
                  helperText={errors["mrnNo"]}
                  disableScrollLock={true}
                />
              </div>
              <div className={styles.modalWrapper}>
                <TextField
                  style={{ maxWidth: "48%", minWidth: "48%" }}
                  id="outlined-basic"
                  label="NHS no*"
                  type="number"
                  variant="outlined"
                  name="nhsNo"
                  onChange={(e) => handleChange(e)}
                  value={patientData.nhsNo}
                  error={!!errors["nhsNo"]}
                  helperText={errors["nhsNo"]}
                  disableScrollLock={true}
                />
              </div>
            </DialogContent>
            <DialogActions sx={{ padding: "15px 24px" }}>
              <Button
                className={styles.submitBtn}
                variant="contained"
                autoFocus
                onClick={onSave}
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </div>

        <div>
          <Filter
            applyFilter={applyFilter}
            setParams={setQueryParams}
            page={page}
            rowsPerPage={rowsPerPage}
          ></Filter>
        </div>
        <Customtable
          tableHeaders={tableHeaders}
          tableType={"patients"}
          activeBtns={{
            edit: false,
            save: true,
            cancel: false,
            complete: false,
          }}
          defaultDataKeys={defaultDataKeys}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          initialTableData={{ tableRow1: [], tableRow2: [], tableRow3: [] }}
        ></Customtable>
      </Container>
    </div>
  );
};

export default Patients;
