import {
  Paper,
  Skeleton,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "../table/Customtable.module.css";
import { v4 as uuidv4 } from "uuid";
import { ActionContext } from "../../context/ActionContext";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Customrow from "./customRow/Customrow";
import { deleteData } from "../../context/ApiReducer";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import * as types from "../../context/actionType";
import { useNavigate } from "react-router-dom";
const Customtable = ({
  tableHeaders,
  tableType,
  privateCheck,
  defaultDataKeys,
  setAlertData,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  initialTableData,
  dataRow1,
  setDataRow1,
  dataRow2,
  setDataRow2,
  dataRow3,
  setDataRow3,
  activeBtns
}) => {


  const { apiDispatch = () => {}, datas = {} } = useContext(ActionContext) || {};
  const { allPatients = { totalCount: 0 }, mySavedCodes = { totalCount: 0 } } = datas;
  let tableContainer = useRef(null);
  let [newTableHeaders, setnewTableHeaders] = useState([...tableHeaders]);
  const [tableKeys, setTableKeys] = useState(defaultDataKeys);
  const [expandedRow1, setExpandRow1] = useState(true);
  const [expandedRow2, setExpandRow2] = useState(true);
  const [expandedRow3, setExpandRow3] = useState(true);
  const [errors, setErrors] = useState({});

  let onExpand = (data, setFucntion) => {
    setFucntion(!data);
  };

  const navigate = useNavigate();
  let subHeaders = [
    {
      header: tableType === "diagnosis" ? "DIAGNOSES" : "PROCEDURES",
      toolTip: "",
    },
    {
      header:
        tableType === "diagnosis"
          ? "CO-MORBIDITIES"
          : "ANY PROCEDURES DONE ON THE WARD incl.by another clinical team",
      toolTip: "",
    },
    {
      header:
        tableType === "diagnosis"
          ? "CONCURRENT DIAGNOSES"
          : "RELEVANT INVESTIGATIONS IN HOSPITAL ",
      toolTip: "",
    },
  ];

  useEffect(() => {
    if (
      !activeBtns.edit &&
      tableType !== "patients" &&
      tableType !== "mysavedcodes"
    ) {
      let newHeaders = [...newTableHeaders];
      let index = newHeaders.findIndex((header) => {
        return header.title === "ACTIONS";
      });
      if (index) {
        newHeaders.splice(index, 1);
        setnewTableHeaders(newHeaders);
      }
      let newKeys = [...defaultDataKeys];
      let diaIndex = newKeys.indexOf("actions");
      diaIndex && newKeys.splice(diaIndex, 1);
      setTableKeys(newKeys);
    } else if (activeBtns.edit) {
      setnewTableHeaders(tableHeaders);
      setTableKeys(defaultDataKeys);
    }
  }, [activeBtns.edit]);

  const checkAllSaved = () => {
    return (
      dataRow1.find((el) => el.edit === true) ||
      dataRow2.find((el) => el.edit === true) ||
      dataRow3.find((el) => el.edit === true)
    );
  };

  let redirectToPatients = (row) => {
    navigate(`/patients/${row._id}`);
  };

  function addRows(data, setFunction) {
    if (checkAllSaved()) {
      setAlertData({
        severity: "warning",
        message: "Please complete previously added report actions",
      });
      setTimeout(() => {
        setAlertData({ severity: "", message: "" });
      }, 1500);
    } else {
      let newinitialFields;
      if (tableType === "diagnosis") {
        newinitialFields = {
          icd_10: "",
          description: "",
          comments: "",
          snomed_code: "",
          date: "",
          signer: "",
          edit: true,
          newReport: true,
        };
      } else {
        newinitialFields = {
          code: "",
          description: "",
          comments: "",
          date: "",
          signer: "",
          edit: true,
          newReport: true,
        };
      }
      setFunction([...data, newinitialFields]);
    }
  }

  const handleChange = (event, index, key, data, setFucntion) => {
    const newData = [...data];
    newData[index][key] = event.target.value
      ? event.target.value
      : event.target.outerText;
    setFucntion(newData);
    setErrors({});
  };

  function deleteRows(i, data, setFunction) {
    let newDiagnosis = [...data];
    newDiagnosis.splice(i, 1);
    setFunction([...newDiagnosis]);
    if (data[i]._id) {
      deleteData(
        apiDispatch,
        {
          loading:
            tableType === "diagnosis"
              ? types.DeleteDiagnostics_OnPatientId_Loading
              : tableType === "procedure" &&
                types.DeleteProcedures_OnPatientId_Loading,
          dataType:
            tableType === "diagnosis"
              ? types.DeleteDiagnostics_OnPatientId
              : tableType === "procedure" && types.DeleteProcedures_OnPatientId,
          error:
            tableType === "diagnosis"
              ? types.DeleteDiagnostics_OnPatientId_error
              : tableType === "procedure" &&
                types.DeleteProcedures_OnPatientId_error,
        },
        tableType === "diagnosis"
          ? "diagnostic"
          : tableType === "procedure" && "procedure",
        { userId: data[i].user_id, reportId: data[i]._id }
      );
    } else {
      setAlertData({ severity: "success", message: "Deleted successfully" });
      setTimeout(() => {
        setAlertData({ severity: "", message: "" });
      }, 1500);
    }
  }

  function returnEmptyTableCells(noCells, type, data) {
    let cells = new Array(noCells).fill(0).map((row, i) => {
      if (i === noCells - 1 && type === "header") {
        return (
          <TableCell
            className={styles.pointerEmpty}
            key={uuidv4()}
            align="left"
          >
            {data ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </TableCell>
        );
      } else {
        return (
          <TableCell
            className={
              type === "header" ? styles.pointerEmpty : styles.emptyCells
            }
            key={uuidv4()}
            align="left"
          ></TableCell>
        );
      }
    });
    return cells;
  }

  function toAddRowsView(data, setFunction) {
    return (
      <TableRow
        style={{
          display:
            activeBtns.edit &&
            tableType !== "patients" &&
            tableType !== "mysavedcodes"
              ? "table-row"
              : "none",
        }}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <TableCell className={styles.default_row} align="left">
          {" "}
          <div>
            <p style={{ margin: "0px", fontWeight: "500" }}>Add row</p>
            <AddCircleIcon
              className="pointer"
              onClick={() => addRows(data, setFunction)}
            ></AddCircleIcon>
          </div>
        </TableCell>
        {returnEmptyTableCells(newTableHeaders.length - 1).map((cell) => {
          return cell;
        })}
      </TableRow>
    );
  }

  function setNoData() {
    return (
      <TableRow>
        {returnEmptyTableCells(
          newTableHeaders.length % 2 === 0
            ? Math.ceil(newTableHeaders.length / 2)
            : Math.ceil(newTableHeaders.length / 2) - 1
        ).map((cell) => {
          return cell;
        })}
        <TableCell align={tableType === "diagnosis" ? "left" : "center"}>
          No data found
        </TableCell>
        {returnEmptyTableCells(Math.ceil(newTableHeaders.length / 2) - 1).map(
          (cell) => {
            return cell;
          }
        )}
      </TableRow>
    );
  }

  function setHeaders() {
    return newTableHeaders.map((row, i) => {
      let codes = ["OPCS-4", "CCSD", "ICD 10 CODE"];
      return (
        <TableCell
          sx={{
            width: codes.includes(row.title) ? "5rem" : "inherit",
          }}
          key={uuidv4()}
          className={styles.thead}
          align="left"
        >
          {row.title}
        </TableCell>
      );
    });
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div
      style={{
        padding: "8px",
        boxShadow: "0px 0px 11px -2px #887",
        borderRadius: "5px",
        backgroundColor: "white",
      }}
    >
      <TableContainer
        component={Paper}
        sx={{
          maxHeight:
            tableType !== "patients" && tableType !== "mysavedcodes"
              ? 600
              : "fit-content",
          boxShadow:
            "0px 0px 0px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.0), 0px 0px 0px 0px rgba(0,0,0,0.12)",
        }}
        ref={tableContainer}
      >
        <Table
          className={styles.tableCont}
          sx={{ minWidth: 650 }}
          sm={{ minWidth: "87vw", maxWidth: "87vw" }}
          stickyHeader
          aria-label="sticky table"
        >
          <TableHead className={styles.headerHead}>
            <TableRow className={styles.headerRow}>{setHeaders()}</TableRow>
          </TableHead>
          <TableBody>
            {dataRow1.length === 0 &&
            dataRow2.length === 0 &&
            dataRow3.length === 0 &&
            !activeBtns.edit ? (
              setNoData()
            ) : (
              <>
                {tableType !== "patients" && tableType !== "mysavedcodes" && (
                  <div style={{ height: "10px" }}></div>
                )}

                <TableRow
                  className={styles.headerRow}
                  style={{
                    display:
                      (activeBtns.edit || dataRow1.length) &&
                      tableType !== "patients" &&
                      tableType !== "mysavedcodes"
                        ? "table-row"
                        : "none",
                  }}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  onClick={() => onExpand(expandedRow1, setExpandRow1)}
                >
                  <TableCell
                    className={
                      activeBtns.edit
                        ? checkAllSaved()
                          ? styles.onEditActive
                          : tableType === "diagnosis"
                          ? styles.onEditNotActiveDia
                          : tableType === "procedure" &&
                            styles.onEditNotActiveProce
                        : styles.onNotEdit
                    }
                    align="left"
                  >
                    {subHeaders[0].header}
                  </TableCell>
                  {returnEmptyTableCells(
                    newTableHeaders.length - 1,
                    "header",
                    expandedRow1
                  ).map((cell) => {
                    return cell;
                  })}
                </TableRow>
                {dataRow1.map((row, i) => {
                  return (
                    <Slide
                      direction="up"
                      in={expandedRow1}
                      mountOnEnter
                      unmountOnExit
                      key={i}
                    >
                      <TableRow
                        className={
                          tableType === "patients"
                            ? `${styles.activeOnHover} ${
                                i !== dataRow1.length - 1 && styles.endRow
                              }`
                            : `${styles.tbodyInfoRow} ${
                                i !== dataRow1.length - 1 && styles.endRow
                              }`
                        }
                        onClick={() =>
                          tableType === "patients" && redirectToPatients(row)
                        }
                      >
                        <Customrow
                          defaultData={row}
                          index={i}
                          data={dataRow1}
                          setFunction={setDataRow1}
                          tableKeys={tableKeys}
                          activeBtns={activeBtns}
                          deleteRows={deleteRows}
                          handleChange={handleChange}
                          privateCheck={privateCheck}
                          tableType={tableType}
                          filter={
                            tableType === "diagnosis"
                              ? "diagnoses"
                              : tableType === "procedure" &&
                                "surgical_procedures"
                          }
                          setAlertData={setAlertData}
                          initialTableData={initialTableData.tableRow1}
                          errors={errors}
                          setErrors={setErrors}
                          tableHeaders={newTableHeaders}
                          dataRow1={dataRow1}
                          dataRow2={dataRow2}
                          dataRow3={dataRow3}
                        ></Customrow>
                      </TableRow>
                    </Slide>
                  );
                })}
                <Slide
                  direction="up"
                  in={expandedRow1}
                  mountOnEnter
                  unmountOnExit
                >
                  {toAddRowsView(dataRow1, setDataRow1)}
                </Slide>

                <TableRow
                  className={styles.headerRow}
                  style={{
                    display:
                      (activeBtns.edit || dataRow2.length) &&
                      tableType !== "patients" &&
                      tableType !== "mysavedcodes"
                        ? "table-row"
                        : "none",
                  }}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  onClick={() => onExpand(expandedRow2, setExpandRow2)}
                >
                  <TableCell
                    align="left"
                    className={
                      activeBtns.edit
                        ? checkAllSaved()
                          ? styles.onEditActive
                          : tableType === "diagnosis"
                          ? styles.onEditNotActiveDia
                          : tableType === "procedure" &&
                            styles.onEditNotActiveProce
                        : styles.onNotEdit
                    }
                  >
                    {subHeaders[1].header}
                  </TableCell>
                  {returnEmptyTableCells(
                    newTableHeaders.length - 1,
                    "header",
                    expandedRow2
                  ).map((cell) => {
                    return cell;
                  })}
                </TableRow>
                {dataRow2.map((row, i) => {
                  return (
                    <Slide
                      direction="up"
                      in={expandedRow2}
                      mountOnEnter
                      unmountOnExit
                      key={i}
                    >
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                        className={`${styles.tbodyInfoRow} ${
                          i !== dataRow2.length - 1 && styles.endRow
                        }`}
                      >
                        <Customrow
                          defaultData={row}
                          index={i}
                          data={dataRow2}
                          setFunction={setDataRow2}
                          tableKeys={tableKeys}
                          activeBtns={activeBtns}
                          deleteRows={deleteRows}
                          handleChange={handleChange}
                          privateCheck={privateCheck}
                          tableType={tableType}
                          filter={
                            tableType === "diagnosis"
                              ? "co_morbidities"
                              : tableType === "procedure" && "ward_procedures"
                          }
                          setAlertData={setAlertData}
                          initialTableData={initialTableData.tableRow2}
                          errors={errors}
                          setErrors={setErrors}
                          tableHeaders={newTableHeaders}
                          dataRow1={dataRow1}
                          dataRow2={dataRow2}
                          dataRow3={dataRow3}
                        ></Customrow>
                      </TableRow>
                    </Slide>
                  );
                })}
                <Slide
                  direction="up"
                  in={expandedRow2}
                  mountOnEnter
                  unmountOnExit
                >
                  {toAddRowsView(dataRow2, setDataRow2)}
                </Slide>

                <TableRow
                  className={styles.headerRow}
                  style={{
                    display:
                      (activeBtns.edit || dataRow3.length > 0) &&
                      tableType !== "patients" &&
                      tableType !== "mysavedcodes"
                        ? "table-row"
                        : "none",
                  }}
                  onClick={() => onExpand(expandedRow3, setExpandRow3)}
                >
                  <TableCell
                    className={
                      activeBtns.edit
                        ? checkAllSaved()
                          ? styles.onEditActive
                          : tableType === "diagnosis"
                          ? styles.onEditNotActiveDia
                          : tableType === "procedure" &&
                            styles.onEditNotActiveProce
                        : styles.onNotEdit
                    }
                    align="left"
                  >
                    {subHeaders[2].header}
                  </TableCell>

                  {returnEmptyTableCells(
                    newTableHeaders.length - 1,
                    "header",
                    expandedRow3
                  ).map((cell) => {
                    return cell;
                  })}
                </TableRow>
                {dataRow3.map((row, i) => {
                  return (
                    <Slide
                      direction="up"
                      in={expandedRow3}
                      mountOnEnter
                      unmountOnExit
                      key={i}
                    >
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                        className={`${styles.tbodyInfoRow} ${
                          i !== dataRow3.length - 1 && styles.endRow
                        }`}
                      >
                        <Customrow
                          defaultData={row}
                          index={i}
                          data={dataRow3}
                          setFunction={setDataRow3}
                          tableKeys={tableKeys}
                          activeBtns={activeBtns}
                          deleteRows={deleteRows}
                          handleChange={handleChange}
                          privateCheck={privateCheck}
                          tableType={tableType}
                          filter={
                            tableType === "diagnosis"
                              ? "con_diagnoses"
                              : tableType === "procedure" &&
                                "relevant_procedures"
                          }
                          setAlertData={setAlertData}
                          initialTableData={initialTableData.tableRow3}
                          errors={errors}
                          setErrors={setErrors}
                          tableHeaders={newTableHeaders}
                          dataRow1={dataRow1}
                          dataRow2={dataRow2}
                          dataRow3={dataRow3}
                        ></Customrow>
                      </TableRow>
                    </Slide>
                  );
                })}
                <Slide
                  direction="up"
                  in={expandedRow3}
                  mountOnEnter
                  unmountOnExit
                >
                  {toAddRowsView(dataRow3, setDataRow3)}
                </Slide>
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {(tableType === "patients" || tableType === "mysavedcodes") && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={
            tableType === "patients"
              ? allPatients.totalCount
              : tableType === "mysavedcodes" && mySavedCodes.totalCount
          }
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </div>
  );
};

export default Customtable;
