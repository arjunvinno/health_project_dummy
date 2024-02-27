import { useContext, useEffect, useState } from "react";
import styles from "../diagnosis/Diagnosis.module.css";
import Customtable from "../table/Customtable";
import { ActionContext } from "../../context/ActionContext";
import { fetchData } from "../../context/ApiReducer";
import * as types from "../../context/actionType";
import AlertPopUp from "../Alert-popup/AlertPopUp";
import { useLocation, useParams } from "react-router-dom";
const Diagnosis = () => {
  const {
    apiDispatch,
    activeBtns,
    datas: { diagnosticsOnId,codes },
    handleBackDropOpen,
    handleBackDropClose,
    setDataRow1,
    setDataRow2,
    setDataRow3,
    handleAlertOpen,
    dataRow1,
    dataRow2,
    dataRow3,
  } = useContext(ActionContext);
  let [initialTableData, setinitialTableData] = useState({
    tableRow1: [],
    tableRow2: [],
    tableRow3: [],
  });
  const { patientId } = useParams();
  const [alertData, setAlertData] = useState({
    severity: "",
    message: "",
  });
  const location = useLocation();

  const tableRows = [
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
    // {
    //   title: "SNOMED CODE",
    //   subTitle: "",
    //   key: "snomed_code",
    // },

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
    {
      title: "ACTIONS",
      subTitle: "",
      key: "actions",
    },
  ];

  let defaultdiagnoDataKeys = [
    "icd_10",
    "description",
    "comments",
    // "snomed_code",
    "date",
    "signer",
    "actions",
  ];

  useEffect(() => {
    (async () => {
      await fetchData(
        apiDispatch,
        {
          loading: types.GetDiagnostics_OnPatientId_Loading,
          dataType: types.GetDiagnostics_OnPatientId,
          error: types.GetDiagnostics_OnPatientId_error,
        },
        "diagnostic",
        {
          userId: patientId,
        }
      );
    })();
    (async () => {
      await fetchData(
        apiDispatch,
        {
          loading: types.getCodes_Loading,
          dataType: types.getCodes,
          error: types.getCodes_error,
        },
        `${'store/icd10code'}`
      );
       })();
    return () => {
      apiDispatch({ type: types.ClearDiagnosticsAlert_Messages });
      setDataRow1([]);
      setDataRow2([]);
      setDataRow3([]);
      apiDispatch({ type: types.clearSearchData });
    };
  }, []);

  function filterOnTableData() {
    let tableOneData = diagnosticsOnId.data
      .filter((row) => row.filter === "diagnoses")
      .map((row) => {
        row["edit"] = false;
        return row;
      });
    setDataRow1(tableOneData);
    let tableTwoData = diagnosticsOnId.data
      .filter((row) => row.filter === "co_morbidities")
      .map((row) => {
        row["edit"] = false;
        return row;
      });
    setDataRow2(tableTwoData);
    let tableThreeData = diagnosticsOnId.data
      .filter((row) => row.filter === "con_diagnoses")
      .map((row) => {
        row["edit"] = false;
        return row;
      });
    setDataRow3(tableThreeData);
    setinitialTableData({
      tableRow1: [...tableOneData.map((el) => ({ ...el }))],
      tableRow2: [...tableTwoData.map((el) => ({ ...el }))],
      tableRow3: [...tableThreeData.map((el) => ({ ...el }))],
    });
  }
  useEffect(() => {
    if (diagnosticsOnId.loading || codes.loading) {
      handleBackDropOpen();
    } else {
      if (diagnosticsOnId.data.length > 0) {
        filterOnTableData();
      } else {
        setDataRow1([]);
        setDataRow2([]);
        setDataRow3([]);
      }
      if (diagnosticsOnId.success.message) {
        setAlertData({
          severity: "success",
          message: diagnosticsOnId.success.message,
        });
      }

      if (diagnosticsOnId.error.message) {
        setAlertData({
          severity: "error",
          message: diagnosticsOnId.error.message,
        });
      }
      setTimeout(() => {
        setAlertData({ severity: "", message: "" });
        apiDispatch({ type: types.ClearDiagnosticsAlert_Messages });
      }, 1500);
      handleBackDropClose();
    }
  }, [
    diagnosticsOnId.loading,
    diagnosticsOnId.data,
    diagnosticsOnId.error.message,
    diagnosticsOnId.success.message,
    location.pathname,
    codes.loading
  ]);

  useEffect(() => {
    if (alertData.message) {
      handleAlertOpen();
    }
  }, [alertData.message]);

  return (
    <div className={styles.diagno_container}>
      <AlertPopUp
        severity={alertData.severity}
        message={alertData.message}
      ></AlertPopUp>
      <Customtable
        tableHeaders={tableRows}
        tableType={"diagnosis"}
        activeBtns={activeBtns}
        defaultDataKeys={defaultdiagnoDataKeys}
        alertData={alertData}
        setAlertData={setAlertData}
        initialTableData={initialTableData}
        setDataRow1={setDataRow1}
        dataRow1={dataRow1}
        dataRow2={dataRow2}
        dataRow3={dataRow3}
        setDataRow2={setDataRow2}
        setDataRow3={setDataRow3}
      ></Customtable>
    </div>
  );
};

export default Diagnosis;
