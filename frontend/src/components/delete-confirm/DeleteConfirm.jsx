import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React from "react";
import WarningIcon from "@mui/icons-material/Warning";
import styles from "./DeleteConfirm.module.css";
const DeleteConfirm = ({ open, handleClose, deleteRow, deleteData }) => {
  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        disableScrollLock={true}
      >
        <DialogTitle
          style={{ borderTop: "3px solid red" }}
          id="alert-dialog-title"
        >
          <div className={styles.modalHeader}>
            <WarningIcon color="red" className={styles.alertIcon}></WarningIcon>
            <p>Are you sure you want to delete this report?</p>
          </div>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This will permanently delete all the information entered into this
            report.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={() => {
              deleteRow(
                deleteData.index,
                deleteData.data,
                deleteData.setFunction
              );
              handleClose();
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeleteConfirm;
