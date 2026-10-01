import React, { memo } from "react";
import { Box, Typography } from "@mui/joy";

import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import { useNavigate } from "react-router-dom";

const PaymentHistoryBillCard = ({
    bill,
    formatAmount,
    formatDate,
    formatTime,
}) => {


    const billPaid =
        bill?.payments?.
            reduce((total, payment) => total + Number(payment?.amount || 0), 0);

    const navigate = useNavigate();

    return (
        <Box
            onClick={() => navigate(`/cash-collection/bill/${bill.billing_id}`)}
            sx={{
                background: "#FFFFFF",
                border: "1px solid #E3E3DE",
                borderRadius: "17px",
                px: 1.3,
                py: 1.3,
                mb: 0.9,
                boxSizing: "border-box",
            }}
        >
            {/* BILL HEADER */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 1,
                }}
            >
                {/* BILL INFO */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        minWidth: 0,
                    }}
                >
                    <Box
                        sx={{
                            width: 38,
                            height: 38,
                            borderRadius: "11px",
                            background: "#F3F3F0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                        }}
                    >
                        <ReceiptLongRoundedIcon
                            sx={{
                                fontSize: 19,
                                color: "#303030",
                            }}
                        />
                    </Box>

                    <Box
                        sx={{
                            minWidth: 0,
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: "0.69rem",
                                fontWeight: 900,
                                color: "#242424",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {bill.bill_no}
                        </Typography>

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                                mt: 0.25,
                            }}
                        >
                            <PersonRoundedIcon
                                sx={{
                                    fontSize: 13,
                                    color: "#8A8A85",
                                }}
                            />

                            <Typography
                                sx={{
                                    fontSize: "0.59rem",
                                    fontWeight: 700,
                                    color: "#555",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                {bill.patient_name}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* TOTAL PAID */}
                <Box
                    sx={{
                        textAlign: "right",
                        flexShrink: 0,
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: "0.52rem",
                            color: "#999",
                            fontWeight: 700,
                            textTransform: "uppercase",
                        }}
                    >
                        Paid
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.1,
                            fontSize: "0.86rem",
                            fontWeight: 900,
                            color: "#171717",
                        }}
                    >
                        {formatAmount(billPaid)}
                    </Typography>
                </Box>
            </Box>

            {/* PATIENT DETAILS */}
            <Box
                sx={{
                    mt: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.8,
                    flexWrap: "wrap",
                }}
            >
                <Typography
                    sx={{
                        fontSize: "0.53rem",
                        color: "#8B8B86",
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
                        color: "#8B8B86",
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
                        color: "#8B8B86",
                        fontWeight: 700,
                    }}
                >
                    {bill.party_name}
                </Typography>
            </Box>

            {/* PAYMENT PORTIONS */}
            <Box
                sx={{
                    mt: 1.1,
                    pt: 1,
                    borderTop: "1px solid #EEEEEA",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 0.55,
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: "0.57rem",
                            color: "#777",
                            fontWeight: 800,
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                        }}
                    >
                        Payment Details
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: "0.53rem",
                            color: "#999",
                            fontWeight: 600,
                        }}
                    >
                        {bill.payments.length}{" "}
                        {bill.payments.length === 1
                            ? "payment"
                            : "payments"}
                    </Typography>
                </Box>

                {bill.payments?.map((payment) => (
                    <Box
                        key={payment.payment_id}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            py: 0.65,
                        }}
                    >
                        {/* PAYMENT MODE */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.8,
                            }}
                        >
                            <Box
                                sx={{
                                    width: 25,
                                    height: 25,
                                    borderRadius: "8px",
                                    background: "#F5F5F2",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                }}
                            >
                                <AccountBalanceWalletRoundedIcon
                                    sx={{
                                        fontSize: 13,
                                        color: "#555",
                                    }}
                                />
                            </Box>

                            <Box>
                                <Typography
                                    sx={{
                                        fontSize: "0.61rem",
                                        fontWeight: 800,
                                        color: "#333",
                                    }}
                                >
                                    {payment.payment_mode}
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 0.1,
                                        fontSize: "0.49rem",
                                        color: "#999",
                                        fontWeight: 600,
                                    }}
                                >
                                    Payment #{payment.payment_id}
                                </Typography>
                            </Box>
                        </Box>

                        {/* PAYMENT AMOUNT */}
                        <Box
                            sx={{
                                textAlign: "right",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: "0.72rem",
                                    fontWeight: 900,
                                    color: "#1B1B1B",
                                }}
                            >
                                {formatAmount(payment.amount)}
                            </Typography>

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "flex-end",
                                    gap: 0.3,
                                }}
                            >
                                <AccessTimeRoundedIcon
                                    sx={{
                                        fontSize: 10,
                                        color: "#A0A09B",
                                    }}
                                />

                                <Typography
                                    sx={{
                                        fontSize: "0.49rem",
                                        color: "#999",
                                        fontWeight: 600,
                                    }}
                                >
                                    {formatDate(payment.payment_date)}
                                    {" · "}
                                    {formatTime(payment.payment_date)}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                ))}
            </Box>

            {/* FOOTER */}
            <Box
                sx={{
                    mt: 0.8,
                    pt: 0.8,
                    borderTop: "1px solid #EEEEEA",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                {/* LOCATION */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.4,
                    }}
                >
                    <LocalShippingRoundedIcon
                        sx={{
                            fontSize: 12,
                            color: "#888",
                        }}
                    />

                    <Typography
                        sx={{
                            fontSize: "0.5rem",
                            color: "#888",
                            fontWeight: 700,
                        }}
                    >
                        {bill.collected_location}
                    </Typography>
                </Box>

                {/* STATUS */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.35,
                    }}
                >
                    <CheckCircleRoundedIcon
                        sx={{
                            fontSize: 12,
                            color: "#3B8B4C",
                        }}
                    />

                    <Typography
                        sx={{
                            fontSize: "0.5rem",
                            color: "#3B7D47",
                            fontWeight: 800,
                        }}
                    >
                        COLLECTED
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default memo(PaymentHistoryBillCard);
