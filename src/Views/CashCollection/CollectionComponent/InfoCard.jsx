import React, { useState } from "react";
import {
    Box,
    Typography,
    Divider,
    Collapse,
    IconButton,
} from "@mui/material";

import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";

const InfoCard = ({ title, icon, children, defaultExpanded = true }) => {
    const [expanded, setExpanded] = useState(defaultExpanded);
    const FONT = "Bahnschrift";
    return (
        <Box
            sx={{
                mt: 1.3,
                background: "#FFFFFF",
                border: "1px solid #E3E3DE",
                borderRadius: "15px",
                overflow: "hidden",
            }}
        >
            <Box
                onClick={() => setExpanded((prev) => !prev)}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: 1.5,
                    py: 1.2,
                    cursor: "pointer",
                    userSelect: "none",
                    transition: "background 0.2s ease",
                    "&:hover": {
                        backgroundColor: "#F9F9F6",
                    },
                }}
            >
                <Box
                    sx={{
                        width: 32,
                        height: 32,
                        flexShrink: 0,
                        borderRadius: "10px",
                        bgcolor: "#F1F1ED",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#555",
                    }}
                >
                    {icon}
                </Box>

                <Typography
                    sx={{
                        flex: 1,
                        fontFamily: FONT,
                        fontSize: "0.75rem",
                        fontWeight: 900,
                        color: "#222",
                    }}
                >
                    {title}
                </Typography>

                <IconButton
                    size="small"
                    aria-label={expanded ? "Collapse section" : "Expand section"}
                    onClick={(event) => {
                        event.stopPropagation();
                        setExpanded((prev) => !prev);
                    }}
                    sx={{
                        color: "#666",
                        transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.25s ease",
                    }}
                >
                    <ExpandMoreRoundedIcon />
                </IconButton>
            </Box>

            <Collapse in={expanded} timeout="auto">
                <Divider />
                <Box sx={{ p: 1.5 }}>{children}</Box>
            </Collapse>
        </Box>
    );
};

export default InfoCard;