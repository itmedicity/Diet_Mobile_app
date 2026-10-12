import React, { memo } from "react";
import { Box } from "@mui/joy";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { useNavigate } from "react-router-dom";
import { COLORS, FONT, focusRing } from "../../../Style/designTokens";

// One bill with the payments collected against it; tap to open the bill
const PaymentHistoryBillCard = ({
    bill,
    formatAmount,
    formatDate,
    formatTime,
}) => {

    const billPaid =
        bill?.payments?.reduce((total, payment) => total + Number(payment?.amount || 0), 0);

    const navigate = useNavigate();
    const open = () => navigate(`/cash-collection/bill/${bill.billing_id}`);

    const meta = [bill.patient_id, bill.admission_id ? `Admission ${bill.admission_id}` : null, bill.party_name]
        .filter(Boolean).join("  ·  ");

    return (
        <Box
            role="button"
            tabIndex={0}
            aria-label={`Open bill ${bill.bill_no} for ${bill.patient_name}`}
            onClick={open}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } }}
            sx={{
                mb: 1.25, borderRadius: "16px", overflow: "hidden", cursor: "pointer", fontFamily: FONT,
                bgcolor: COLORS.white, border: `1px solid ${COLORS.line}`,
                "&:active": { bgcolor: COLORS.surface }, ...focusRing,
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 1.75 }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ fontSize: 18, fontWeight: 700, color: COLORS.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {bill.patient_name}
                    </Box>
                    <Box sx={{ fontSize: 14, color: COLORS.muted }}>{`Bill ${bill.bill_no}`}</Box>
                    {meta && <Box sx={{ mt: 0.25, fontSize: 14, color: COLORS.muted }}>{meta}</Box>}
                </Box>

                <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                    <Box sx={{ fontSize: 13, color: COLORS.muted }}>Paid</Box>
                    <Box sx={{ fontSize: 20, fontWeight: 700, color: COLORS.ink }}>{formatAmount(billPaid)}</Box>
                </Box>

                <ChevronRightRoundedIcon aria-hidden="true" sx={{ color: COLORS.muted }} />
            </Box>

            {/* PAYMENTS */}
            <Box component="ul" sx={{ listStyle: "none", m: 0, px: 1.75, py: 0.5, bgcolor: COLORS.surface, borderTop: `1px solid ${COLORS.line}` }}>
                {bill.payments?.map((payment, index) => (
                    <Box
                        component="li"
                        key={payment.payment_id}
                        sx={{
                            py: 1, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1,
                            borderTop: index === 0 ? "none" : `1px solid ${COLORS.line}`,
                        }}
                    >
                        <Box>
                            <Box sx={{ fontSize: 16, fontWeight: 600, color: COLORS.ink }}>{payment.payment_mode}</Box>
                            <Box sx={{ fontSize: 13, color: COLORS.muted }}>
                                {`${formatDate(payment.payment_date)} · ${formatTime(payment.payment_date)}`}
                            </Box>
                        </Box>
                        <Box sx={{ fontSize: 17, fontWeight: 700, color: COLORS.ink }}>{formatAmount(payment.amount)}</Box>
                    </Box>
                ))}
            </Box>

            <Box sx={{ px: 1.75, py: 1, display: "flex", justifyContent: "space-between", borderTop: `1px solid ${COLORS.line}`, fontSize: 14 }}>
                <Box sx={{ color: COLORS.muted }}>{bill.collected_location}</Box>
                <Box sx={{ color: COLORS.success, fontWeight: 700 }}>Collected</Box>
            </Box>
        </Box>
    );
};

export default memo(PaymentHistoryBillCard);
