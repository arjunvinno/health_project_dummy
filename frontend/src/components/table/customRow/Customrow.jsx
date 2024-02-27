import React, { useContext, useState } from "react";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  FormControl,
  Popover,
  TableCell,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import styles from "../../table/customRow/Customrow.module.css";
import DeleteConfirm from "../../delete-confirm/DeleteConfirm";
import { ActionContext } from "../../../context/ActionContext";
import { saveData, updateData } from "../../../context/ApiReducer";
import * as types from "../../../context/actionType";
import { useParams } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
const Customrow = ({
  defaultData,
  index,
  data,
  setFunction,
  tableKeys,
  activeBtns,
  deleteRows,
  handleChange,
  filter,
  tableType,
  privateCheck,
  setAlertData,
  initialTableData,
  errors,
  setErrors,
  tableHeaders,
  dataRow1, dataRow2, dataRow3 
}) => {
  const [edit, setEdit] = useState(data[index].edit ? data[index].edit : false);
  const [open, setOpen] = React.useState(false);
  const { patientId } = useParams();
  const paragraphRef = React.useRef(null);
  // const { dataRow1, dataRow2, dataRow3 } = useContext(ActionContext);
  const { apiDispatch } = useContext(ActionContext);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const validateForm = () => {
    const newErrors = {};
    tableKeys.forEach((key) => {
      if (!data[index][key] && key !== "actions" && key !== "snomed_code") {
        newErrors[key] = `${key
          .toUpperCase()
          .split("_")
          .join(" ")} is required`;
      } else if (data[index][key] && key !== "actions") {
      } else {
        delete newErrors[key];
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkAllSaved = () => {
    return (
      dataRow1.find((el) => el.edit === true) ||
      dataRow2.find(
        (el) => el.edit === true || dataRow3.find((el) => el.edit === true)
      )
    );
  };

  function onClickEdit() {
    if (!checkAllSaved()) {
      setEdit(true);
      let newData = [...data];
      newData[index].edit = true;
      setFunction(newData);
    } else {
      setAlertData({
        severity: "warning",
        message: "Please complete previously added report actions",
      });
      setTimeout(() => {
        setAlertData({ severity: "", message: "" });
      }, 1500);
    }
  }

  const onCancel = () => {
    setEdit(false);
    let newData = [...initialTableData.map((el) => ({ ...el }))];
    newData[index].edit = false;
    setFunction(newData);
  };

  function onClickSave(e) {
    if (validateForm()) {
      (async () => {
        let body;
        let savedCodeBody;
        if (tableType === "diagnosis") {
          body = {
            date: data[index].date,
            icd_10: data[index].icd_10,
            signer: data[index].signer,
            comments: data[index].comments,
            snomed_code: data[index].snomed_code,
            description: data[index].description,
            filter: filter,
            user_id: patientId,
          };
          savedCodeBody={code: data[index].icd_10, description: data[index].description,type:'icd_10'}
          !body.snomed_code && delete body.snomed_code;
        } else if (tableType === "procedure") {
          body = {
            date: data[index].date,
            code: data[index].code,
            signer: data[index].signer,
            comments: data[index].comments,
            description: data[index].description,
            filter: filter,
            user_id: patientId,
            procedure_type: privateCheck ? "private" : "nhs",
          };
          savedCodeBody={code: data[index].code, description: data[index].description,type: privateCheck ? "ccsd" : "opcs-4"}
        }

        if (!data[index]._id) {
          await saveData(
            apiDispatch,
            {
              loading:
                tableType === "diagnosis"
                  ? types.AddDiagnostics_OnPatientId_Loading
                  : tableType === "procedure" &&
                    types.AddProcedures_OnPatientId_Loading,
              dataType:
                tableType === "diagnosis"
                  ? types.AddDiagnostics_OnPatientId
                  : tableType === "procedure" &&
                    types.AddProcedures_OnPatientId,
              error:
                tableType === "diagnosis"
                  ? types.AddDiagnostics_OnPatientId_error
                  : tableType === "procedure" &&
                    types.AddProcedures_OnPatientId_error,
            },
            tableType === "diagnosis"
              ? "diagnostic"
              : tableType === "procedure" && "procedure",
            body
          );
        } else {
          const params = {
            userId: data[index].user_id,
            reportId: data[index]._id,
            hospitalType: privateCheck ? "private" : "nhs",
          };
          await updateData(
            apiDispatch,
            {
              loading:
                tableType === "diagnosis"
                  ? types.UpdateDiagnostics_OnPatientId_Loading
                  : tableType === "procedure" &&
                    types.UpdateProcedures_OnPatientId_Loading,
              dataType:
                tableType === "diagnosis"
                  ? types.UpdateDiagnostics_OnPatientId
                  : tableType === "procedure" &&
                    types.UpdateProcedures_OnPatientId,
              error:
                tableType === "diagnosis"
                  ? types.UpdateDiagnostics_OnPatientId_error
                  : tableType === "procedure" &&
                    types.UpdateProcedures_OnPatientId_error,
            },
            tableType === "diagnosis"
              ? "diagnostic"
              : tableType === "procedure" && "procedure",
            params,
            body
          );
        }

        await saveData(
          apiDispatch,
          {
            loading:types.addSavedCodes_loading,
            dataType:types.addSavedCodes,
            error: types.addSavedCodes_error,
          },
         "mysavedcodes",
         savedCodeBody
        );
      })();
      setEdit(false);
      let newData = [...data];
      newData[index].edit = false;
      setFunction(newData);
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  const handlePopoverOpen = (event) => {
    let key = event.currentTarget.getAttribute("data-key");
    if (key === "description" || key === "comments" || key === "signer") {
      setAnchorEl(event.currentTarget);
    } else {
      setAnchorEl(null);
    }
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const openPopOver = Boolean(anchorEl);

  function setRowValues(row, index, data, setFunction) {
    let keysData = tableKeys;
    return keysData.map((key, i) => {
      let field;
      let codes = ["code", "icd_10"];
      if (edit) {
      }
      if (codes.includes(key) && edit && activeBtns.edit) {
        field = (
          <TableCell key={i} align="left" className={styles.tInfoTdOnEdit}>
            <label htmlFor="">
              {tableHeaders.find((el) => el.key === key).title} :
            </label>{" "}
            <FormControl fullWidth variant="standard">
              <TextField
                variant="standard"
                label={data[index][key] ? "" : "code"}
                fullWidth
                value={data[index][key]}
                className={data[index][key] ? styles.alignSelect : ""}
                onChange={(e) => handleChange(e, index, key, data, setFunction)}
                error={!!errors[key]}
                helperText={errors[key]}
              ></TextField>
            </FormControl>
          </TableCell>
        );
      } else if (
        (key === "description" || key === "comments") &&
        edit &&
        activeBtns.edit
      ) {
        field = (
          <TableCell
            key={i}
            align="left"
            className={`${styles.tInfoTdOnEdit} ${
              key === "description" ? styles.descriptionField : styles.comments
            }`}
          >
            <label htmlFor="">
              {tableHeaders.find((el) => el.key === key).title} :
            </label>
            <FormControl variant="standard" fullWidth>
              <TextField
                variant="standard"
                multiline
                label={
                  key === "description"
                    ? data[index][key]
                      ? ""
                      : "description"
                    : data[index][key]
                    ? ""
                    : "comments"
                }
                minRows={1}
                fullWidth
                maxRows={3}
                value={data[index][key]}
                style={{
                  minWidth:
                    tableType === "diagnosis"
                      ? "90px"
                      : tableType === "procedure" && "130px",
                  width: "100%",
                }}
                className={data[index][key] ? styles.alignSelect : ""}
                onChange={(e) => handleChange(e, index, key, data, setFunction)}
                error={!!errors[key]}
                helperText={errors[key]}
              ></TextField>
            </FormControl>
          </TableCell>
        );
      } else if (key === "date" && edit && activeBtns.edit) {
        let formatedDate;
        if (row[key]) {
          formatedDate = formatDate(row[key]);
        } else {
          formatedDate = row[key];
        }
        field = (
          <TableCell key={i} align="left" className={styles.tInfoTdOnEdit}>
            <label htmlFor="">
              {tableHeaders.find((el) => el.key === key).title} :
            </label>
            <FormControl variant="standard" fullWidth>
              <TextField
                fullWidth
                value={formatedDate}
                onChange={(e) => handleChange(e, index, key, data, setFunction)}
                className={
                  tableType === "diagnosis"
                    ? styles.dateFieldDiagnosis
                    : tableType === "procedure" && styles.dateFieldProcedure
                }
                variant="standard"
                type="date"
                error={!!errors[key]}
                helperText={errors[key]}
              ></TextField>
            </FormControl>
          </TableCell>
        );
      } else if (
        (key === "signer" || key === "snomed_code") &&
        edit &&
        activeBtns.edit
      ) {
        field = (
          <TableCell
            key={i}
            align="left"
            className={`${styles.tInfoTdOnEdit} ${styles.signer}`}
          >
            <label htmlFor="">
              {tableHeaders.find((el) => el.key === key).title} :
            </label>
            <FormControl variant="standard" fullWidth>
              <TextField
                variant="standard"
                fullWidth
                label={
                  key === "signer"
                    ? data[index][key]
                      ? ""
                      : "signer"
                    : data[index][key]
                    ? ""
                    : "snomed code"
                }
                type="text"
                value={data[index][key]}
                onChange={(e) => handleChange(e, index, key, data, setFunction)}
                className={data[index][key] ? styles.alignSelect : ""}
                // style={{ maxWidth: "8rem" }}
                error={!!errors[key]}
                helperText={errors[key]}
              ></TextField>
            </FormControl>
          </TableCell>
        );
      } else if (key === "actions") {
        field = (
          <TableCell
            align="center"
            key={i}
            style={{ verticalAlign: edit ? "inherit" : "midddle" }}
            className={`${styles.tInfoTd} ${edit && styles.font_600}`}
          >
            <label htmlFor="">{key.toUpperCase()} :</label>
            <div className={edit ? styles.actionOnEdit : styles.actions}>
              <Tooltip
                disableFocusListener
                disableTouchListener
                arrow
                title={edit ? "Save" : "Edit"}
                placement="top"
              >
                {edit ? (
                  <SaveIcon
                    onClick={(e) => onClickSave(e)}
                    className={styles.saveIcon}
                  ></SaveIcon>
                ) : (
                  <EditIcon
                    className={styles.editIcon}
                    onClick={onClickEdit}
                  ></EditIcon>
                )}
              </Tooltip>
              {edit && !defaultData?.newReport ? (
                <Tooltip
                  disableFocusListener
                  disableTouchListener
                  arrow
                  title="Cancel"
                  placement="top"
                >
                  <CloseIcon
                    // className={styles.deleteIcon}
                    sx={{
                      cursor: "pointer",
                      paddingLeft: "5px",
                      fontSize: "1.6rem",
                    }}
                    onClick={() => onCancel()}
                  ></CloseIcon>
                </Tooltip>
              ) : (
                <Tooltip
                  disableFocusListener
                  disableTouchListener
                  arrow
                  title="Delete"
                  placement="top"
                >
                  <DeleteIcon
                    className={styles.deleteIcon}
                    onClick={() => handleClickOpen()}
                  ></DeleteIcon>
                </Tooltip>
              )}

              <DeleteConfirm
                open={open}
                handleClose={handleClose}
                deleteRow={deleteRows}
                deleteData={{ index, data, setFunction }}
              ></DeleteConfirm>
            </div>
          </TableCell>
        );
      } else {
        if (row[key] || key === "snomed_code") {
          field = (
            <TableCell
              className={
                key === "comments"
                  ? styles.comments
                  : key === "description"
                  ? styles.descriptionField
                  : // ? styles.detailsField
                  codes.includes(key)
                  ? styles.codeClass
                  : styles.tInfoTd
              }
              key={i}
              align="left"
            >
              <label htmlFor="">
                {tableHeaders.find((el) => el.key === key)?.title} :
              </label>{" "}
              <p
                ref={paragraphRef}
                aria-owns={openPopOver ? "mouse-over-popover" : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
                data-key={key}
                style={{
                  textTransform:
                    key === "firstName" || key === "gender" ? "capitalize" : "",
                  margin: "0px",
                }}
                className={
                  key === "comments" ||
                  key === "description" ||
                  key === "signer"
                    ? styles.info
                    : ""
                }
              >
                {tableType === "patients" && key === "firstName"
                  ? row[key] + " " + row["lastName"]
                  : key === "date" || key === "dob"
                  ? formatDate(row[key])
                  : row[key]
                  ? row[key]
                  : "N/A"}
              </p>
              {(key === "comments" ||
                key === "description" ||
                key === "signer") && (
                <Popover
                  id="mouse-over-popover"
                  sx={{
                    pointerEvents: "none",
                  }}
                  disableScrollLock={true}
                  open={openPopOver}
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  onClose={handlePopoverClose}
                  disableRestoreFocus
                >
                  <Typography className={styles.popUp} sx={{ p: 1 }}>
                    {anchorEl && anchorEl.innerText}
                  </Typography>
                </Popover>
              )}
            </TableCell>
          );
        }
      }
      return field;
    });
  }

  return <>{setRowValues(defaultData, index, data, setFunction)}</>;
};

export default Customrow;
