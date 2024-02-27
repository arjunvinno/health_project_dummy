import { Box, Container, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import ScrollToTop from "../ScrollToTop";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import styles from "./MySavedCodes.module.css";
import { useNavigate } from "react-router-dom";
import Customtable from "../table/Customtable";
import { ActionContext } from "../../context/ActionContext";
import { fetchData } from "../../context/ApiReducer";
import * as types from "../../context/actionType"
const MySavedCodes = () => {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const {
    setDataRow1,
    apiDispatch,
    datas: { allPatients,mySavedCodes },
    handleBackDropOpen,
    handleBackDropClose,
    // handleAlertOpen,
  } = useContext(ActionContext);
  const [alertData, setAlertData] = useState({
    severity: "",
    message: "",
  });
  const tableHeaders = [
    {
      title: "CODE",
      subTitle: "",
      key: "code",
    },
    {
      title: "DESCRIPTION",
      subTitle: "",
      key: "description",
    },
    {
      title: "TYPE",
      subTitle: "",
      key: "type",
    },
    {
      title: "FREQUENCY",
      subTitle: "",
      key: "frequency",
    },
  ];
  const defaultDataKeys = ["code", "description", "type", "frequency"];
  let navToBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    (async () => {
      await fetchData(
        apiDispatch,
        {
          loading: types.getSavedCodes_loading,
          dataType: types.getSavedCodes,
          error: types.getSavedCodes_error,
        },
        "mysavedcodes",
        "",
        {page:page,limit:rowsPerPage}
      );
    })();
    return () => {
      // apiDispatch({ type: types.ClearPatientsAlert_Messages });
    };
  }, [page,rowsPerPage]);
  useEffect(() => {
    if (mySavedCodes.loading ) {
      handleBackDropOpen();
    } else {
    if(mySavedCodes.data.length>0){
        setDataRow1(mySavedCodes.data);
      } else {
        setDataRow1([]);
      }
     if (mySavedCodes.success.message) {
        setAlertData({
          severity: "success",
          message: mySavedCodes.success.message,
        });
      }

     if (mySavedCodes.error.message) {
        setAlertData({
          severity: "error",
          message: mySavedCodes.error.message,
        });
      }
      setTimeout(() => {
        setAlertData({ severity: "", message: "" });
        // apiDispatch({ type: types.ClearPatientsAlert_Messages });
      }, 1500);
      handleBackDropClose();
    }
  }, [
    mySavedCodes.loading,
    mySavedCodes.data,
    mySavedCodes.error.message,
    mySavedCodes.success.message,
  ]);
  return (
    <div>
      <ScrollToTop></ScrollToTop>
      <Container className={styles.container} maxWidth="xl">
        <Box className={styles.header}>
          <ArrowRightAltIcon
            onClick={navToBack}
            className={styles.backIcon}
          ></ArrowRightAltIcon>
          <Typography
            fontWeight={600}
            fontSize={"28px"}
            padding={"20px 0px"}
            variant="h4"
            textAlign={"center"}
          >
            MY SAVED CODES
          </Typography>
        </Box>

        <Customtable
          tableHeaders={tableHeaders}
          tableType={"mysavedcodes"}
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

export default MySavedCodes;
