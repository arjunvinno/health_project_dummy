import { Box, Container, Typography } from "@mui/material";
import React from "react";
import styles from "./Footer.module.css";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { useNavigate } from "react-router-dom";
import ScrollToTop from "../ScrollToTop";

const Footer = () => {
  const navigate = useNavigate();
  let footerData = [
    "Appendix 1 - List of mandatory comorbidities Condition",
    "Cerebrovascular diseases",
    "Hemiplegia",
    " Alzheimer’s disease including dementia in Alzheimer’s disease",
    " Dementia including dementia in Alzheimer’s disease ",
    "Epilepsy",
    "Multiple Sclerosis",
    "Developmental delay including learning difficulties and learning disability",
    "Autism",
    "Dysphasia",
    "Anxiety disorders including anxiety",
    "Depressive disorders including depression and bipolar disorder",
    "Psychosis and psychotic disorders including schizophrenia, schizotypal and delusional disorders Personal history of self-harm",
    "",
    "Hypertension",
    "Ischaemic heart disease",
    "Heart Failure",
    "Left Ventricular Failure",
    "Mitral Valve disease",
    "Congestive cardiac failure",
    "Current anti-coagulant therapy Personal history of anti-coagulant therapy",
    "Presence of cardiac pacemaker",
    "",
    "Chronic obstructive pulmonary disease /Chronic obstructive airways disease",
    "Chronic bronchitis",
    "Asthma",
    "Emphysema",
    "Respiratory failure",
    "",
    "Diabetes Mellitus",
    "Rheumatoid arthritis",
    "Eating disorders",
    "Dysphagia (difficulty in swallowing)",
    "Abnormal liver function test (in the absence of any underlying cause)",
    "Renal failure",
    "Chronic kidney diseases including chronic tubulo-interstitial nephritis, small kidney(s) and polycystic",
    "kidney(s)",
    "Urinary retention",
    "",
    "Living Alone",
    "Elderly / Geriatric falls",
    "",
    "Current smoker",
    "Alcohol abuse",
    "Drug abuse",
    "",
    "Registered Blind",
    "Severe or profound hearing loss",
    "",
    " Personal hx of stroke",
    "Person hx of other physical trauma",
    "Presence of PEG",
    " Personal hx of non-compliance",
    "Personal hx of TIA",
    "Unemployment",
    "Homelessness",
    "Dependence on wheelchair",
    "Personal Hx of Neoplasm",
  ];

  let navToBack = () => {
    navigate(-1);
  };
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
            UNDERSTANDING CODING
          </Typography>
        </Box>
        <Box className={styles.footerBody}>
          <Typography
            color={"#000000b3"}
            fontSize="14px"
            variant="p"
            textAlign={"justify"}
          >
            Avoid the use of new or ambiguous abbreviations (e.g. “m.s.” could
            mean multiple sclerosis or mitral stenosis. (If a clear diagnosis
            has not been reached, make sure you detail main symptoms in the
            notes or discharge summary. Any “query” diagnoses, or diagnoses
            preceded by a “?” cannot be coded by clinical coding staff. If
            histology is awaited for a definitive diagnosis, note this down. Get
            a senior member of medical staff to confirm or validate these
            diagnoses and procedures. Best practice is to summarise all of these
            as the last (discharge) entry in the notes. Remember: clinical
            coding staff are not allowed to make any clinical inferences.)
          </Typography>

          <Box className={styles.information}>
            {footerData.map((element, i) => {
              return (
                <Typography
                  key={i}
                  fontSize="14px"
                  color={"#000000b3"}
                  className={!element ? styles.spacePara : ""}
                  variant="p"
                  textAlign={"left"}
                >
                  {element}
                </Typography>
              );
            })}
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default Footer;
