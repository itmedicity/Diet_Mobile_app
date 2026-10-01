import React, { memo } from "react";
import { Box } from "@mui/joy";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

const BystanderItemSearch = ({
    value = "",
    onChange
}) => {

    return (
        <Box
            sx={{
                mb: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 1.5,
                py: 0.8,
                borderRadius: "14px",
                bgcolor: "#fff",
                border: "1px solid #e5e5e5",
                boxShadow: "0 3px 12px rgba(0,0,0,0.04)",

                "&:focus-within": {
                    borderColor: "#9d25b8",
                    boxShadow: "0 0 0 3px rgba(157,37,184,0.08)",
                },
            }}
        >
            <SearchRoundedIcon
                sx={{
                    fontSize: 20,
                    color: "#888",
                }}
            />

            <input
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                placeholder="Search food or item code..."
                style={{
                    flex: 1,
                    width: "100%",
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: "13px",
                    padding: "7px 0",
                }}
            />

            {value && (
                <Box
                    onClick={() => onChange?.("")}
                    sx={{
                        width: 22,
                        height: 22,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        bgcolor: "#f1f1f1",
                        color: "#777",
                        fontSize: 14,
                        fontWeight: 700,
                        cursor: "pointer",

                        "&:hover": {
                            bgcolor: "#e5e5e5",
                        },
                    }}
                >
                    ×
                </Box>
            )}
        </Box>
    );
};

export default memo(BystanderItemSearch);

