
import React, { memo } from "react";
import { Box, Typography } from "@mui/joy";

import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";

const CashReturnCard = ({ payment, onClick }) => {

    const formatAmount = (amount) =>
        `₹${Number(amount || 0).toFixed(3)}`;

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatTime = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    /*
     * These values are already calculated by the backend.
     *
     * change_amount    = Original change amount
     * returned_amount  = Total amount returned so far
     * remaining_amount = Amount still to be returned
     */
    const changeAmount = Number(
        payment?.change_amount || 0
    );

    const returnedAmount = Number(
        payment?.returned_amount || 0
    );

    const remainingAmount = Number(
        payment?.remaining_amount || 0
    );

    return (
        <Box
            onClick={() => onClick?.(payment)}
            sx={{
                background: "#FFFFFF",
                border: "1px solid #E3E3DE",
                borderRadius: "17px",
                px: 1.3,
                py: 1.3,
                mb: 0.9,
                boxSizing: "border-box",
                cursor: onClick ? "pointer" : "default",
                transition: "0.2s",

                "&:hover": onClick
                    ? {
                        borderColor: "#891b97",
                        boxShadow:
                            "0 4px 12px rgba(137,27,151,0.08)",
                    }
                    : {},
            }}
        >

            {/* HEADER */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 1,
                }}
            >

                {/* BILL + PATIENT */}
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

                    <Box sx={{ minWidth: 0 }}>
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
                            {payment?.bill_no}
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
                                {payment?.patient_name}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* REMAINING RETURN */}
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
                        Remaining Return
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.1,
                            fontSize: "0.9rem",
                            fontWeight: 900,
                            color: "#891b97",
                        }}
                    >
                        {formatAmount(remainingAmount)}
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
                    {payment?.patient_id}
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
                    Admission: {payment?.admission_id}
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
                    {payment?.party_name}
                </Typography>
            </Box>

            {/* PAYMENT DETAILS */}
            <Box
                sx={{
                    mt: 1.1,
                    pt: 1,
                    borderTop: "1px solid #EEEEEA",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 0.8,
                }}
            >

                {/* BILL AMOUNT */}
                <Box>
                    <Typography
                        sx={{
                            fontSize: "0.5rem",
                            color: "#999",
                            fontWeight: 700,
                        }}
                    >
                        BILL AMOUNT
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.2,
                            fontSize: "0.68rem",
                            fontWeight: 800,
                            color: "#333",
                        }}
                    >
                        {formatAmount(payment?.bill_paid_amount)}
                    </Typography>
                </Box>

                {/* CASH RECEIVED */}
                <Box>
                    <Typography
                        sx={{
                            fontSize: "0.5rem",
                            color: "#999",
                            fontWeight: 700,
                        }}
                    >
                        CASH RECEIVED
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.2,
                            fontSize: "0.68rem",
                            fontWeight: 800,
                            color: "#333",
                        }}
                    >
                        {formatAmount(payment?.received_amount)}
                    </Typography>
                </Box>

                {/* RETURNED */}
                <Box>
                    <Typography
                        sx={{
                            fontSize: "0.5rem",
                            color: "#999",
                            fontWeight: 700,
                        }}
                    >
                        RETURNED
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.2,
                            fontSize: "0.68rem",
                            fontWeight: 900,
                            color: "#555",
                        }}
                    >
                        {formatAmount(returnedAmount)}
                    </Typography>
                </Box>
            </Box>

            {/* RETURN SUMMARY */}
            <Box
                sx={{
                    mt: 0.9,
                    pt: 0.8,
                    borderTop: "1px solid #EEEEEA",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.6,
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: "0.5rem",
                            color: "#999",
                            fontWeight: 700,
                        }}
                    >
                        ORIGINAL CHANGE
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: "0.55rem",
                            fontWeight: 900,
                            color: "#333",
                        }}
                    >
                        {formatAmount(changeAmount)}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.6,
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: "0.5rem",
                            color: "#999",
                            fontWeight: 700,
                        }}
                    >
                        REMAINING
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: "0.55rem",
                            fontWeight: 900,
                            color: "#891b97",
                        }}
                    >
                        {formatAmount(remainingAmount)}
                    </Typography>
                </Box>
            </Box>

            {/* FOOTER */}
            <Box
                sx={{
                    mt: 0.9,
                    pt: 0.8,
                    borderTop: "1px solid #EEEEEA",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.4,
                    }}
                >
                    <PaymentsRoundedIcon
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
                        {payment?.payment_mode}
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: "0.5rem",
                            color: "#C0C0BB",
                            mx: 0.2,
                        }}
                    >
                        •
                    </Typography>

                    <AccessTimeRoundedIcon
                        sx={{
                            fontSize: 11,
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
                        {formatDate(payment?.payment_date)}
                        {" · "}
                        {formatTime(payment?.payment_date)}
                    </Typography>
                </Box>

                <KeyboardArrowRightRoundedIcon
                    sx={{
                        fontSize: 18,
                        color: "#B5B5B0",
                    }}
                />
            </Box>

        </Box>
    );
};

export default memo(CashReturnCard);
