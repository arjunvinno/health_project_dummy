import React, { useContext, useEffect, useState } from "react";
import * as types from "../../../context/actionType";
import styles from "./SearchResults.module.css";
import { ActionContext } from "../../../context/ActionContext";
import { Tooltip } from "@mui/material";
const SearchResults = ({ setSearchTerm,searchResults, setSearchResults ,searchResultsRef }) => {
  const {
    datas,
    dataRow1,
    setDataRow1,
    apiDispatch,
    dataRow2,
    setDataRow2,
    dataRow3,
    setDataRow3,
  } = useContext(ActionContext);
  // const [searchResults, setSearchResults] = useState([]);

  // useEffect(() => {
  //   setSearchResults(datas.codes.data);
  // }, [datas.codes.data]);

  function onselect(selectedData) {
    setSearchResults([]);
    setSearchTerm("");
    let updatedDataRows = [dataRow1, dataRow2, dataRow3].map((dataRow) => {
      return dataRow.map((row) => {
        if (row.edit) {
          let updatedRow = { ...row };
          if (updatedRow.icd_10 !== undefined) {
            updatedRow.icd_10 = selectedData.code;
          } else if (updatedRow.code !== undefined) {
            updatedRow.code = selectedData.code;
          }
          updatedRow.description = selectedData.description;
          updatedRow.date = new Date();
          return updatedRow;
        }
        return row;
      });
    });

    setDataRow1(updatedDataRows[0]);
    setDataRow2(updatedDataRows[1]);
    setDataRow3(updatedDataRows[2]);

    // apiDispatch({ type: types.clearSearchData });
  }
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target)
      ) {
        setSearchResults([]);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      setSearchResults([])
      document.removeEventListener("mousedown", handleClickOutside);
      // apiDispatch({ type: types.clearSearchData });
    };
  }, []);

  return (
    <div
      style={{ display: searchResults.length > 0 ? "block" : "none" }}
      className={styles.searchResults}
    >
      {searchResults.length > 0 &&
        searchResults.map((result, index) => (
          <Tooltip
            title={result.description}
            placement="top"
            arrow
            disableInteractive
            PopperProps={{ disablePortal: true }}
            key={index}
            sx={{ fontSize: "40px!important" }}
          >
            <p
              style={{ background: "white" }}
              key={index}
              onClick={() =>
                result.description !== "No Results" &&
                result.description !== "...loading" &&
                onselect(result)
              }
            >
              {result.description}
            </p>
          </Tooltip>
        ))}
    </div>
  );
};

export default SearchResults;
