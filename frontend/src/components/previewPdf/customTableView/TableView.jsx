import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useRef, useState } from "react";
import styles from "./TableView.module.css";
import { v4 as uuidv4 } from "uuid";

const TableView = ({
  tableHeaders,
  tableType,
  defaultDataKeys,
  dataRow1,
  dataRow2,
  dataRow3,
  activeBtns,
}) => {
  let tableContainer = useRef(null);
  let [newTableHeaders, setnewTableHeaders] = useState([...tableHeaders]);

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

  function returnEmptyTableCells(noCells) {
    let cells = new Array(noCells).fill(0).map((row, i) => {
      return <TableCell key={uuidv4()} align="left"></TableCell>;
    });
    return cells;
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
  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
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
            tableType !== "patients" && tableType === "mysavedcodes"
              ? 600
              : "fit-content",
          boxShadow:
            "0px 0px 0px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.0), 0px 0px 0px 0px rgba(0,0,0,0.12)",
        }}
        ref={tableContainer}
      >
        <Table
          className={styles.tableCont}
          sx={{ minWidth: 700 }}
          stickyHeader
          aria-label="sticky table"
          id="reportDowmload"
        >
          <TableHead className="header">
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
                >
                  <TableCell className={styles.onNotEdit} align="left">
                    {subHeaders[0].header}
                  </TableCell>
                  {returnEmptyTableCells(newTableHeaders.length - 1).map(
                    (cell) => {
                      return cell;
                    }
                  )}
                </TableRow>
                {dataRow1.map((row, i) => {
                  return (
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
                    >
                      {defaultDataKeys.map((key, i) => (
                        <TableCell
                          className={`${styles.info} ${
                            key === "description"
                              ? styles.description
                              : key === "comments" && styles.comments
                          }`}
                          key={i}
                        >
                          <p>
                            {key === "date" ? formatDate(row[key]) : row[key]}
                          </p>
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}

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
                >
                  <TableCell align="left" className={styles.onNotEdit}>
                    {subHeaders[1].header}
                  </TableCell>
                  {returnEmptyTableCells(newTableHeaders.length - 1).map(
                    (cell) => {
                      return cell;
                    }
                  )}
                </TableRow>
                {dataRow2.map((row, i) => {
                  return (
                    <TableRow
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                      className={`${styles.tbodyInfoRow} ${
                        i !== dataRow2.length - 1 && styles.endRow
                      }`}
                    >
                      {defaultDataKeys.map((key, i) => (
                        <TableCell
                          className={`${styles.info} ${
                            key === "description"
                              ? styles.description
                              : key === "comments" && styles.comments
                          }`}
                          key={i}
                        >
                          <p>
                            {key === "date" ? formatDate(row[key]) : row[key]}
                          </p>
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}

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
                >
                  <TableCell className={styles.onNotEdit} align="left">
                    {subHeaders[2].header}
                  </TableCell>

                  {returnEmptyTableCells(newTableHeaders.length - 1).map(
                    (cell) => {
                      return cell;
                    }
                  )}
                </TableRow>
                {dataRow3.map((row, i) => {
                  return (
                    <TableRow
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                      className={`${styles.tbodyInfoRow} ${
                        i !== dataRow3.length - 1 && styles.endRow
                      }`}
                    >
                      {defaultDataKeys.map((key, i) => (
                        <TableCell
                          className={`${styles.info} ${
                            key === "description"
                              ? styles.description
                              : key === "comments" && styles.comments
                          }`}
                          key={i}
                        >
                          <p>
                            {key === "date" ? formatDate(row[key]) : row[key]}
                          </p>
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default TableView;
