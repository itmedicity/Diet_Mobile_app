import React from "react";
import { Box } from "@mui/joy";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const FloatingBackButton = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Hide button on login page ("/")
    if (location.pathname === "/" || location.pathname === "/dashboard") return null;

    return (
        <Box
            onClick={() => navigate(-1)}
            sx={{
                position: "fixed",
                bottom: 70,
                right: 20,
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #9943ef, #dea0ff)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
                zIndex: 9999,
                transition: "all 0.3s ease",
                "&:hover": {
                    transform: "scale(1.1)",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.35)",
                },
                "&:active": {
                    transform: "scale(0.95)",
                },
                border: '1px solid #dbd9dc'
            }}
        >
            <ArrowBackIcon
                sx={{
                    color: "#ffffff",
                    fontSize: 23,
                    // ml: "3px", // small adjustment to center arrow visually
                }}
            />
        </Box>
    );
};

export default FloatingBackButton;