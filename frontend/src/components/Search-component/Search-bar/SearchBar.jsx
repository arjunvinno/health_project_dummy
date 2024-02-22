import React, { useContext, useEffect, useRef, useState } from "react";
import { TextField, IconButton, InputAdornment,  FormControl } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import "./SearchBar.css";
import SearchResults from "../Search-results/SearchResults";
import { ActionContext } from "../../../context/ActionContext";

const SearchBar = ({
  onSearch,
  setSearchTerm,
  searchTerm = "",
  header,
  searchResultsRef,
}) => {
  const timerRef = useRef(null);
  const [searchResults, setSearchResults] = useState([]);
  const { datas } = useContext(ActionContext);

  const handleChange = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
  };

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      let searchData = [];
      console.log(searchTerm)
      if (searchTerm) {
        searchData = datas.codes.data.filter((el) =>
          el.description.toLowerCase().includes(searchTerm.toLocaleLowerCase())
        );
        if(searchData.length===0){
          searchData=[{description:"No Results",code:""}]
        }
      }
      console.log(searchData);
        setSearchResults(searchData);
    }, 500);
  }, [searchTerm]);
  return (
    <div className="searchContainer">
      <FormControl  variant="outlined"
        fullWidth>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        value={searchTerm}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
              //  onClick={() => onSearch(searchTerm)}
               >
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        // onKeyDown={(e) => {
        //   if (e.code === "Enter" && searchTerm) {
        //     onSearch(searchTerm);
        //   }
        // }}
        onChange={handleChange}
      />
      </FormControl>
     
      <SearchResults
        className="searchResults"
        setSearchTerm={setSearchTerm}
        header={header}
        searchResultsRef={searchResultsRef}
        searchResults={searchResults}
        setSearchResults={setSearchResults}
      ></SearchResults>
    </div>
  );
};

export default SearchBar;
