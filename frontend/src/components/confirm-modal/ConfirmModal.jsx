import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React from "react";
import WarningIcon from "@mui/icons-material/Warning";
import styles from "./ConfirmModal.module.css";
const ConfirmModal = ({ open, handleClose, onDiscard, message }) => {
  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        disableScrollLock={true} 
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          style={{ borderTop: "3px solid red" }}
          id="alert-dialog-title"
          sx={{ maxWidth: "400px!important" }}
        >
          <div className={styles.modalHeader}>
            <WarningIcon color="red" className={styles.alertIcon}></WarningIcon>
            <p>{message}</p>
          </div>
        </DialogTitle>
        <DialogContent></DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={() => {
              onDiscard();
              handleClose();
            }}
          >
            Discard
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ConfirmModal;
