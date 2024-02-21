import React, { useRef } from "react";
import { TextField, IconButton, InputAdornment, debounce } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import "./SearchBar.css";
import SearchResults from "../Search-results/SearchResults";

const SearchBar = ({
  onSearch,
  setSearchTerm,
  searchTerm = "",
  header,
  searchResultsRef,
}) => {
  const timerRef = useRef(null);

  const debouncedHandleChange = debounce((newSearchTerm) => {
    onSearch(newSearchTerm);
  }, 200);
  const handleChange = async (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    // if (timerRef.current) {
    //   clearTimeout(timerRef.current);
    // }

    // timerRef.current =await debouncedHandleChange(newSearchTerm); // Call the debounced function
  };

  return (
    <div className="searchContainer">
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        value={searchTerm}
        disableScrollLock={true}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => onSearch(searchTerm)}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        onKeyDown={(e) => {
          if (e.code === "Enter" && searchTerm) {
            onSearch(searchTerm);
          }
        }}
        onChange={handleChange}
      />
      <SearchResults
        className="searchResults"
        setSearchTerm={setSearchTerm}
        header={header}
        searchResultsRef={searchResultsRef}
      ></SearchResults>
    </div>
  );
};

export default SearchBar;
