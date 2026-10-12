import React, { memo } from "react";
import { Box } from "@mui/joy";

// Dimmed background behind the bottom sheet; tapping it closes the sheet
const ActiveTabOverlay = ({ activeTab, onClose }) => {
    if (!activeTab) return null;

    return (
        <Box
            aria-hidden="true"
            onClick={onClose}
            sx={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(42,16,56,0.45)",
                zIndex: 1700,
            }}
        />
    );
};

export default memo(ActiveTabOverlay);
