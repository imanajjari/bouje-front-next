"use client";

import React from "react";
import TextField from "@mui/material/TextField";

interface FormInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  disabled?: boolean;
  required?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
  required = false,
}) => {
  return (
<TextField
  label={
    required ? (
      <span>
        {label} <span style={{ color: "red" }}>*</span>
      </span>
    ) : (
      label
    )
  }
  variant="outlined"
  fullWidth
  value={value}
  onChange={onChange}
  disabled={disabled}
  type={type}
  sx={{
    // 👇 margin
    margin: "8px 0",

    // 👇 style برای کل input box
    "& .MuiOutlinedInput-root": {
      borderRadius: "4px",

      // 👇 رنگ border حالت عادی
      "& fieldset": {
        borderRadius: "0",
        borderColor: "#999",
      },

      // 👇 رنگ border هنگام hover
      "&:hover fieldset": {
        borderColor: "#555",
      },

      // 👇 رنگ border هنگام فوکوس
      "&.Mui-focused fieldset": {
        borderColor: "black",
      },

      // 👇 متن input راست چین
      "& input": {
        textAlign: "right",
      },
    },

    // 👇 رنگ label
    "& .MuiInputLabel-root": {
      color: "#555",
    },

    // 👇 رنگ label هنگام فوکوس
    "& .MuiInputLabel-root.Mui-focused": {
      color: "black",
    },
  }}
/>

  );
};

export default FormInput;
