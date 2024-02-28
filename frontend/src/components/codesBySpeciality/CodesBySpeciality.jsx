import React from "react";
import ScrollToTop from "../ScrollToTop";
import {
  Box,
  Container,
  Grid,
  Link,
  List,
  ListItem,
  ListItemText,
  Typography,
  useMediaQuery,
} from "@mui/material";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import styles from "./CodesBySpeciality.module.css";
import { useNavigate } from "react-router-dom";
import { SpecialtyLinks } from "./SpecialityLinks.contansts";

const CodesBySpeciality = () => {
  const navigate = useNavigate();

  let navToBack = () => {
    navigate(-1);
  };

  const specialityLinks = SpecialtyLinks;
  const sortedLinks = specialityLinks
    .slice()
    .sort((a, b) => String(a.text).localeCompare(String(b.text)));
  const isTablet = useMediaQuery("(max-width: 800px)");
  const columns = isTablet ? 2 : 3;
  const linksPerColumn = Math.ceil(sortedLinks.length / columns);

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
            CODES BY SPECIALITY
          </Typography>
        </Box>
        <Box>
          <Grid container spacing={2}>
            {[...Array(columns)].map((_, columnIndex) => (
              <Grid item xs={12} sm={isTablet ? 6 : 4} key={columnIndex}>
                <List disablePadding className={`linkList ${styles.listItem}`}>
                  {sortedLinks
                    .slice(
                      columnIndex * linksPerColumn,
                      (columnIndex + 1) * linksPerColumn
                    )
                    .map((link, index) => (
                      <ListItem key={index}>
                        <Link
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.link}
                        >
                          <ListItemText
                            primary={
                              <span
                                style={{
                                  fontSize: "1.2rem",
                                  fontWeight: "500",
                                  color: "#529be3",
                                }}
                                dangerouslySetInnerHTML={{
                                  __html: `&bull; ${link.name}`,
                                }}
                              />
                            }
                          />
                        </Link>
                      </ListItem>
                    ))}
                </List>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </div>
  );
};

export default CodesBySpeciality;
