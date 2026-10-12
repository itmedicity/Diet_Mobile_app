import React, { memo } from "react";
import { Box } from "@mui/joy";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import { COLORS, FONT, focusRing } from "../../../Style/designTokens";

// Bar at the bottom while orders are ticked: how many, and the pick-up button
const DeliveryBulkAction = ({
    selectedCount = 0,
    buttonText = "Pick up",
    onAction,
    loading = false,
}) => {

    if (!selectedCount) return null;

    return (
        <Box
            sx={{
                position: "fixed", left: 0, right: 0, bottom: "calc(64px + env(safe-area-inset-bottom))", zIndex: 1600,
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2,
                px: 2.5, py: 1.25,
                bgcolor: COLORS.white, borderTop: `1px solid ${COLORS.line}`,
                boxShadow: "0 -6px 20px rgba(42,16,56,0.12)", fontFamily: FONT,
            }}
        >
            <Box aria-live="polite">
                <Box sx={{ fontSize: 18, fontWeight: 700, color: COLORS.ink, lineHeight: 1.1 }}>
                    {`${selectedCount} ${selectedCount > 1 ? "orders" : "order"} selected`}
                </Box>
                <Box sx={{ fontSize: 14, color: COLORS.muted }}>Ready to pick up</Box>
            </Box>

            <Box
                component="button"
                type="button"
                onClick={onAction}
                disabled={loading}
                sx={{
                    flexShrink: 0, height: 52, px: 2.5, border: 0, borderRadius: "14px", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 1,
                    bgcolor: COLORS.plum, color: COLORS.white, fontFamily: FONT, fontSize: 17, fontWeight: 700,
                    "&:active": { bgcolor: COLORS.plumDark },
                    "&:disabled": { bgcolor: COLORS.orchid, color: COLORS.muted, cursor: "not-allowed" },
                    ...focusRing,
                }}
            >
                <LocalShippingRoundedIcon aria-hidden="true" />
                {loading ? "Picking up…" : buttonText}
            </Box>
        </Box>
    );
};

export default memo(DeliveryBulkAction);
