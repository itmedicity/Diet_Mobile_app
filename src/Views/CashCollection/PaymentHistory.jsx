
import React, { memo, useMemo } from "react";
import { Box, Typography } from "@mui/joy";
import { usePaymentHistory } from "../../CommonData/UseQuery";
import { EmpauthId } from "../Constant/Constant";
import { format, isValid } from "date-fns";
import PaymentHistoryBillCard from "./CollectionComponent/PaymentHistoryBillCard";
import PaymentHistorySkeleton from "./CollectionComponent/PaymentHistorySkeleton";

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
        <Box
            sx={{
                width: "100%",
                height: "100dvh",
                background: "#F7F7F5",
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
                overflow: "hidden",
            }}
        >


            <Box
                sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 20,
                    width: "100%",
                    background: "rgba(247, 247, 245, 0.96)",
                    backdropFilter: "blur(10px)",
                    borderBottom: "1px solid #E2E2DD",
                    flexShrink: 0,
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        maxWidth: "480px",
                        mx: "auto",
                        px: { xs: 1.5, sm: 2.5 },
                        py: 1.1,
                        boxSizing: "border-box",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 1.5,
                        }}
                    >
                        {/* LEFT */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                minWidth: 0,
                            }}
                        >
                            {/* HISTORY ICON */}
                            <Box
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: "13px",
                                    background:
                                        "linear-gradient(145deg, #FFFFFF 0%, #F0F0ED 100%)",
                                    border: "1px solid #DFDFDA",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                    boxShadow:
                                        "0 3px 10px rgba(0,0,0,0.04)",
                                }}
                            >
                                ⏰
                            </Box>

                            <Box
                                sx={{
                                    minWidth: 0,
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 0.7,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: {
                                                xs: "0.75rem",
                                                sm: "1rem",
                                            },
                                            fontWeight: 900,
                                            color: "#171717",
                                            lineHeight: 1.15,
                                            letterSpacing: "-0.01em",
                                        }}
                                    >
                                        PAYMENT HISTORY
                                    </Typography>


                                </Box>

                                <Typography
                                    sx={{
                                        mt: 0.3,
                                        fontSize: {
                                            xs: "0.57rem",
                                            sm: "0.6rem",
                                        },
                                        color: "#858580",
                                        fontWeight: 600,
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    Bill-wise collection history
                                </Typography>
                            </Box>
                        </Box>

                        {/* RIGHT TOTAL */}
                        <Box
                            sx={{
                                flexShrink: 0,
                                textAlign: "right",
                                pl: 1,
                                borderLeft: "1px solid #DFDFDA",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: "0.5rem",
                                    color: "#999993",
                                    fontWeight: 800,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.06em",
                                    lineHeight: 1,
                                }}
                            >
                                Collected
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.3,
                                    fontSize: {
                                        xs: "0.9rem",
                                        sm: "0.95rem",
                                    },
                                    fontWeight: 950,
                                    color: "#171717",
                                    lineHeight: 1,
                                    letterSpacing: "-0.02em",
                                }}
                            >
                                {formatAmount(totalCollected)}
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.3,
                                    fontSize: "0.48rem",
                                    color: "#999993",
                                    fontWeight: 600,
                                }}
                            >
                                {groupedBills.length}{" "}
                                {groupedBills.length === 1 ? "bill" : "bills"}
                            </Typography>
                        </Box>
                    </Box>

                    {/* SMALL BOTTOM ACCENT */}
                    <Box
                        sx={{
                            mt: 0.9,
                            width: "100%",
                            height: 2,
                            borderRadius: "10px",
                            background:
                                "linear-gradient(90deg, #222 0%, #222 35%, transparent 35%)",
                            opacity: 0.85,
                        }}
                    />
                </Box>
            </Box>

            {/* SCROLLABLE CONTENT */}
            <Box
                sx={{
                    width: "100%",
                    maxWidth: "480px",
                    mx: "auto",
                    px: { xs: 1.5, sm: 2.5 },
                    pt: 1.2,
                    pb: 1.5,
                    boxSizing: "border-box",
                    flex: 1,
                    minHeight: 0,
                    overflowY: "auto",

                    "&::-webkit-scrollbar": {
                        width: 3,
                    },

                    "&::-webkit-scrollbar-thumb": {
                        background: "#D0D0CB",
                        borderRadius: 10,
                    },
                }}
            >
                {
                    isLoading ? (
                        <PaymentHistorySkeleton />
                    ) : (
                        groupedBills?.map((bill, index) => (
                            <PaymentHistoryBillCard
                                key={`${bill.billing_id}-${index}`}
                                bill={bill}
                                formatAmount={formatAmount}
                                formatDate={formatDate}
                                formatTime={formatTime}
                            />
                        ))
                    )
                }
            </Box>
        </Box>
    );
};

export default memo(PaymentHistory);
