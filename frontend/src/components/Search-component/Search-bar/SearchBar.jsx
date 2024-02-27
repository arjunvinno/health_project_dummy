import React, { useContext, useEffect, useRef, useState } from "react";
import {
  TextField,
  IconButton,
  InputAdornment,
  FormControl,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import "./SearchBar.css";
import SearchResults from "../Search-results/SearchResults";
import { ActionContext } from "../../../context/ActionContext";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useTheme } from "@emotion/react";
import { hostUrl } from "../../../context/ApiReducer";

const SearchBar = ({
  onSearch,
  setSearchTerm,
  searchTerm = "",
  header,
  searchResultsRef,
}) => {
  const timerRef = useRef(null);
  const [searchResults, setSearchResults] = useState([]);
  const { datas, handleBackDropOpen,handleBackDropClose} = useContext(ActionContext);
  const [ccsdCodes,setccsdCodes]=useState([])
  const [searchOnccsd,setsearchOnCcsd]=useState("")
  const location = useLocation();

  const handleChange = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
  };


  useEffect(()=>{
    const urlName = location.pathname.split("/");
    console.log(urlName[4])
    if(urlName[4]==="NHS"){
     (async()=>{
      handleBackDropOpen()
        const response= await axios.get(hostUrl+'/store/ccsdcode')
        setccsdCodes(response.data.data);
        handleBackDropClose()
      })()
      setsearchOnCcsd('nhs')

    }
  
  },[])
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      let searchData = [];
      console.log(searchTerm);
      if (searchTerm.trim() !== "") {
        console.log(searchOnccsd)
        if(searchOnccsd==="nhs"){
         ccsdCodes.filter((el)=>el.description.toLowerCase().includes(searchTerm.toLowerCase())).forEach((el)=>{
          
          let modifiedString = el.code.slice(0, -1); // Remove the last character
          modifiedString = modifiedString.slice(0, -1) + "." + modifiedString.slice(-1);
          // datas.codes.data.forEach((el)=>{
          // if(el.code===modifiedString){
          //   searchData.push(el)
          // }
          // })
          let data=datas.codes.data.find((el)=>el.code===modifiedString)
          if(data){
            searchData.push(data)
          }
         })



        }else{
          searchData = datas.codes.data.filter((el) =>
          el.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        }
       
        if (searchData.length === 0) {
          searchData = [{ description: "No Results", code: "" }];
        }
      }
      console.log(searchData);
      setSearchResults(searchData);
    }, 1000);
  }, [searchTerm,searchOnccsd]);
  return (
    <div className="searchContainer">
      <FormControl variant="outlined" fullWidth value={searchTerm}>
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
