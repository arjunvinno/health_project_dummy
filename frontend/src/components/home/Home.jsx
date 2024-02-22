import React, { useContext, useEffect, useRef, useState } from "react";
import { Box, ButtonGroup, Slide, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import styles from "../home/Home.module.css";
import { Container } from "@mui/material";
import SearchComponent from "../Search-component/SearchComponent";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { ActionContext } from "../../context/ActionContext";
import * as types from "../../context/actionType";
import PatientFields from "../Patient-fields/PatientFields";
import { fetchData } from "../../context/ApiReducer";
import ConfirmModal from "../confirm-modal/ConfirmModal";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import ScrollToTop from "../ScrollToTop";

const Home = () => {
  const [open, setOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const anchorRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { patientId } = useParams();
  const [searchHeader, setSearchHeader] = useState("");
  const [searchSubHead, setSearchSubHead] = useState("");
  const [searchCode, setSearchCode] = useState("");
  const [searchUrl, setSearchUrl] = useState("");
  const [navigationPath, setNavigationPath] = useState("");
  const {
    activeBtns,
    dispatch,
    dataRow1,
    dataRow2,
    dataRow3,
    apiDispatch,
    setDataRow1,
    setDataRow2,
    setDataRow3,
  } = useContext(ActionContext);
  const containerRef = useRef(null);
  const options = [
    { path: `/patients/${patientId}/procedure/NHS`, label: "Procedure (NHS)" },
    {
      path: `/patients/${patientId}/procedure/private`,
      label: "Procedure (Private)",
    },
  ];

  const handleCloseConfirmModal = () => {
    setConfirmModalOpen(false);
  };

  const handleClickConfirmModalOpen = () => {
    setConfirmModalOpen(true);
  };

  function onEdit() {
    dispatch({ type: types.editData });
    let segments = location.pathname.split("/");

    let viewIndex = segments.indexOf("view");

    if (viewIndex) {
      segments[viewIndex] = "edit";
      let newPathName = segments.join("/");
      navigate(newPathName);
    }
  }

  function onComplete() {
    dispatch({ type: types.completeData });
    let segments = location.pathname.split("/");

    let viewIndex = segments.indexOf("edit");

    if (viewIndex) {
      segments[viewIndex] = "view";
      let newPathName = segments.join("/");
      navigate(newPathName);
    }
  }

  useEffect(() => {
    const urlName = location.pathname.split("/");
    if (urlName.includes("edit")) {
      dispatch({ type: types.editData });
    } else if (urlName.includes("view")) {
      dispatch({ type: types.completeData });
    }
    if (
      location.pathname.includes("procedure/NHS/view") ||
      location.pathname.includes("procedure/NHS/edit")
    ) {
      setSelectedIndex(0);
    } else if (
      location.pathname.includes("procedure/private/view") ||
      location.pathname.includes("procedure/private/edit")
    ) {
      setSelectedIndex(1);
    }
    if (urlName[3] === "diagnosis") {
      setSearchHeader("Diagnostic coding");
      setSearchSubHead("Primary diagnosis");
      setSearchUrl("store/icd10code");
      setSearchCode("ICD-10");
    } else if (urlName[3] === "procedure") {
      setSearchHeader("Procedure coding");
      setSearchSubHead("Procedure");

      if (selectedIndex === 0) {
        setSearchUrl("store/opcscode");
        setSearchCode("OPCS-4");
      } else {
        setSearchCode("CCSD");
        setSearchUrl("store/ccsdcode");
      }
    }
  }, [location.pathname]);

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    if (checkAllSaved()) {
      if (index === 0) {
        setNavigationPath(`/patients/${patientId}/procedure/NHS`);
      } else {
        setNavigationPath(`/patients/${patientId}/procedure/private`);
      }
      handleClickConfirmModalOpen();
    } else {
      setOpen(false);
      if (index === 0) {
        navigate(`/patients/${patientId}/procedure/NHS`);
      } else {
        navigate(`/patients/${patientId}/procedure/private`);
      }
    }
  };

  let onClickDiagnosis = () => {
    if (checkAllSaved()) {
      handleClickConfirmModalOpen();
      setNavigationPath(`/patients/${patientId}/diagnosis`);
    } else {
      navigate(`/patients/${patientId}/diagnosis`);
    }
  };

  let onDiscard = () => {
    let tableOneData = dataRow1.map((row) => {
      if (row["edit"] === true) {
        return (row["edit"] = false);
      } else {
        return row;
      }
    });
    setDataRow1(tableOneData);
    let tableTwoData = dataRow2.map((row) => {
      if (row["edit"] === true) {
        return (row["edit"] = false);
      } else {
        return row;
      }
    });
    setDataRow2(tableTwoData);
    let tableThreeData = dataRow3.map((row) => {
      if (row["edit"] === true) {
        return (row["edit"] = false);
      } else {
        return row;
      }
    });
    setDataRow3(tableThreeData);
    navigate(navigationPath);
  };

  const handleSearchInput = async (result) => {
    // await fetchData(
    //   apiDispatch,
    //   {
    //     loading: types.getCodes_Loading,
    //     dataType: types.getCodes,
    //     error: types.getCodes_error,
    //   },
    //   `${searchUrl}?search=${result}`
    // );
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const checkAllSaved = () => {
    return (
      dataRow1.find((el) => el.edit === true) ||
      dataRow2.find((el) => el.edit === true) ||
      dataRow3.find((el) => el.edit === true)
    );
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  return (
    <div style={{ position: "relative" }}>
      <ScrollToTop></ScrollToTop>
      <Container ref={containerRef} className={styles.container} maxWidth="xl">
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            textAlign: "center",
            color: "#6c81c0",
            fontSize: "30px",
          }}
        >
          CODING
        </Typography>
        <ConfirmModal
          open={confirmModalOpen}
          handleClose={handleCloseConfirmModal}
          message={
            "Are you sure you don't want to save the changes made in this report?"
          }
          onDiscard={onDiscard}
        ></ConfirmModal>
        <Box>
          <Button></Button>
        </Box>
        <PatientFields></PatientFields>
        <ButtonGroup
          orientation="horizontal"
          size="medium"
          variant="outlined"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Button
            onClick={onClickDiagnosis}
            variant={
              location.pathname.includes("diagnosis") ? "contained" : "outlined"
            }
            className={
              location.pathname.includes("diagnosis")
                ? styles.diagnosisBtn_color_active
                : styles.diagnosisBtn
            }
            style={{ width: "15rem" }}
          >
            Diagnostic
          </Button>

          <React.Fragment>
            <ButtonGroup
              variant="outlined"
              ref={anchorRef}
              aria-label="split button"
            >
              <Button
                variant={
                  location.pathname.includes("procedure")
                    ? "contained"
                    : "outlined"
                }
                className={
                  location.pathname.includes("procedure")
                    ? styles.btn_color_active
                    : styles.btn_procedure
                }
                style={{ borderRadius: "0px", width: "13rem" }}
                onClick={handleToggle}
              >
                <span className={styles.slectionText}>
                  {options[selectedIndex].label}
                </span>
              </Button>
              <Button
                size="small"
                aria-controls={open ? "split-button-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-label="select merge strategy"
                aria-haspopup="menu"
                onClick={handleToggle}
                style={{ borderLeft: "0px!imoprtant" }}
                variant={
                  location.pathname.includes("procedure")
                    ? "contained"
                    : "outlined"
                }
                className={
                  location.pathname.includes("procedure")
                    ? styles.select_icon_active
                    : styles.select_icon
                }
              >
                <ArrowDropDownIcon />
              </Button>
            </ButtonGroup>
            <Popper
              sx={{
                zIndex: 5,
              }}
              open={open}
              anchorEl={anchorRef.current}
              role={undefined}
              transition
              disablePortal
              className={styles.popOver0}
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === "bottom" ? "right top" : "right bottom",
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList id="split-button-menu" autoFocusItem>
                        {options.map((option, index) => (
                          <MenuItem
                            key={option.label}
                            selected={index === selectedIndex}
                            onClick={(event) =>
                              handleMenuItemClick(event, index)
                            }
                          >
                            {option.label}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </React.Fragment>
        </ButtonGroup>
        {activeBtns.edit && checkAllSaved() && (
          <Slide
            direction="up"
            in={checkAllSaved() ? true : false}
            container={containerRef.current}
            mountOnEnter
            unmountOnExit
          >
            <div>
              <SearchComponent
                header={searchHeader}
                subHeader={searchSubHead}
                code={searchCode}
                onSearch={handleSearchInput}
              ></SearchComponent>
            </div>
          </Slide>
        )}

        <Outlet></Outlet>

        <div className={styles.actionBtns}>
          <Button
            onClick={activeBtns.edit ? onComplete : onEdit}
            disabled={
              (activeBtns.edit &&
                (dataRow1.length > 0 ||
                  dataRow2.length > 0 ||
                  dataRow3.length > 0) &&
                !checkAllSaved()) ||
              !activeBtns.edit
                ? false
                : true
            }
            variant={"contained"}
            className={  (activeBtns.edit &&
              (dataRow1.length > 0 ||
                dataRow2.length > 0 ||
                dataRow3.length > 0) &&
              !checkAllSaved()) ||
            !activeBtns.edit?styles.ediBtn_color_active:styles.ediBtn_color_onDisable}
          >
            {activeBtns.edit ? "Complete" : "Edit"}
          </Button>
        </div>
      </Container>
      <Box className={styles.footer}>
        <Link to="/understandingcoding">
          <Typography
            fontWeight={600}
            fontSize={"20px"}
            padding={"20px 0px"}
            variant="h4"
            textAlign={"left"}
          >
            <span>Understanding coding </span>
            <ArrowRightAltIcon></ArrowRightAltIcon>
          </Typography>
        </Link>
      </Box>
    </div>
  );
};

export default Home;
