import React, { memo } from "react";
import { Box } from "@mui/joy";
import TextComponent from "./TextComponent";


const ActionButton = ({
    onClick,
    label,
    icon,
    bgColor = "#ffffffd0",
    textColor = "#161717"
}) => {
    return (
        <Box
            onClick={onClick}
            sx={{
                cursor: "pointer",
                fontFamily: 'Bahnschrift',
                height: 30,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: 1,
                borderRadius: 3,
                bgcolor: bgColor,
                boxShadow:
                    '0 4px 8px rgba(0,0,0,0.07), 0 6px 20px rgba(0,0,0,0.08)',
                transition: 'box-shadow 0.2s ease, border 0.2s ease',
                gap: 1
            }}
        >
            {icon}
            <TextComponent
                value={label}
                size={10}
                weight={800}
                color={textColor}
            />
        </Box>
    );
};

export default memo(ActionButton);