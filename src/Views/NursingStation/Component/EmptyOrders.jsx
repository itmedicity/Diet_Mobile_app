import React from "react";
import { Box } from "@mui/joy";
import { COLORS, FONT } from "../../../Style/designTokens";

const EmptyOrders = ({ message = "No orders found", subMessage = "No orders available for the selected status" }) => {
    return (
        <Box sx={{ py: 5, px: 0.5, fontFamily: FONT }}>
            <Box sx={{ fontSize: 18, fontWeight: 700, color: COLORS.ink }}>{message}</Box>
            <Box sx={{ mt: 0.5, fontSize: 15, lineHeight: 1.5, color: COLORS.muted }}>{subMessage}</Box>
        </Box>
    );
};

export default EmptyOrders;
