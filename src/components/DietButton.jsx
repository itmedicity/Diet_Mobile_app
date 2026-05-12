import { Box } from "@mui/joy";
import React, { memo } from "react";

const DietButton = ({
  name = "Save",
  onClick,
  disabled = false,
  icon: Icon,
  width,
  height = 30
}) => {
  const isIconOnly = name === "";

  return (
    <Box
      role="button"
      tabIndex={disabled ? -1 : 0}
      onClick={!disabled ? onClick : undefined}
      onKeyDown={(e) => {
        if (!disabled && (e.key === "Enter" || e.key === " ")) {
          onClick?.();
        }
      }}
      sx={{
        width: width ? width : isIconOnly ? height : 100,
        height: height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        fontWeight: 800,
        bgcolor: "#ffffffd0",
        borderRadius:  '50%',
        userSelect: "none",
        border: "1px solid #57565727",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        px:  1,
        boxShadow:
          "0 4px 8px rgba(0,0,0,0.07), 0 6px 20px rgba(0,0,0,0.08)",
        transition: "all 0.2s ease",

        "&:hover": {
          border: disabled ? "none" : "1px solid #9822c365",
          transform: disabled ? "none" : "translateY(-1px)",
        },

        "&:active": {
          transform: "scale(0.97)",
        },
        gap:0.5
      }}
    >
      {Icon && <Icon style={{ fontSize: 16 }} />}
      {!isIconOnly && name}
    </Box>
  );
};

export default memo(DietButton);