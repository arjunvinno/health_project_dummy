import React, { useContext, useEffect, useRef, useState } from "react";
import {
  AppBar,
  Box,
  ButtonGroup,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Slide,
  Toolbar,
  Typography,
} from "@mui/material";
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
import ConfirmModal from "../confirm-modal/ConfirmModal";
import ScrollToTop from "../ScrollToTop";
import * as html2pdf from "html2pdf.js";
import MenuIcon from "@mui/icons-material/Menu";
import PreviewPdf from "../previewPdf/PreviewPdf";

const Home = () => {
  const [open, setOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
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
    setDataRow1,
    setDataRow2,
    setDataRow3,
  } = useContext(ActionContext);
  const containerRef = useRef(null);
  // const [currentPage, setCurrentPage] = useState("");
  const [isPrint, setIsPrint] = useState(false);
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

  const handleClosePdfModal = () => {
    setPdfModalOpen(false);
  };

  const handleClickPdfModalOpen = () => {
    setPdfModalOpen(true);
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

  const drawerWidth = 300;
  const navItems = [
    { title: "PATIENT LOOK UP", link: "/patients" },
    { title: "MY SAVED CODES", link: "/mysavedcodes" },
    { title: "CODES BY SPECIALITY", link: "/codespeciality" },
    { title: "UNDERSTANDING CODING", link: "/understandingcoding" },
  ];

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography
        variant="h6"
        sx={{ my: 2, paddingLeft: "15px", textAlign: "left",color: 'rgb(108,129,192)',
        fontWeight: 600, fontSize: "1.5rem" }}
      >
        CODE FINDER
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.title} disablePadding className={styles.navItem}>
            <Link to={item.link}>
            <ListItemButton sx={{ textAlign: "left" ,textDecoration:"none"}}>
              <ListItemText sx={{fontSize:'14px!important'}} primary={item.title} />
            </ListItemButton></Link>
            
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window.document.body : undefined;
  return (
    <div style={{ position: "relative" }}>
      <ScrollToTop></ScrollToTop>
      <Container ref={containerRef} className={styles.container} maxWidth="xl">
       
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <AppBar
            component="nav"
            sx={{
              backgroundColor: "rgb(108,129,192)!important",
              padding: "5px",
            }}
            className={styles.navbarHeader}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: "none" } }}
              >
                <MenuIcon />
              </IconButton>

              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
                className={styles.header}
              >
                CODE FINDER
              </Typography>
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                {navItems.map((item,i) => (
                  <Link to={item.link} key={i}>
                    <Button key={item.title} sx={{ color: "#fff" }}>
                      {item.title}
                    </Button>
                  </Link>
                ))}
              </Box>
            </Toolbar>
          </AppBar>
          <nav>
            <Drawer
              container={container}
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true, 
              }}
              sx={{
                display: { xs: "block", sm: "none" },
                "& .MuiDrawer-paper": {
                  boxSizing: "border-box",
                  width: drawerWidth,
                },
              }}
            >
              {drawer}
            </Drawer>
          </nav>
        </Box>
        <ConfirmModal
          open={confirmModalOpen}
          handleClose={handleCloseConfirmModal}
          message={
            "Are you sure you don't want to save the changes made in this report?"
          }
          onDiscard={onDiscard}
        ></ConfirmModal>
        <PreviewPdf
          open={pdfModalOpen}
          handleClose={handleClosePdfModal}
          isPrint={isPrint}
        ></PreviewPdf>
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
            className={
              (activeBtns.edit &&
                (dataRow1.length > 0 ||
                  dataRow2.length > 0 ||
                  dataRow3.length > 0) &&
                !checkAllSaved()) ||
              !activeBtns.edit
                ? styles.ediBtn_color_active
                : styles.ediBtn_color_onDisable
            }
          >
            {activeBtns.edit ? "Complete" : "Edit"}
          </Button>
          {!activeBtns.edit && (
            <Box>
              <Button
                onClick={() => {
                  handleClickPdfModalOpen();
                  setIsPrint(false);
                }}
                variant={"contained"}
                className={`${styles.ediBtn_color_active} ${styles.pdfActions}`}
              >
                Save as pdf
              </Button>
              <Button
                onClick={() => {
                  handleClickPdfModalOpen();
                  setIsPrint(true);
                }}
                variant={"contained"}
                className={`${styles.ediBtn_color_active} ${styles.pdfActions}`}
              >
                Print
              </Button>
            </Box>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Home;
