
import React, { memo } from "react";
import { Box, Typography } from "@mui/joy";
import { useNavigate, useParams } from "react-router-dom";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

import { usePaymentHistoryBillDetail } from "../../CommonData/UseQuery";
import PaymentHistorySkeleton from "./CollectionComponent/PaymentHistorySkeleton";

import { format, isValid } from "date-fns";

const CashCollectionBillDetails = () => {
    const navigate = useNavigate();
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

    const formatAmount = (amount) => {
        return `₹${Number(amount || 0).toFixed(2)}`;
    };

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

    const getStatusStyle = (status) => {
        switch (status) {
            case "PAID":
                return {
                    background: "#EAF7EE",
                    color: "#317B43",
                };

            case "PARTIAL":
                return {
                    background: "#FFF4DE",
                    color: "#9A6916",
                };

            case "CANCELLED":
                return {
                    background: "#FCEBEC",
                    color: "#B43A42",
                };

            default:
                return {
                    background: "#F3F3F0",
                    color: "#666",
                };
        }
    };

    if (isLoading) {
        return <PaymentHistorySkeleton />;
    }

    if (!bill) {
        return (
            <Box
                sx={{
                    minHeight: "100dvh",
                    width: "100%",
                    background: "#F7F7F5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    px: 2,
                }}
            >
                <Typography
                    sx={{
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        color: "#777",
                    }}
                >
                    Bill details not found
                </Typography>
            </Box>
        );
    }

    const statusStyle = getStatusStyle(bill.billing_status);

    return (
        <Box
            sx={{
                width: "100%",
                height: "100dvh",
                background: "#F7F7F5",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                boxSizing: "border-box",
            }}
        >
            {/* STICKY HEADER */}
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
                            gap: 1,
                        }}
                    >
                        <Box
                            onClick={() => navigate(-1)}
                            sx={{
                                width: 34,
                                height: 34,
                                borderRadius: "11px",
                                background: "#FFFFFF",
                                border: "1px solid #E2E2DD",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",

                                "&:active": {
                                    transform: "scale(0.94)",
                                },
                            }}
                        >
                            <ArrowBackRoundedIcon
                                sx={{
                                    fontSize: 19,
                                    color: "#222",
                                }}
                            />
                        </Box>

                        <Box sx={{ minWidth: 0 }}>
                            <Typography
                                sx={{
                                    fontSize: {
                                        xs: "0.88rem",
                                        sm: "1rem",
                                    },
                                    fontWeight: 900,
                                    color: "#191919",
                                    lineHeight: 1.15,
                                }}
                            >
                                BILL DETAILS
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.25,
                                    fontSize: "0.58rem",
                                    color: "#858580",
                                    fontWeight: 700,
                                }}
                            >
                                {bill.bill_no}
                            </Typography>
                        </Box>
                    </Box>
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
                    pb: 2,
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
                {/* BILL SUMMARY */}
                <Box
                    sx={{
                        background: "#FFFFFF",
                        border: "1px solid #E3E3DE",
                        borderRadius: "18px",
                        px: 1.5,
                        py: 1.5,
                        mb: 1,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            gap: 1,
                        }}
                    >
                        <Box sx={{ minWidth: 0 }}>
                            <Typography
                                sx={{
                                    fontSize: "0.55rem",
                                    color: "#999",
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                }}
                            >
                                Bill Number
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.2,
                                    fontSize: "0.82rem",
                                    fontWeight: 900,
                                    color: "#1C1C1C",
                                }}
                            >
                                {bill.bill_no}
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                px: 0.8,
                                py: 0.4,
                                borderRadius: "9px",
                                background: statusStyle.background,
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: "0.5rem",
                                    fontWeight: 900,
                                    color: statusStyle.color,
                                }}
                            >
                                {bill.billing_status}
                            </Typography>
                        </Box>
                    </Box>

                    {/* PATIENT */}
                    <Box
                        sx={{
                            mt: 1.2,
                            display: "flex",
                            alignItems: "center",
                            gap: 0.7,
                        }}
                    >
                        <PersonRoundedIcon
                            sx={{
                                fontSize: 15,
                                color: "#777",
                            }}
                        />

                        <Typography
                            sx={{
                                fontSize: "0.68rem",
                                fontWeight: 800,
                                color: "#333",
                            }}
                        >
                            {bill.patient_name || "-"}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            mt: 0.45,
                            display: "flex",
                            alignItems: "center",
                            gap: 0.7,
                            flexWrap: "wrap",
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: "0.53rem",
                                color: "#898985",
                                fontWeight: 600,
                            }}
                        >
                            {bill.patient_id}
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: "0.53rem",
                                color: "#C0C0BB",
                            }}
                        >
                            •
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: "0.53rem",
                                color: "#898985",
                                fontWeight: 600,
                            }}
                        >
                            Admission: {bill.admission_id}
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: "0.53rem",
                                color: "#C0C0BB",
                            }}
                        >
                            •
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: "0.53rem",
                                color: "#898985",
                                fontWeight: 700,
                            }}
                        >
                            {bill.party_name}
                        </Typography>
                    </Box>

                    {/* AMOUNTS */}
                    <Box
                        sx={{
                            mt: 1.4,
                            pt: 1.1,
                            borderTop: "1px solid #EEEEEA",
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(3, 1fr)",
                            gap: 1,
                        }}
                    >
                        <Box>
                            <Typography
                                sx={{
                                    fontSize: "0.51rem",
                                    color: "#999",
                                    fontWeight: 700,
                                }}
                            >
                                TOTAL
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.2,
                                    fontSize: "0.76rem",
                                    fontWeight: 900,
                                    color: "#222",
                                }}
                            >
                                {formatAmount(bill.total_amount)}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography
                                sx={{
                                    fontSize: "0.51rem",
                                    color: "#999",
                                    fontWeight: 700,
                                }}
                            >
                                PAID
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.2,
                                    fontSize: "0.76rem",
                                    fontWeight: 900,
                                    color: "#28753A",
                                }}
                            >
                                {formatAmount(bill.paid_amount)}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography
                                sx={{
                                    fontSize: "0.51rem",
                                    color: "#999",
                                    fontWeight: 700,
                                }}
                            >
                                BALANCE
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.2,
                                    fontSize: "0.76rem",
                                    fontWeight: 900,
                                    color:
                                        Number(bill.balance_amount) > 0
                                            ? "#A56F13"
                                            : "#28753A",
                                }}
                            >
                                {formatAmount(bill.balance_amount)}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* ITEMS */}
                <Box
                    sx={{
                        background: "#FFFFFF",
                        border: "1px solid #E3E3DE",
                        borderRadius: "18px",
                        px: 1.4,
                        py: 1.3,
                        mb: 1,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mb: 0.7,
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: "0.62rem",
                                fontWeight: 900,
                                color: "#333",
                                textTransform: "uppercase",
                                letterSpacing: "0.04em",
                            }}
                        >
                            Bill Items
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: "0.53rem",
                                fontWeight: 700,
                                color: "#999",
                            }}
                        >
                            {items.length}{" "}
                            {items.length === 1 ? "item" : "items"}
                        </Typography>
                    </Box>

                    {items.length === 0 ? (
                        <Typography
                            sx={{
                                fontSize: "0.6rem",
                                color: "#999",
                                py: 1,
                            }}
                        >
                            No items found
                        </Typography>
                    ) : (
                        items.map((item) => (
                            <Box
                                key={item.billing_detail_id}
                                sx={{
                                    py: 0.75,
                                    borderTop: "1px solid #EEEEEA",
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        justifyContent:
                                            "space-between",
                                        gap: 1,
                                    }}
                                >
                                    <Box sx={{ minWidth: 0 }}>
                                        <Typography
                                            sx={{
                                                fontSize: "0.65rem",
                                                fontWeight: 800,
                                                color: "#333",
                                            }}
                                        >
                                            {item.description}
                                        </Typography>

                                        <Typography
                                            sx={{
                                                mt: 0.2,
                                                fontSize: "0.52rem",
                                                color: "#999",
                                                fontWeight: 600,
                                            }}
                                        >
                                            {item.quantity} ×{" "}
                                            {formatAmount(item.rate)}
                                        </Typography>
                                    </Box>

                                    <Typography
                                        sx={{
                                            fontSize: "0.68rem",
                                            fontWeight: 900,
                                            color: "#222",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {formatAmount(item.amount)}
                                    </Typography>
                                </Box>
                            </Box>
                        ))
                    )}
                </Box>

                {/* PAYMENTS */}
                <Box
                    sx={{
                        background: "#FFFFFF",
                        border: "1px solid #E3E3DE",
                        borderRadius: "18px",
                        px: 1.4,
                        py: 1.3,
                        mb: 1,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mb: 0.7,
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: "0.62rem",
                                fontWeight: 900,
                                color: "#333",
                                textTransform: "uppercase",
                                letterSpacing: "0.04em",
                            }}
                        >
                            Payment History
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: "0.53rem",
                                fontWeight: 700,
                                color: "#999",
                            }}
                        >
                            {payments.length}{" "}
                            {payments.length === 1
                                ? "payment"
                                : "payments"}
                        </Typography>
                    </Box>

                    {payments.length === 0 ? (
                        <Typography
                            sx={{
                                fontSize: "0.6rem",
                                color: "#999",
                                py: 1,
                            }}
                        >
                            No payments found
                        </Typography>
                    ) : (
                        payments.map((payment) => (
                            <Box
                                key={payment.payment_id}
                                sx={{
                                    py: 0.8,
                                    borderTop: "1px solid #EEEEEA",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent:
                                        "space-between",
                                    gap: 1,
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 0.8,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 30,
                                            height: 30,
                                            borderRadius: "9px",
                                            background: "#F3F3F0",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent:
                                                "center",
                                            flexShrink: 0,
                                        }}
                                    >
                                        <PaymentsRoundedIcon
                                            sx={{
                                                fontSize: 15,
                                                color: "#444",
                                            }}
                                        />
                                    </Box>

                                    <Box>
                                        <Typography
                                            sx={{
                                                fontSize: "0.62rem",
                                                fontWeight: 900,
                                                color: "#333",
                                            }}
                                        >
                                            {payment.payment_mode}
                                        </Typography>

                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 0.3,
                                                mt: 0.2,
                                            }}
                                        >
                                            <AccessTimeRoundedIcon
                                                sx={{
                                                    fontSize: 10,
                                                    color: "#999",
                                                }}
                                            />

                                            <Typography
                                                sx={{
                                                    fontSize: "0.49rem",
                                                    color: "#999",
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {formatDate(
                                                    payment.payment_date
                                                )}
                                                {" · "}
                                                {formatTime(
                                                    payment.payment_date
                                                )}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                <Typography
                                    sx={{
                                        fontSize: "0.75rem",
                                        fontWeight: 900,
                                        color: "#222",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {formatAmount(payment.amount)}
                                </Typography>
                            </Box>
                        ))
                    )}
                </Box>

                {/* COLLECTION INFO */}
                <Box
                    sx={{
                        background: "#FFFFFF",
                        border: "1px solid #E3E3DE",
                        borderRadius: "16px",
                        px: 1.3,
                        py: 1.1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.6,
                        }}
                    >
                        <LocalShippingRoundedIcon
                            sx={{
                                fontSize: 14,
                                color: "#777",
                            }}
                        />

                        <Typography
                            sx={{
                                fontSize: "0.55rem",
                                fontWeight: 700,
                                color: "#777",
                            }}
                        >
                            {bill.bill_generated_location}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.45,
                        }}
                    >
                        <CheckCircleRoundedIcon
                            sx={{
                                fontSize: 14,
                                color: "#39834A",
                            }}
                        />

                        <Typography
                            sx={{
                                fontSize: "0.55rem",
                                fontWeight: 800,
                                color: "#39834A",
                            }}
                        >
                            {bill.is_settled === "Y"
                                ? "SETTLED"
                                : "NOT SETTLED"}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default memo(CashCollectionBillDetails);
