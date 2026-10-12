import React, { memo } from "react";
import { Box } from "@mui/joy";
import AddIcon from '@mui/icons-material/Add';
import { COLORS, focusRing } from "../Style/designTokens";


const FloatingOrderTaking = ({ onOpen }) => {
    return (
        <Box
            component="button"
            type="button"
            onClick={onOpen}
            aria-label="Open order panel"
            sx={{
                position: "fixed",
                bottom: "calc(160px + env(safe-area-inset-bottom))",
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
            <AddIcon sx={{ fontSize: 26 }} />
        </Box>
    );
};

export default memo(FloatingOrderTaking);
