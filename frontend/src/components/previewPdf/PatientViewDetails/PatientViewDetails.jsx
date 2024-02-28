import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Card, Paper, Typography } from "@mui/material";
import { hostUrl } from "../../../context/ApiReducer";

const PatientViewDetails = ({ patient }) => {
  const { patientId } = useParams();
  const [patientDetails, setPatientDetails] = useState([]);

  const handleGetAllPatientDetails = async () => {
    try {
      const response = await axios.get(`${hostUrl}/patients/${patientId}`);
      const result = await response.data.data;
      setPatientDetails(result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetAllPatientDetails();
  }, [patientId]);

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
            marginBottom: 8,
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ display: "flex" }}>
            <Typography
              variant="body1"
              style={{ marginRight: 16, color: "#5e78b5" }}
            >
              {`First Name: `}
            </Typography>
            <Typography variant="body1" sx={{ color: "#555" }}>
              {patientDetails.firstName}
            </Typography>
          </Box>
          <Box sx={{ display: "flex" }}>
            <Typography
              variant="body1"
              style={{ marginLeft: 16, marginRight: 16, color: "#5e78b5" }}
            >
              {`Last Name: `}
            </Typography>
            <Typography variant="body1" sx={{ color: "#555" }}>
              {patientDetails.lastName}
            </Typography>
          </Box>
        </div>

        <div
          style={{
            display: "flex",
            marginBottom: 8,
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ display: "flex" }}>
            <Typography
              variant="body1"
              style={{ marginRight: 16, color: "#5e78b5" }}
            >
              {`Gender: `}
            </Typography>
            <Typography
              variant="body1"
              style={{ marginRight: 24, color: "#555" }}
            >
              {patientDetails.gender}
            </Typography>
          </Box>
          <Box sx={{ display: "flex" }}>
            <Typography
              variant="body1"
              style={{ marginRight: 10, color: "#5e78b5" }}
            >
              {`Age: `}
            </Typography>
            <Typography
              variant="body1"
              style={{ marginRight: 20, color: "#555" }}
            >
              {patientDetails.age}
            </Typography>
          </Box>
          <Box sx={{ display: "flex" }}>
            <Typography
              variant="body1"
              style={{ marginRight: 16, color: "#5e78b5" }}
            >
              {`Date of Birth: `}
            </Typography>
            <Typography variant="body1" sx={{ color: "#555" }}>
              {new Date(patientDetails.dob).toLocaleDateString()}
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
              {`MRN No: `}
            </Typography>
            <Typography
              variant="body1"
              style={{ marginRight: 16, color: "#555" }}
            >
              {patientDetails.mrnNo}
            </Typography>
          </Box>
          <Box sx={{ display: "flex" }}>
            <Typography
              variant="body1"
              style={{ marginRight: 16, color: "#5e78b5" }}
            >
              {`NHS No: `}
            </Typography>
            <Typography variant="body1" sx={{ color: "#555" }}>
              {patientDetails.nhsNo}
            </Typography>
          </Box>
        </div>
      </Paper>
    </Box>
  );
};

export default PatientViewDetails;