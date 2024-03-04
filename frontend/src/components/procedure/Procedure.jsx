import React, { useContext, useEffect, useRef, useState } from "react";
import Customtable from "../table/Customtable";
import styles from "../procedure/Procedure.module.css";
import { useLocation, useParams } from "react-router-dom";
import { ActionContext } from "../../context/ActionContext";
import AlertPopUp from "../Alert-popup/AlertPopUp";
import { fetchData } from "../../context/ApiReducer";
import * as types from "../../context/actionType";
const Procedure = () => {
  let location = useLocation();
  let path = useRef("");
  let [privateCheck, setPrivate] = useState(location.pathname.includes('private')?true:false);
  let [initialTableData, setinitialTableData] = useState({
    tableRow1: [],
    tableRow2: [],
    tableRow3: [],
  });
  const { patientId } = useParams();
  const {
    apiDispatch,
    activeBtns,
    datas: { proceduresOnId,codes,patient },
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
  const [alertData, setAlertData] = useState({
    severity: "success",
    message: "",
  });

  const tableRows = [
    {
      title: "CCSD",
      subTitle: "",
      key: "code",
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
    {
      title: "ACTIONS",
      subTitle: "",
      key: "actions",
    },
  ];

  const [tableHeaders, setTableHeaders] = useState(tableRows);

  useEffect(() => {
    path.current = location.pathname;
    if (path.current.includes("private")) {
      setPrivate(true);
    } else {
      setPrivate(false);
    }

  
  }, [location.pathname]);

  useEffect(() => {
    let newTableHeaders = [...tableHeaders];
    if (privateCheck) {
      newTableHeaders[0].title = "CCSD";
    } else {
      newTableHeaders[0].title = "OPCS-4";
    }
    setTableHeaders(newTableHeaders);
    (async () => {
      await fetchData(
        apiDispatch,
        {
          loading: types.getCodes_Loading,
          dataType: types.getCodes,
          error: types.getCodes_error,
        },
        `${path.current.includes("private")?'store/ccsdcode':'store/opcscode'}`
      );
      await fetchData(
        apiDispatch,
        {
          loading: types.GetProcedures_OnPatientId_Loading,
          dataType: types.GetProcedures_OnPatientId,
          error: types.GetProcedures_OnPatientId_error,
        },
        "procedure",
        {
          userId: patientId,
          procedureType: path.current.includes("private") ? "private" : "nhs",
        }
      );
    })();

    return () => {
      apiDispatch({ type: types.ClearProceduresAlert_Messages });
      setDataRow1([]);
      setDataRow2([]);
      setDataRow3([]);
      apiDispatch({ type: types.clearSearchData });
    };
  }, [privateCheck]);

  let defaultprocedureDataKeys = [
    "code",
    "description",
    "comments",
    "date",
    "signer",
    "actions",
  ];

  function filterOnTableData() {
    let tableOneData = proceduresOnId.data
      .filter((row) => row.filter === "surgical_procedures")
      .map((row) => {
        row["edit"] = false;
        return row;
      });

    setDataRow1(tableOneData);
    let tableTwoData = proceduresOnId.data
      .filter((row) => row.filter === "ward_procedures")
      .map((row) => {
        row["edit"] = false;
        return row;
      });
    setDataRow2(tableTwoData);
    let tableThreeData = proceduresOnId.data
      .filter((row) => row.filter === "relevant_procedures")
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
    if (proceduresOnId.loading ||codes.loading || patient.loading) {
      handleBackDropOpen();
    } else {
      if (proceduresOnId.data.length > 0) {
        filterOnTableData();
      } else {
        setDataRow1([]);
        setDataRow2([]);
        setDataRow3([]);
      }
      if (proceduresOnId.success.message) {
        setAlertData({
          severity: "success",
          message: proceduresOnId.success.message,
        });
      }

      if (proceduresOnId.error.message) {
        setAlertData({
          severity: "error",
          message: proceduresOnId.error.message,
        });
      }
      setTimeout(() => {
        setAlertData({ severity: "", message: "" });
        apiDispatch({ type: types.ClearProceduresAlert_Messages });
      }, 1500);
      handleBackDropClose();
    }
  }, [
    proceduresOnId.loading,
    proceduresOnId.data,
    proceduresOnId.error.message,
    proceduresOnId.success.message,
    privateCheck,
    location.pathname,
    codes.loading,
    patient.loading
  ]);

  useEffect(() => {
    if (alertData.message && alertData.severity) {
      handleAlertOpen();
    }
  }, [alertData]);

  return (
    <div className={styles.procedure_container}>
      <AlertPopUp
        severity={alertData.severity}
        message={alertData.message}
      ></AlertPopUp>
      <Customtable
        tableHeaders={tableHeaders}
        tableType={"procedure"}
        activeBtns={activeBtns}
        privateCheck={privateCheck}
        defaultDataKeys={defaultprocedureDataKeys}
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

export default Procedure;
