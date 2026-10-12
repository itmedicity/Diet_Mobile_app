import React from "react";
import { Box } from "@mui/joy";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { COLORS, focusRing } from "../Style/designTokens";


const FloatingBackButton = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Hidden on the login page and the dashboard, and where the header already has its own back arrow
    const HIDE_ON = ["/", "/dashboard", "/Home", "/delivery", "/cash-collection", "/nsstaion", "/bedId", "/diet/payment", "/diet/payment/success"];
    if (HIDE_ON.includes(location.pathname) || location.pathname.startsWith("/cash-collection/")) return null;

    return (
        <Box
            component="button"
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            sx={{
                position: "fixed",
                bottom: "calc(100px + env(safe-area-inset-bottom))",
                right: 20,
                width: 52,
                height: 52,
                p: 0,
                border: 0,
                borderRadius: "50%",
                bgcolor: COLORS.plum,
                color: COLORS.white,
                display: "grid",
                placeItems: "center",
                cursor: "pointer",
                boxShadow: "0 6px 16px rgba(42,16,56,0.28)",
                zIndex: 1500, // below the dimmed background of the bottom sheet (1700)
                "&:active": { bgcolor: COLORS.plumDark },
                ...focusRing,
            }}
        >
            <ArrowBackIcon sx={{ fontSize: 24 }} />
        </Box>
    );
};

export default FloatingBackButton;
