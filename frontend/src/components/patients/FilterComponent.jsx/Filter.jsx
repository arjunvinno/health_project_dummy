import { Box, Button, Chip, TextField, Typography } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import React, { useEffect, useState } from "react";
import styles from "./Filter.module.css";
import ClearIcon from "@mui/icons-material/Clear";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";

const Filter = ({ applyFilter, setParams, page, rowsPerPage }) => {
  const today = dayjs();
  const filtersIntialValues = [
    {
      label: "FIRST NAME",
      active: false,
      key: "firstName",
      value: "",
    },
    {
      label: "MRN NO",
      active: false,
      key: "mrnNo",
      value: "",
    },
    {
      label: "NHS NO",
      active: false,
      key: "nhsNo",
      value: "",
    },
    {
      label: "DOB",
      active: false,
      key: "dob",
      value: "",
    },
    {
      label: "DATE RANGE",
      active: false,
      key: "dateRange",
      values: {
        startDate: "",
        endDate: "",
      },
    },
  ];

  const [filters, setFilters] = useState(filtersIntialValues);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const activeFilters = [...filters];
    filters.forEach((filter, index) => {
      if (
        params.get(filter.key) ||
        params.get("startDate") ||
        params.get("endDate")
      ) {
        if (filter.key === "dateRange") {
          activeFilters[index].active = true;
          activeFilters[index].values.startDate = params.get("startDate");
          activeFilters[index].values.endDate = params.get("endDate");
        } else {
          if (params.get(filter.key)) {
            activeFilters[index].value = params.get(filter.key);
            activeFilters[index].active = true;
          }
        }
      } else {
      }
    });
    setQueryParams(activeFilters);
    setFilters(activeFilters);
  }, []);

  useEffect(() => {
    checkButtonEnable();
  }, [filters]);

  const onFilterClick = (index) => {
    const newFilters = [...filters];
    newFilters[index].active = true;
    setQueryParams(newFilters);
    setFilters(newFilters);
  };

  const setQueryParams = (newFilters) => {
    const params = new URLSearchParams();
    newFilters.forEach((filter) => {
      if (filter.active) {
        if (filter.key === "dateRange") {
          params.set("startDate", filter.values.startDate);
          params.set("endDate", filter.values.endDate);
        } else {
          params.set(filter.key, filter.value);
        }
      }
    });
    const queryString = params.toString();
    queryString
      ? window.history.replaceState(
          null,
          "",
          `${window.location.pathname}?${queryString}`
        )
      : window.history.replaceState(null, "", `${window.location.pathname}`);
  };

  const validateDateRange = (startDate, endDate) => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return start < end;
    }
    return true;
  };

  const checkButtonEnable = () => {
    let filterValueCheck = filters.find(
      (filter) =>
        filter.active &&
        (filter.value === "" ||
          filter?.values?.startDate === "" ||
          filter?.values?.endDate === "")
    );
    let initialCheck = filters.find((filter) => filter.active === true);
    let dateRangeFilter = filters.find(
      (filter) => filter.active && filter.key === "dateRange"
    );
    const isDateRangeValid = dateRangeFilter
      ? validateDateRange(
          dateRangeFilter.values.startDate,
          dateRangeFilter.values.endDate
        )
      : true;
    if (filterValueCheck || !initialCheck) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  };

  let onFilterDelete = (index) => {
    const newFilters = [...filters];
    newFilters[index].active = false;
    if (newFilters[index].key === "dateRange") {
      newFilters[index].values.startDate = "";
      newFilters[index].values.endDate = "";
    } else {
      newFilters[index].value = "";
    }
    setQueryParams(newFilters);
    if (!newFilters.find((el) => el.active === true)) {
      applyFilter();
    }
    setFilters(newFilters);
  };

  const handleChange = (e, index, key) => {
    let formattedDate;
    if (key === "dob" || key === "startDate" || key === "endDate") {
      const date = new Date(e);
      let [day, month, year] = date.toLocaleString().split(",")[0].split("/");
      formattedDate = new Date(`${year}-${month}-${day}`).toISOString();
    }
    const newFilters = [...filters];
    if (key === "startDate") {
      newFilters[index].values.startDate = formattedDate;
    } else if (key === "endDate") {
      newFilters[index].values.endDate = formattedDate;
    } else {
      newFilters[index].value = key === "dob" ? formattedDate : e.target.value;
    }
    setQueryParams(newFilters);
    setFilters(newFilters);
  };

  const onClear = () => {
    const newFilters = [...filters];
    newFilters.forEach((filter) => {
      filter.active = false;
      if (filter.key === "dateRange") {
        filter.values.startDate = "";
        filter.values.endDate = "";
      } else {
        filter.value = "";
      }
    });
    setQueryParams(newFilters);
    setParams({ page: page, limit: rowsPerPage });
    setFilters(newFilters);
  };

  return (
    <div>
      <Box className={styles.container}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Box>
          {filters.map((filter, i) => {
            return (
              <Chip
                key={i}
                className={
                  filter.active ? styles.filterActive : styles.filterChip
                }
                label={filter.label}
                onClick={() => onFilterClick(i, filter.key)}
                deleteIcon={<DoneIcon />}
              />
            );
          })}
        </Box>
        <Box className={styles.filterFieldsContainer}>
          {filters.map((filter, i) => {
            return (
              filter.active && (
                <Box className={styles.field} key={i}>
                  <label>{filter.label}</label>
                  <div className={styles.filterBody}>
                    {filter.key === "dob" ? (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          fullWidth
                          defaultValue={filter.value?dayjs(filter.value):null}
                          onChange={(e) => handleChange(e, i, "dob")}
                          maxDate={today}
                          views={["year", "month", "day"]}
                          sx={{ width: "100%!important" }}
                        />{" "}
                      </LocalizationProvider>
                    ) : filter.key === "dateRange" ? (
                      <div className={styles.dateRangeBody}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            fullWidth
                            maxDate={
                              filter.values.endDate
                                ? dayjs(filter.values.endDate)
                                : ""
                            }
                            onChange={(e) => handleChange(e, i, "startDate")}
                            label="start date"
                            views={["year", "month", "day"]}
                            sx={{
                              width: "100%!important",
                              marginRight: "10px",
                            }}
                            defaultValue={filter.values.startDate ? dayjs(filter.values.startDate) : null}
                          />{" "}
                          <DatePicker
                            fullWidth
                            minDate={dayjs(filter.values.startDate)}
                            onChange={(e) => handleChange(e, i, "endDate")}
                            label="end date"
                            views={["year", "month", "day"]}
                            sx={{ width: "100%!important" }}
                            defaultValue={filter.values.endDate ? dayjs(filter.values.endDate) : null}
                          />{" "}
                        </LocalizationProvider>
                      </div>
                    ) : (
                      <TextField
                        onChange={(e) => handleChange(e, i)}
                        value={filter.value}
                        fullWidth
                        label={""}
                        id="outlined-size-normal"
                        sx={{ width: "35rem!important" }}
                        disableScrollLock={true}
                        type={
                          filter.key === "mrnNo" || filter.key === "nhsNo"
                            ? "number"
                            : "text"
                        }
                      />
                    )}

                    <ClearIcon
                      onClick={() => onFilterDelete(i, filter.key)}
                      className={styles.deleIcon}
                    ></ClearIcon>
                  </div>
                </Box>
              )
            );
          })}
        </Box>
        <Box className={styles.footerContainer}>
          <Button
            onClick={() => applyFilter()}
            sx={{ marginRight: "15px", backgroundColor: "#3e5282" }}
            variant="contained"
            disabled={disabled}
          >
            Apply
          </Button>
          <Button
            onClick={onClear}
            sx={{ marginRight: "15px", backgroundColor: "#3e5282" }}
            variant="contained"
            disabled={disabled}
          >
            Clear
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default Filter;
