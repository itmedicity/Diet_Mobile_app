import React, { memo } from "react";
import { Box } from "@mui/joy";
import { COLORS, FONT, focusRing } from "../../Style/designTokens";
import { DELIVERY_STATUS, FILTER_KEYS } from "../../CommonData/deliveryStatus";

// A row of status chips you can scroll sideways. Each shows how many orders it holds.
const DeliveryStatusFilter = ({ value, onChange, counts = {}, total = 0 }) => {

    const chips = [
        { key: "", label: "All", color: COLORS.plum, tint: COLORS.wash, line: COLORS.plum, count: total },
        ...FILTER_KEYS.map((key) => ({ key, ...DELIVERY_STATUS[key], label: DELIVERY_STATUS[key].short, count: counts[key] || 0 })),
    ];

    return (
        <Box
            role="group"
            aria-label="Filter by delivery status"
            sx={{
                display: "flex", gap: 1, px: 2, py: 1.25, overflowX: "auto", fontFamily: FONT,
                scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" },
            }}
        >
            {chips.map((chip) => {
                const active = value === chip.key;
                return (
                    <Box
                        key={chip.key || "all"}
                        component="button"
                        type="button"
                        aria-pressed={active}
                        onClick={() => onChange(chip.key)}
                        sx={{
                            flexShrink: 0, height: 44, px: 1.75, borderRadius: "999px", cursor: "pointer",
                            display: "flex", alignItems: "center", gap: 0.75,
                            fontFamily: FONT, fontSize: 15, fontWeight: 700,
                            bgcolor: active ? chip.color : COLORS.white,
                            color: active ? COLORS.white : chip.color,
                            border: `1.5px solid ${active ? chip.color : chip.line}`,
                            ...focusRing,
                        }}
                    >
                        {chip.label}
                        <Box
                            component="span"
                            sx={{
                                minWidth: 22, height: 22, px: 0.5, borderRadius: "11px", display: "grid", placeItems: "center",
                                fontSize: 13, fontWeight: 700,
                                bgcolor: active ? "rgba(255,255,255,0.22)" : chip.tint,
                                color: active ? COLORS.white : chip.color,
                            }}
                        >
                            {chip.count}
                        </Box>
                    </Box>
                );
            })}
        </Box>
    );
};

export default memo(DeliveryStatusFilter);
