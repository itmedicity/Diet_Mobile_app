import React, { memo, useEffect, useMemo } from "react";
import { Box } from "@mui/joy";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { COLORS, FONT, focusRing } from "../../../Style/designTokens";

export const SummaryRow = ({ label, value, color = COLORS.ink, bold = false }) => (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 0.5, fontFamily: FONT }}>
        <Box sx={{ fontSize: 15, fontWeight: bold ? 700 : 500, color }}>{label}</Box>
        <Box sx={{ fontSize: 15, fontWeight: bold ? 700 : 600, color }}>{value}</Box>
    </Box>
);

// The bill lines of this order: tick the ones to pay, paid ones are marked
const BillDetailList = ({
    expand = false,
    items = [],
    summary = {},
    setSelectedItems,
    selectedItems
}) => {

    const unpaidItems = useMemo(
        () => items?.filter((item) => item?.bill_item_status !== "PAID"),
        [items]
    );

    const unpaidItemIds = useMemo(
        () => unpaidItems?.map((item) => item?.id),
        [unpaidItems]
    );

    // Default select all
    useEffect(() => {
        setSelectedItems(unpaidItemIds);
    }, [unpaidItemIds, setSelectedItems]);

    const handleToggle = (id) => {
        setSelectedItems(prev =>
            prev.includes(id)
                ? prev.filter(i => i !== id)
                : [...prev, id]
        );
    };

    // stays mounted while closed: the default selection above is needed for the payment button
    return (
        <Box
            sx={{
                display: expand ? "block" : "none", bgcolor: COLORS.white, fontFamily: FONT,
                borderBottom: `1px solid ${COLORS.line}`,
            }}
        >
            <Box sx={{ px: 2.5, pt: 1.5, fontSize: 16, fontWeight: 700, color: COLORS.plum }}>Bill</Box>

            <Box sx={{ px: 2.5, overflowY: "auto", maxHeight: "34dvh" }}>
                {items?.map((item, index) => {
                    const checked = selectedItems.includes(item?.id);
                    const isPayed = item?.billing_status === 'PAID';
                    return (
                        <Box
                            key={item?.id ?? index}
                            sx={{
                                py: 1, display: "flex", alignItems: "center", gap: 1,
                                borderTop: index === 0 ? "none" : `1px solid ${COLORS.line}`,
                            }}
                        >
                            {isPayed ? (
                                <Box
                                    sx={{
                                        flexShrink: 0, minWidth: 44, textAlign: "center", fontSize: 13, fontWeight: 700,
                                        color: COLORS.success,
                                    }}
                                >
                                    Paid
                                </Box>
                            ) : (
                                <Box
                                    component="button"
                                    type="button"
                                    role="checkbox"
                                    aria-checked={checked}
                                    aria-label={`Pay for ${item?.name}`}
                                    onClick={() => handleToggle(item.id)}
                                    sx={{
                                        flexShrink: 0, width: 44, height: 44, border: 0, bgcolor: "transparent", cursor: "pointer",
                                        display: "grid", placeItems: "center", ...focusRing,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 26, height: 26, borderRadius: "8px", display: "grid", placeItems: "center",
                                            bgcolor: checked ? COLORS.plum : COLORS.white, border: `2px solid ${COLORS.plum}`,
                                            color: COLORS.white,
                                        }}
                                    >
                                        {checked && <CheckRoundedIcon sx={{ fontSize: 18 }} />}
                                    </Box>
                                </Box>
                            )}

                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Box sx={{ fontSize: 16, fontWeight: 600, color: COLORS.ink }}>{item.name}</Box>
                                <Box sx={{ fontSize: 14, color: COLORS.muted }}>
                                    {`Qty ${item.quantity} × ₹${item.rate.toFixed(2)}`}
                                </Box>
                            </Box>

                            <Box sx={{ fontSize: 16, fontWeight: 700, color: COLORS.ink }}>{`₹${item.rate.toFixed(2)}`}</Box>
                        </Box>
                    );
                })}
            </Box>

            <Box sx={{ px: 2.5, py: 1.5 }}>
                <SummaryRow label="Item total" value={`₹${summary.gross.toFixed(2)}`} />
                <SummaryRow label="Discount" value={`-₹${summary.discount.toFixed(2)}`} color={COLORS.success} />
                <SummaryRow label="GST" value={`₹${summary.gst.toFixed(2)}`} />
            </Box>
        </Box>
    );
};

export default memo(BillDetailList);
