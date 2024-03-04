import axios from "axios";
import React, { useContext,} from "react";
import { Box, Paper, Typography } from "@mui/material";
import { ActionContext } from "../../../context/ActionContext";

const PatientViewDetails = ({ patientDetails }) => {

  const {

    datas: { patient },
  
  } = useContext(ActionContext);
  return (
    <Box>
      <Paper
        elevation={3}
        sx={{
          padding: 2,
          marginBottom: 2,
          width: "fit-content",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            marginBottom: 12,
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ display: "flex" }}>
            <Typography
              variant="body1"
              style={{ marginRight: 16, color: "#5e78b5" }}
            >
              {`FIRST NAME : `}
            </Typography>
            <Typography variant="body1" sx={{ color: "#555" }}>
              {patient.data.firstName}
            </Typography>
          </Box>
          <Box sx={{ display: "flex" }}>
            <Typography
              variant="body1"
              style={{ marginLeft: 16, marginRight: 16, color: "#5e78b5" }}
            >
              {`LAST NAME : `}
            </Typography>
            <Typography variant="body1" sx={{ color: "#555" }}>
              {patient.data.lastName}
            </Typography>
          </Box>
        </div>

        <div
          style={{
            display: "flex",
            marginBottom: 12,
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ display: "flex" }}>
            <Typography
              variant="body1"
              style={{ marginRight: 16, color: "#5e78b5" }}
            >
              {`GENDER : `}
            </Typography>
            <Typography
              variant="body1"
              style={{ marginRight: 24, color: "#555" }}
            >
              {patient.data.gender}
            </Typography>
          </Box>
          <Box sx={{ display: "flex" }}>
            <Typography
              variant="body1"
              style={{ marginRight: 10, color: "#5e78b5" }}
            >
              {`AGE : `}
            </Typography>
            <Typography
              variant="body1"
              style={{ marginRight: 20, color: "#555" }}
            >
              {patient.data.age}
            </Typography>
          </Box>
          <Box sx={{ display: "flex" }}>
            <Typography
              variant="body1"
              style={{ marginRight: 16, color: "#5e78b5" }}
            >
              {`DATE OF BIRTH : `}
            </Typography>
            <Typography variant="body1" sx={{ color: "#555" }}>
              {new Date(patient.data.dob).toLocaleDateString()}
            </Typography>
          </Box>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ display: "flex" }}>
            <Typography
              variant="body1"
              style={{ marginRight: 16, color: "#5e78b5" }}
            >
              {`MRN NO : `}
            </Typography>
            <Typography
              variant="body1"
              style={{ marginRight: 16, color: "#555" }}
            >
              {patient.data.mrnNo}
            </Typography>
          </Box>
          <Box sx={{ display: "flex" }}>
            <Typography
              variant="body1"
              style={{ marginRight: 16, color: "#5e78b5" }}
            >
              {`NHS NO : `}
            </Typography>
            <Typography variant="body1" sx={{ color: "#555" }}>
              {patient.data.nhsNo}
            </Typography>
          </Box>
        </div>
      </Paper>
    </Box>
  );
};

export default PatientViewDetails;
