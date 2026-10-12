import React, { memo } from "react";
import { Box } from "@mui/joy";
import { COLORS, FONT } from "../../../Style/designTokens";

const Row = ({ label, value, color = COLORS.ink, bold = false }) => (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 0.5 }}>
        <Box sx={{ fontSize: bold ? 18 : 15, fontWeight: bold ? 700 : 500, color }}>{label}</Box>
        <Box sx={{ fontSize: bold ? 18 : 15, fontWeight: bold ? 700 : 600, color }}>{value}</Box>
    </Box>
);

// The bill lines being paid, with the totals underneath
const PaymentBillDetailList = ({
    items = [],
    summary = {},
}) => {

    return (
        <Box sx={{ bgcolor: COLORS.white, border: `1px solid ${COLORS.line}`, borderRadius: "16px", overflow: "hidden", fontFamily: FONT }}>
            <Box sx={{ px: 2, overflowY: "auto", maxHeight: "40dvh" }}>
                {items?.map((item, index) => (
                    <Box
                        key={item.id ?? index}
                        sx={{
                            py: 1.25, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2,
                            borderTop: index === 0 ? "none" : `1px solid ${COLORS.line}`,
                        }}
                    >
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Box sx={{ fontSize: 16, fontWeight: 600, color: COLORS.ink }}>{item?.name}</Box>
                            <Box sx={{ fontSize: 14, color: COLORS.muted }}>
                                {`Qty ${item?.quantity} × ₹${Number(item.rate).toFixed(2)}`}
                            </Box>
                        </Box>

                        <Box sx={{ fontSize: 16, fontWeight: 700, color: COLORS.ink }}>{`₹${Number(item?.rate).toFixed(2)}`}</Box>
                    </Box>
                ))}
            </Box>

            <Box sx={{ px: 2, py: 1.5, bgcolor: COLORS.surface, borderTop: `1px solid ${COLORS.line}` }}>
                <Row label="Item total" value={`₹${Number(summary?.gross || 0).toFixed(2)}`} />
                <Row label="Discount" value={`-₹${Number(summary?.discount || 0).toFixed(2)}`} color={COLORS.success} />
                <Row label="GST" value={`₹${Number(summary?.gst || 0).toFixed(2)}`} />
                <Box sx={{ mt: 0.5, pt: 0.5, borderTop: `1px solid ${COLORS.line}` }}>
                    <Row label="Total" value={`₹${Number(summary?.total || 0).toFixed(2)}`} bold />
                </Box>
            </Box>
        </Box>
    );
};

export default memo(PaymentBillDetailList);
