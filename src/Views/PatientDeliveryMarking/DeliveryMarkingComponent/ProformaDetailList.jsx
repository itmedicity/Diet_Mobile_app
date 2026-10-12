import React, { memo } from "react";
import { Box } from "@mui/joy";
import { COLORS, FONT } from "../../../Style/designTokens";
import { SummaryRow } from "./BillDetailList";

// The proforma (estimate) lines for this order
const ProformaDetailList = ({
    expand = false,
    items = [],
    summary = {}
}) => {

    if (!expand) return null;

    // Calculate total from items if summary.total is not provided
    const total = items?.reduce(
        (sum, item) =>
            sum + Number(item?.amount ?? 0),
        0
    );

    return (
        <Box sx={{ bgcolor: COLORS.white, fontFamily: FONT, borderBottom: `1px solid ${COLORS.line}` }}>
            <Box sx={{ px: 2.5, pt: 1.5, fontSize: 16, fontWeight: 700, color: COLORS.plum }}>Proforma invoice</Box>

            <Box sx={{ px: 2.5, overflowY: "auto", maxHeight: "34dvh" }}>
                {items?.map((item, index) => (
                    <Box
                        key={item?.proforma_detail_id}
                        sx={{
                            py: 1.25, display: "flex", alignItems: "center", gap: 1,
                            borderTop: index === 0 ? "none" : `1px solid ${COLORS.line}`,
                        }}
                    >
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Box sx={{ fontSize: 16, fontWeight: 600, color: COLORS.ink }}>
                                {item?.item_name || item?.description || "-"}
                            </Box>
                            <Box sx={{ fontSize: 14, color: COLORS.muted }}>
                                {`Qty ${item?.quantity ?? 0} × ₹${Number(item?.rate ?? 0).toFixed(2)}`}
                            </Box>
                        </Box>
                        <Box sx={{ fontSize: 16, fontWeight: 700, color: COLORS.ink }}>
                            {`₹${Number(item?.amount ?? 0).toFixed(2)}`}
                        </Box>
                    </Box>
                ))}
            </Box>

            <Box sx={{ px: 2.5, py: 1.5 }}>
                <SummaryRow label="Item total" value={`₹${Number(summary?.gross ?? total).toFixed(2)}`} />
                <SummaryRow label="Discount" value={`-₹${Number(summary?.discount ?? 0).toFixed(2)}`} color={COLORS.success} />
                <SummaryRow label="GST" value={`₹${Number(summary?.gst ?? 0).toFixed(2)}`} />
                <SummaryRow label="Total" value={`₹${Number(summary?.total ?? total).toFixed(2)}`} bold />
            </Box>
        </Box>
    );
};

export default memo(ProformaDetailList);
