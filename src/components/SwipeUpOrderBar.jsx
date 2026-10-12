import React from "react";
import { Box } from "@mui/joy";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import { COLORS, FONT, focusRing } from "../Style/designTokens";

// The main button of the order bar: what is in the basket, and the way to review it
const SwipeUpOrderBar = ({
    hasItems,
    totalItems,
    totalAmount,
    onOpen,
    hasOrders
}) => {
    return (
        <Box
            component="button"
            type="button"
            disabled={!hasItems}
            onClick={() => hasItems && onOpen("list")}
            sx={{
                flex: 1,
                minWidth: 0,
                height: 56,
                px: 2,
                border: 0,
                borderRadius: "16px",
                fontFamily: FONT,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
                cursor: hasItems ? "pointer" : "default",
                bgcolor: hasItems ? COLORS.plum : COLORS.wash,
                color: hasItems ? COLORS.white : COLORS.muted,
                "&:active": hasItems ? { bgcolor: COLORS.plumDark } : {},
                ...focusRing,
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
                <ShoppingBagRoundedIcon aria-hidden="true" sx={{ fontSize: 22 }} />
                <Box sx={{ minWidth: 0, textAlign: "left" }}>
                    <Box sx={{ fontSize: 16, fontWeight: 700, lineHeight: 1.2, whiteSpace: "nowrap" }}>
                        {hasItems
                            ? `${totalItems} ${totalItems === 1 ? "item" : "items"}`
                            : "No items selected"}
                    </Box>
                    {hasItems && (
                        <Box sx={{ fontSize: 13, lineHeight: 1.3, opacity: 0.88 }}>Review order</Box>
                    )}
                </Box>
            </Box>

            {hasItems && (
                <Box sx={{ fontSize: 18, fontWeight: 700, whiteSpace: "nowrap" }}>
                    {`₹ ${totalAmount}`}
                </Box>
            )}
        </Box>
    );
};

export default SwipeUpOrderBar;
