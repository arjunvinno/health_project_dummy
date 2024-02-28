import React, { useContext, useEffect, useRef, useState } from "react";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import styles from "./PreviewPdf.module.css";
import CloseIcon from "@mui/icons-material/Close";
import { ActionContext } from "../../context/ActionContext";
import TableView from "./customTableView/TableView";
import * as html2pdf from "html2pdf.js";
import axios from "axios";
import { hostUrl } from "../../context/ApiReducer";
import { useParams } from "react-router-dom";
import PatientViewDetails from "./PatientViewDetails/PatientViewDetails";
import { useReactToPrint } from "react-to-print";

const PreviewPdf = ({ open, handleClose, isPrint }) => {
  let [initialTableData, setinitialTableData] = useState({
    tr1: [],
    tr2: [],
    tr3: [],
  });
  const [alertData, setAlertData] = useState({
    severity: "",
    message: "",
  });
  let { patientId } = useParams();
  const componentPrintRef = useRef();

  const [diagnosticsData, setDiagnosticsData] = useState({
    data: [],
    dataRow1: [],
    dataRow2: [],
    daatRow3: [],
  });
  const [procedureNhsData, setprocedureNhsData] = useState({
    data: [],
    dataRow1: [],
    dataRow2: [],
    daatRow3: [],
  });
  const [procedurePrivateData, setprocedurePrivateData] = useState({
    data: [],
    dataRow1: [],
    dataRow2: [],
    daatRow3: [],
  });

  useEffect(() => {
    (async () => {
      let diagnosticResponse = await axios.get(
        hostUrl + "/diagnostic/" + patientId
      );
      setDiagnosticsData({
        ...diagnosticsData,
        data: diagnosticResponse.data.data,
      });

      let procedureNhsResponse = await axios.get(
        hostUrl + "/procedure/" + patientId + "/nhs"
      );
      setprocedureNhsData({
        ...procedureNhsData,
        data: procedureNhsResponse.data.data,
      });

      let procedurePrivateResponse = await axios.get(
        hostUrl + "/procedure/" + patientId + "/private"
      );
      setprocedurePrivateData({
        ...procedurePrivateData,
        data: procedurePrivateResponse.data.data,
      });
    })();
  }, []);

  useEffect(() => {
    filterOnTableData(
      diagnosticsData,
      ["diagnoses", "co_morbidities", "con_diagnoses"],
      setDiagnosticsData
    );
    filterOnTableData(
      procedureNhsData,
      ["surgical_procedures", "ward_procedures", "relevant_procedures"],
      setprocedureNhsData
    );
    filterOnTableData(
      procedurePrivateData,
      ["surgical_procedures", "ward_procedures", "relevant_procedures"],
      setprocedurePrivateData
    );
  }, [diagnosticsData.data, procedureNhsData.data, procedurePrivateData.data]);

  function filterOnTableData(data, filters, setData) {
    let newData = { ...data };
    let tableOneData = data.data
      .filter((row) => row.filter === filters[0])
      .map((row) => {
        row["edit"] = false;
        return row;
      });

    newData.dataRow1 = tableOneData;

    let tableTwoData = data.data
      .filter((row) => row.filter === filters[1])
      .map((row) => {
        row["edit"] = false;
        return row;
      });
    newData.dataRow2 = tableTwoData;
    let tableThreeData = data.data
      .filter((row) => row.filter === filters[2])
      .map((row) => {
        row["edit"] = false;
        return row;
      });
    newData.dataRow3 = tableThreeData;
    setData(newData);
  }

  const diagnosticsTableHeaders = [
    {
      title: "ICD 10 CODE",
      subTitle: "",
      key: "icd_10",
    },
    {
      title: "DESCRIPTION",
      subTitle: "",
      key: "description",
    },
    {
      title: "COMMENTS",
      subTitle: "",
      key: "comments",
    },
    {
      title: "DATE",
      subTitle: "",
      key: "date",
    },
    {
      title: "SIGNER",
      subTitle: "",
      key: "signer",
    },
  ];

  const procedurePrivateTableHeaders = [...diagnosticsTableHeaders].map(
    (el) => ({ ...el })
  );
  const procedureNhsTableHeaders = [...diagnosticsTableHeaders].map((el) => ({
    ...el,
  }));
  procedurePrivateTableHeaders[0].title = "CCSD";
  procedurePrivateTableHeaders[0].key = "code";
  procedureNhsTableHeaders[0].title = "OPCS-4";
  procedureNhsTableHeaders[0].key = "code";

  let defaultdiagnoDataKeys = [
    "icd_10",
    "description",
    "comments",
    "date",
    "signer",
  ];

  let defaultprocedureDataKeys = [...defaultdiagnoDataKeys];
  defaultprocedureDataKeys[0] = "code";
  let downloadReportsPdf = () => {
    let canvasDiv = document.getElementById("reportDowmload");

    let HTML_Width = canvasDiv.offsetWidth;
    let HTML_Height = canvasDiv.offsetHeight;
    if (HTML_Width * HTML_Height >= 268435456) {
      this.toasterService.warning("Content is too large");
    }
    // this.disableDowload = true;
    // let url = window.location.href;
    // let link = document.createElement("a");
    // link.href = url;
    // canvasDiv.appendChild(link)
    // link.style.display='none'
    // let title = document.querySelector(".title");
    // jsPDF: { unit: "pt", format: [700, 842], orientation: "p" },
    const pdfOptions = {
      margin: 30,
      filename: "report" + ".pdf",
      image: { type: "jpeg", quality: 0.98 },
      enableLinks: true,
      pagebreak: { mode: ["avoid-all"] },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "pt", format: [800, 842], orientation: "p" },
    };

    html2pdf()
      .from(canvasDiv)
      .set(pdfOptions)
      .outputPdf()
      .save()
      .then((res) => {
        // this.disableDowload = false;
        // this.toasterService.success("Hello page downloaded successfully");
        console.log(res);
      })
      .catch((error) => {
        // this.disableDowload = false;
        // this.toasterService.error("Failed to download");
        // console.log(error);
      });
  };

  const handlePrint = useReactToPrint({
    content: () => componentPrintRef.current,
  });

  return (
    <div>
      <Dialog
        aria-labelledby="customized-dialog-title"
        maxWidth="xl"
        open={open}
        disableScrollLock={true}
        className={styles.dialogContainer}
        sx={{ top: "0px", maxHeight: "100vh" }}
      >
        <DialogTitle
          sx={{ m: 0, p: 2 }}
          id="customized-dialog-title"
          color={"#3e5282"}
        >
          {isPrint ? (<>Print</>) : (<>Download</>)} Pdf
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
        <DialogContent
          className={styles.contentBody}
          sx={{ minWidth: "80vw", height: "95vh" }}
          dividers
        >
          {" "}
          <div
            id="reportDowmload"
            ref={componentPrintRef}
            style={{ margin: "15px" }}
          >
            <Box marginBottom={"16px"}>
              <PatientViewDetails></PatientViewDetails>
              <Typography variant="h6" gutterBottom color="#305ec9">
                Diagnostic
              </Typography>
              <TableView
                tableHeaders={diagnosticsTableHeaders}
                tableType={"diagnosis"}
                activeBtns={{
                  edit: false,
                  save: true,
                  cancel: false,
                  complete: false,
                }}
                defaultDataKeys={defaultdiagnoDataKeys}
                dataRow1={diagnosticsData.dataRow1}
                dataRow2={diagnosticsData.dataRow2}
                dataRow3={diagnosticsData.dataRow3}
              ></TableView>
            </Box>

            <Box marginBottom={"16px"}>
              <Typography variant="h6" gutterBottom color="#305ec9">
                Procedure (NHS)
              </Typography>
              <TableView
                tableHeaders={procedureNhsTableHeaders}
                tableType={"diagnostics"}
                activeBtns={{
                  edit: false,
                  save: true,
                  cancel: false,
                  complete: false,
                }}
                defaultDataKeys={defaultprocedureDataKeys}
                dataRow1={procedureNhsData.dataRow1}
                dataRow2={procedureNhsData.dataRow2}
                dataRow3={procedureNhsData.dataRow3}
              ></TableView>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom color="#305ec9">
                Procedure (Private)
              </Typography>
              <TableView
                tableHeaders={procedurePrivateTableHeaders}
                tableType={"diagnostics"}
                activeBtns={{
                  edit: false,
                  save: true,
                  cancel: false,
                  complete: false,
                }}
                defaultDataKeys={defaultprocedureDataKeys}
                dataRow1={procedurePrivateData.dataRow1}
                dataRow2={procedurePrivateData.dataRow2}
                dataRow3={procedurePrivateData.dataRow3}
              ></TableView>
            </Box>
          </div>
        </DialogContent>
        <DialogActions sx={{ padding: "15px 24px" }}>
          <Button
            variant="outlined"
            onClick={handleClose}
            className={styles.dialog_button_clr}
          >
            Cancel
          </Button>
          {!isPrint ? (
            <Button
              className={`${styles.submitBtn} ${styles.dialog_button_bg_clr}`}
              variant="contained"
              autoFocus
              onClick={downloadReportsPdf}
            >
              download
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handlePrint}
              className={styles.dialog_button_bg_clr}
            >
              Print
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PreviewPdf;
