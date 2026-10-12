import React, { memo } from "react";
import { Box } from "@mui/joy";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { COLORS, FONT, focusRing } from "../../../Style/designTokens";

// Amount to pay (tap to go to payment), or the total already paid
const PaymentSummaryCard = ({
    expand = true,
    amount = 0,
    deliveredAmount,
    onClick,
    isPaymentPendingExist,
    totalPayedAmount
}) => {

    if (!expand) return null;

    const due = !!isPaymentPendingExist;

    return (
        <Box
            component={due ? "button" : "div"}
            type={due ? "button" : undefined}
            onClick={due ? onClick : undefined}
            sx={{
                width: "calc(100% - 32px)", mx: 2, my: 1.5, boxSizing: "border-box", minHeight: 60, px: 2, py: 1,
                border: 0, borderRadius: "14px", fontFamily: FONT, textAlign: "left", color: COLORS.white,
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1,
                bgcolor: due ? COLORS.plum : COLORS.success, cursor: due ? "pointer" : "default",
                "&:active": due ? { bgcolor: COLORS.plumDark } : {},
                ...focusRing,
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {!due && <CheckCircleRoundedIcon aria-hidden="true" />}
                <Box>
                    <Box sx={{ fontSize: 17, fontWeight: 700 }}>{due ? "Pay amount due" : "All paid"}</Box>
                    <Box sx={{ fontSize: 14, opacity: 0.9 }}>{`Delivered ₹${Number(deliveredAmount || 0).toFixed(2)}`}</Box>
                </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, fontSize: 22, fontWeight: 700 }}>
                {due ? `₹${Number(amount || 0).toFixed(2)}` : `₹${Number(totalPayedAmount || 0).toFixed(2)}`}
                {due && <ArrowForwardRoundedIcon aria-hidden="true" />}
            </Box>
        </Box>
    );
};

export default memo(PaymentSummaryCard);
