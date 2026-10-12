import React, { memo } from "react";
import { Box } from "@mui/joy";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { COLORS, FONT, focusRing } from "../../../Style/designTokens";
import { money } from "./CollectionPage";

const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const formatTime = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
};

const Figure = ({ label, value, color = COLORS.ink }) => (
    <Box>
        <Box sx={{ fontSize: 13, color: COLORS.muted }}>{label}</Box>
        <Box sx={{ fontSize: 16, fontWeight: 700, color }}>{value}</Box>
    </Box>
);

// One cash payment that left change to hand back; tap to return it
const CashReturnCard = ({ payment, onClick }) => {

    /*
     * These values are already calculated by the backend.
     *
     * change_amount    = Original change amount
     * returned_amount  = Total amount returned so far
     * remaining_amount = Amount still to be returned
     */
    const changeAmount = Number(payment?.change_amount || 0);
    const returnedAmount = Number(payment?.returned_amount || 0);
    const remainingAmount = Number(payment?.remaining_amount || 0);

    const meta = [payment?.patient_id, payment?.admission_id ? `Admission ${payment.admission_id}` : null, payment?.party_name]
        .filter(Boolean).join("  ·  ");

    const open = () => onClick?.(payment);

    return (
        <Box
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
            aria-label={onClick ? `Return change for ${payment?.patient_name}, bill ${payment?.bill_no}` : undefined}
            onClick={open}
            onKeyDown={(e) => { if (onClick && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); open(); } }}
            sx={{
                mb: 1.25, borderRadius: "16px", overflow: "hidden", fontFamily: FONT, cursor: onClick ? "pointer" : "default",
                bgcolor: COLORS.white, border: `1px solid ${COLORS.line}`,
                "&:active": onClick ? { bgcolor: COLORS.surface } : {}, ...focusRing,
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 1.75 }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ fontSize: 18, fontWeight: 700, color: COLORS.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {payment?.patient_name}
                    </Box>
                    <Box sx={{ fontSize: 14, color: COLORS.muted }}>{`Bill ${payment?.bill_no}`}</Box>
                    {meta && <Box sx={{ mt: 0.25, fontSize: 14, color: COLORS.muted }}>{meta}</Box>}
                </Box>

                <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                    <Box sx={{ fontSize: 13, color: COLORS.muted }}>Still to return</Box>
                    <Box sx={{ fontSize: 22, fontWeight: 700, color: COLORS.plum }}>{money(remainingAmount)}</Box>
                </Box>

                {onClick && <ChevronRightRoundedIcon aria-hidden="true" sx={{ color: COLORS.muted }} />}
            </Box>

            <Box sx={{ px: 1.75, py: 1.25, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.25, bgcolor: COLORS.surface, borderTop: `1px solid ${COLORS.line}` }}>
                <Figure label="Bill paid" value={money(payment?.bill_paid_amount)} />
                <Figure label="Cash received" value={money(payment?.received_amount)} />
                <Figure label="Change due" value={money(changeAmount)} />
                <Figure label="Returned so far" value={money(returnedAmount)} />
            </Box>

            <Box sx={{ px: 1.75, py: 1, display: "flex", justifyContent: "space-between", gap: 1, borderTop: `1px solid ${COLORS.line}`, fontSize: 14, color: COLORS.muted }}>
                <span>{payment?.payment_mode}</span>
                <span>{`${formatDate(payment?.payment_date)} · ${formatTime(payment?.payment_date)}`}</span>
            </Box>
        </Box>
    );
};

export default memo(CashReturnCard);
