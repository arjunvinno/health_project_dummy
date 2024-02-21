import React, { useEffect } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import "./CustomFields.css";

const CustomField = ({
  label,
  type,
  value = "",
  onChange,
  select,
  options,
  placeholder,
  textColor,
  labelColor,
  fontSize,
  fontWeight,
  disabled,
  name,
  error,
  helperText,
  focused,
}) => {
  const inputStyle = {
    color: textColor || "#444",
    fontSize: fontSize,
    fontWeight: fontWeight,
    border: "none !important",
  };

  const labelStyle = {
    color: labelColor || "#666",
  };

  useEffect(() => {}, [value]);
  return (
    <div className={`custom-cont ${name === "age" ? "age-cont" : ""}`}>
      <div className="label-cont">
        <label className="label" style={labelStyle}>
          {label} <span>:</span>
        </label>
      </div>
      <div className="input-cont">
        {select ? (
          <TextField
            select
            label=""
            className="patient-field"
            value={value}
            onChange={onChange}
            defaultValue={"male"}
            InputProps={{ style: inputStyle }}
            fullWidth
            disabled={disabled}
            disableScrollLock={true}
            name={name}
            SelectProps={{
              displayEmpty: true,
              renderValue: (selected) => (selected ? selected : placeholder),
            }}
            error={error}
            helperText={helperText}
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        ) : (
          <TextField
            disableScrollLock={true}
            label=""
            className="patient-field"
            type={type}
            focused={focused}
            value={value}
            onChange={(e) => onChange(e)}
            InputProps={{ style: inputStyle }}
            disabled={disabled}
            fullWidth
            name={name}
            error={error}
            helperText={helperText}
          />
        )}
      </div>
    </div>
  );
};

export default CustomField;
