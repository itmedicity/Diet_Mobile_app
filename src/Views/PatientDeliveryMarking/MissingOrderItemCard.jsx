import React, { memo } from "react";
import { Box } from "@mui/joy";
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
import { COLORS, FONT } from "../../Style/designTokens";

// Shown when the order has no items for this meal
const MissingOrderItemCard = ({
    title = "No items for this order",
    message = "The items for this meal are missing.",
    subMessage = "Call the canteen so the tray is not delayed."
}) => {

    return (
        <Box
            role="status"
            sx={{
                mt: 4, width: "100%", boxSizing: "border-box", p: 3, borderRadius: "16px", fontFamily: FONT,
                bgcolor: "#FBE9E7", border: "1.5px solid #EDB3AD", textAlign: "center",
            }}
        >
            <ReportProblemRoundedIcon aria-hidden="true" sx={{ fontSize: 40, color: COLORS.error }} />
            <Box sx={{ mt: 1, fontSize: 20, fontWeight: 700, color: COLORS.ink }}>{title}</Box>
            <Box sx={{ mt: 1, fontSize: 16, color: COLORS.ink, lineHeight: 1.45 }}>{message}</Box>
            <Box sx={{ mt: 0.5, fontSize: 15, color: COLORS.muted, lineHeight: 1.45 }}>{subMessage}</Box>
        </Box>
    );
};

export default memo(MissingOrderItemCard);
