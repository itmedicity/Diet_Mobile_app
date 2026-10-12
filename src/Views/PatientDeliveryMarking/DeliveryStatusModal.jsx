import React, { memo } from "react";
import { Box } from "@mui/joy";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import DeliveryDiningRoundedIcon from "@mui/icons-material/DeliveryDiningRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { COLORS, FONT, focusRing } from "../../Style/designTokens";
import { DELIVERY_STATUS, statusOf } from "../../CommonData/deliveryStatus";

const ICONS = {
    DELIVERED: <DoneAllRoundedIcon />,
    UNDELIVERED: <DeliveryDiningRoundedIcon />,
    RETURNED: <ReplayRoundedIcon />,
    CANCELLED: <CancelRoundedIcon />,
};

const CHOICES = ["DELIVERED", "UNDELIVERED", "RETURNED", "CANCELLED"];

// Bottom sheet: change the delivery status of one order
const DeliveryStatusModal = ({ open, onClose, selectedItem, handleStatusUpdate }) => {

    if (!open) return null;

    const current = statusOf(selectedItem?.ItemStatus);

    return (
        <>
            <Box onClick={onClose} sx={{ position: "fixed", inset: 0, bgcolor: "rgba(42,16,56,0.5)", zIndex: 1700 }} />

            <Box
                role="dialog"
                aria-modal="true"
                aria-label="Change delivery status"
                sx={{
                    position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 1800,
                    bgcolor: COLORS.white, borderRadius: "28px 28px 0 0", fontFamily: FONT,
                    pb: "calc(16px + env(safe-area-inset-bottom))", maxWidth: 560, mx: "auto",
                }}
            >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1, px: 2.5, pt: 2.5, pb: 1 }}>
                    <Box sx={{ minWidth: 0 }}>
                        <Box sx={{ fontSize: 20, fontWeight: 700, color: COLORS.ink }}>{selectedItem?.fb_ptc_name}</Box>
                        <Box sx={{ mt: 0.25, fontSize: 15, color: COLORS.muted }}>
                            {[selectedItem?.fb_ns_name, selectedItem?.type_desc].filter(Boolean).join("  ·  ")}
                        </Box>
                        <Box sx={{ mt: 0.75, fontSize: 14, color: COLORS.muted }}>
                            {`Now: ${current.label}`}
                        </Box>
                    </Box>
                    <Box component="button" type="button" aria-label="Close" onClick={onClose}
                        sx={{
                            flexShrink: 0, width: 48, height: 48, border: 0, borderRadius: "50%", cursor: "pointer",
                            display: "grid", placeItems: "center", bgcolor: COLORS.wash, color: COLORS.plum, ...focusRing,
                        }}>
                        <CloseRoundedIcon />
                    </Box>
                </Box>

                <Box sx={{ px: 2.5, pt: 1, fontSize: 15, fontWeight: 600, color: COLORS.ink }}>Mark this order as</Box>

                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.25, px: 2.5, pt: 1 }}>
                    {CHOICES.map((key) => {
                        const s = DELIVERY_STATUS[key];
                        return (
                            <Box
                                key={key}
                                component="button"
                                type="button"
                                onClick={() => handleStatusUpdate(key)}
                                sx={{
                                    minHeight: 76, borderRadius: "16px", cursor: "pointer",
                                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 0.5,
                                    fontFamily: FONT, fontSize: 16, fontWeight: 700,
                                    bgcolor: s.tint, color: s.color, border: `1.5px solid ${s.line}`,
                                    "&:active": { bgcolor: s.line },
                                    ...focusRing,
                                }}
                            >
                                {ICONS[key]}
                                {s.label}
                            </Box>
                        );
                    })}
                </Box>
            </Box>
        </>
    );
};

export default memo(DeliveryStatusModal);
