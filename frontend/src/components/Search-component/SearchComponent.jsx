import React, { useRef, useState } from "react";
import "./SearchComponent.css";
import SearchBar from "./Search-bar/SearchBar";

const SearchComponent = ({ header, subHeader, code, onSearch}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const searchResultsRef = useRef(null);
  return (
    <div className="search-cont">
      <h3 className="search-head">
        {header} <span>{code}</span>
      </h3>
      <div className="search-inner">
        <h4 className="search-subhead">
          {/* <span>{subHeader}</span> */}
          <span>Enter Keyword :</span>
        </h4>
        <div ref={searchResultsRef} className="search_bar">
          <SearchBar
            onSearch={onSearch}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            header={header}
            searchResultsRef={searchResultsRef}
          ></SearchBar>
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;
