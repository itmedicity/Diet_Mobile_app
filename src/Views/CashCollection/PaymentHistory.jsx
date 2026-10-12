import React, { memo, useMemo } from "react";
import { Box } from "@mui/joy";
import { usePaymentHistory } from "../../CommonData/UseQuery";
import { EmpauthId } from "../Constant/Constant";
import { format, isValid } from "date-fns";
import PaymentHistoryBillCard from "./CollectionComponent/PaymentHistoryBillCard";
import PaymentHistorySkeleton from "./CollectionComponent/PaymentHistorySkeleton";
import CollectionPage from "./CollectionComponent/CollectionPage";
import { COLORS } from "../../Style/designTokens";

const PaymentHistory = () => {

    const id = EmpauthId()

    const { data: payments = [], isLoading } = usePaymentHistory(id);

    const formatAmount = (amount) => `₹${Number(amount || 0).toFixed(2)}`;

    const formatDate = (date) => {
        const parsedDate = new Date(date);

        if (!isValid(parsedDate)) {
            return "-";
        }

        return format(parsedDate, "dd MMM yyyy");
    };

    const formatTime = (date) => {
        const parsedDate = new Date(date);

        if (!isValid(parsedDate)) {
            return "-";
        }

        return format(parsedDate, "hh:mm a");
    };
    const groupedBills = useMemo(() => {
        const groups = {};

        payments.forEach((payment) => {
            const key = payment.billing_id;
            if (!groups[key]) {
                groups[key] = {
                    billing_id: payment.billing_id,
                    bill_no: payment.bill_no,
                    patient_name: payment.patient_name,
                    patient_id: payment.patient_id,
                    admission_id: payment.admission_id,
                    collected_location: payment.collected_location,
                    bill_type: payment.bill_type,
                    party_name: payment.party_name,
                    payments: [],
                };
            }

            groups[key].payments.push(payment);
        });

        return Object.values(groups);
    }, [payments]);

    const totalCollected = payments?.reduce(
        (total, payment) => total + Number(payment.amount || 0),
        0
    );



    return (
        <CollectionPage title="Payment history" subtitle="Payments you collected, bill by bill">
            {!isLoading && (
                <Box sx={{ mb: 1.5, p: 2, borderRadius: "16px", bgcolor: COLORS.plum, color: COLORS.white, display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 1 }}>
                    <Box>
                        <Box sx={{ fontSize: 14, opacity: 0.9 }}>Collected</Box>
                        <Box sx={{ fontSize: 28, fontWeight: 700 }}>{formatAmount(totalCollected)}</Box>
                    </Box>
                    <Box sx={{ fontSize: 15, opacity: 0.9 }}>
                        {`${groupedBills.length} ${groupedBills.length === 1 ? "bill" : "bills"}`}
                    </Box>
                </Box>
            )}

            {isLoading ? (
                <PaymentHistorySkeleton />
            ) : groupedBills.length === 0 ? (
                <Box sx={{ py: 6, fontSize: 16, color: COLORS.muted, textAlign: "center" }}>
                    You have not collected any payments yet.
                </Box>
            ) : (
                groupedBills.map((bill, index) => (
                    <PaymentHistoryBillCard
                        key={`${bill.billing_id}-${index}`}
                        bill={bill}
                        formatAmount={formatAmount}
                        formatDate={formatDate}
                        formatTime={formatTime}
                    />
                ))
            )}
        </CollectionPage>
    );
};

export default memo(PaymentHistory);
