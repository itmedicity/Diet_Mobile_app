import React, { memo } from "react";
import { Box } from "@mui/joy";
import { useParams } from "react-router-dom";
import { format, isValid } from "date-fns";

import { usePaymentHistoryBillDetail } from "../../CommonData/UseQuery";
import PaymentHistorySkeleton from "./CollectionComponent/PaymentHistorySkeleton";
import CollectionPage, { money } from "./CollectionComponent/CollectionPage";
import { COLORS, FONT } from "../../Style/designTokens";

const STATUS = {
    PAID: { bg: "#E3F3E8", color: COLORS.success, label: "Paid" },
    PARTIAL: { bg: "#FFF1D6", color: COLORS.warning, label: "Part paid" },
    CANCELLED: { bg: "#FBE9E7", color: COLORS.error, label: "Cancelled" },
};

const formatDate = (date) => {
    const parsedDate = new Date(date);
    return isValid(parsedDate) ? format(parsedDate, "dd MMM yyyy") : "-";
};

const formatTime = (date) => {
    const parsedDate = new Date(date);
    return isValid(parsedDate) ? format(parsedDate, "hh:mm a") : "-";
};

const Section = ({ title, count, children }) => (
    <Box sx={{ mt: 1.5, bgcolor: COLORS.white, border: `1px solid ${COLORS.line}`, borderRadius: "16px", overflow: "hidden", fontFamily: FONT }}>
        <Box sx={{ px: 2, pt: 1.5, pb: 0.5, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <Box component="h2" sx={{ m: 0, fontSize: 17, fontWeight: 700, color: COLORS.ink }}>{title}</Box>
            <Box sx={{ fontSize: 14, color: COLORS.muted }}>{count}</Box>
        </Box>
        {children}
    </Box>
);

const Line = ({ first, left, sub, right }) => (
    <Box sx={{ px: 2, py: 1.25, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1, borderTop: first ? "none" : `1px solid ${COLORS.line}` }}>
        <Box sx={{ minWidth: 0 }}>
            <Box sx={{ fontSize: 16, fontWeight: 600, color: COLORS.ink }}>{left}</Box>
            {sub && <Box sx={{ fontSize: 14, color: COLORS.muted }}>{sub}</Box>}
        </Box>
        <Box sx={{ flexShrink: 0, fontSize: 17, fontWeight: 700, color: COLORS.ink }}>{right}</Box>
    </Box>
);

const CashCollectionBillDetails = () => {
    const { billingId } = useParams();

    const {
        data: BillDetails = {
            bill: null,
            items: [],
            payments: [],
        },
        isLoading,
    } = usePaymentHistoryBillDetail(billingId);

    const {
        bill = null,
        items = [],
        payments = [],
    } = BillDetails;

    if (isLoading) {
        return (
            <CollectionPage title="Bill details" subtitle="Loading…">
                <PaymentHistorySkeleton />
            </CollectionPage>
        );
    }

    if (!bill) {
        return (
            <CollectionPage title="Bill details">
                <Box sx={{ py: 6, textAlign: "center", fontFamily: FONT, fontSize: 16, color: COLORS.muted }}>
                    This bill was not found. Go back and open it again from the history.
                </Box>
            </CollectionPage>
        );
    }

    const status = STATUS[bill.billing_status] || { bg: COLORS.surface, color: COLORS.muted, label: bill.billing_status };
    const meta = [bill.patient_id, bill.admission_id ? `Admission ${bill.admission_id}` : null, bill.party_name].filter(Boolean).join("  ·  ");
    const balanceDue = Number(bill.balance_amount) > 0;

    return (
        <CollectionPage title="Bill details" subtitle={`Bill ${bill.bill_no}`}>
            {/* BILL */}
            <Box sx={{ p: 2, borderRadius: "16px", bgcolor: COLORS.white, border: `1px solid ${COLORS.line}`, fontFamily: FONT }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1 }}>
                    <Box sx={{ minWidth: 0 }}>
                        <Box sx={{ fontSize: 20, fontWeight: 700, color: COLORS.ink }}>{bill.patient_name || "-"}</Box>
                        {meta && <Box sx={{ mt: 0.25, fontSize: 14, color: COLORS.muted }}>{meta}</Box>}
                    </Box>
                    <Box sx={{ flexShrink: 0, px: 1.25, py: 0.4, borderRadius: "999px", fontSize: 14, fontWeight: 700, bgcolor: status.bg, color: status.color }}>
                        {status.label}
                    </Box>
                </Box>

                <Box sx={{ mt: 1.5, pt: 1.5, borderTop: `1px solid ${COLORS.line}`, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1 }}>
                    <Box>
                        <Box sx={{ fontSize: 14, color: COLORS.muted }}>Total</Box>
                        <Box sx={{ fontSize: 18, fontWeight: 700, color: COLORS.ink }}>{money(bill.total_amount)}</Box>
                    </Box>
                    <Box>
                        <Box sx={{ fontSize: 14, color: COLORS.muted }}>Paid</Box>
                        <Box sx={{ fontSize: 18, fontWeight: 700, color: COLORS.success }}>{money(bill.paid_amount)}</Box>
                    </Box>
                    <Box>
                        <Box sx={{ fontSize: 14, color: COLORS.muted }}>Balance</Box>
                        <Box sx={{ fontSize: 18, fontWeight: 700, color: balanceDue ? COLORS.warning : COLORS.success }}>{money(bill.balance_amount)}</Box>
                    </Box>
                </Box>
            </Box>

            {/* ITEMS */}
            <Section title="Bill items" count={`${items.length} ${items.length === 1 ? "item" : "items"}`}>
                {items.length === 0 ? (
                    <Box sx={{ px: 2, py: 1.5, fontSize: 15, color: COLORS.muted }}>No items on this bill.</Box>
                ) : (
                    items.map((item, index) => (
                        <Line
                            key={item.billing_detail_id}
                            first={index === 0}
                            left={item.description}
                            sub={`${item.quantity} × ${money(item.rate)}`}
                            right={money(item.amount)}
                        />
                    ))
                )}
            </Section>

            {/* PAYMENTS */}
            <Section title="Payments" count={`${payments.length} ${payments.length === 1 ? "payment" : "payments"}`}>
                {payments.length === 0 ? (
                    <Box sx={{ px: 2, py: 1.5, fontSize: 15, color: COLORS.muted }}>No payments on this bill yet.</Box>
                ) : (
                    payments.map((payment, index) => (
                        <Line
                            key={payment.payment_id}
                            first={index === 0}
                            left={payment.payment_mode}
                            sub={`${formatDate(payment.payment_date)} · ${formatTime(payment.payment_date)}`}
                            right={money(payment.amount)}
                        />
                    ))
                )}
            </Section>

            {/* WHERE */}
            <Box sx={{ mt: 1.5, px: 2, py: 1.5, borderRadius: "16px", bgcolor: COLORS.white, border: `1px solid ${COLORS.line}`, display: "flex", justifyContent: "space-between", fontFamily: FONT, fontSize: 15 }}>
                <Box sx={{ color: COLORS.muted }}>{bill.bill_generated_location}</Box>
                <Box sx={{ fontWeight: 700, color: bill.is_settled === "Y" ? COLORS.success : COLORS.warning }}>
                    {bill.is_settled === "Y" ? "Settled" : "Not settled"}
                </Box>
            </Box>
        </CollectionPage>
    );
};

export default memo(CashCollectionBillDetails);
