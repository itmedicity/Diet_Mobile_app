import React, { memo } from "react";
import { Box } from "@mui/joy";

const ActiveTabOverlay = ({ activeTab, onClose }) => {
    if (!activeTab) return null;

    return (
        <Box
            onClick={onClose}
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0, // stop above bottom navigation
                backdropFilter: "blur(4px)",
                backgroundColor: "rgba(0,0,0,0.15)",
                zIndex: 1000,
                transition: "all 0.2s ease",
            }}
        />
    );
};

export default memo(ActiveTabOverlay);