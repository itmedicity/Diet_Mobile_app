
import React, { memo } from "react";
import { Box, Typography, Chip } from "@mui/joy";

import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import { formatAmount, formatDate, formatDateTime } from "../../../CommonData/Common";

const FONT = "Bahnschrift";

const AssignedCashCard = ({ bill, onClick }) => {


    const isCompleted =
        bill?.collection_display_status === "COMPLETED";

    const isInProgress =
        bill?.bill_assignment_status === "IN_PROGRESS";


    return (
        <Box
            onClick={() => {
                if (!isCompleted) {
                    onClick?.(bill);
                }
            }}
            sx={{
                background: "#FFFFFF",
                border: "1px solid #E3E3DE",
                borderRadius: "17px",
                px: 1.3,
                py: 1.3,
                mb: 0.9,
                boxSizing: "border-box",
                cursor: isCompleted ? "default" : "pointer",
                fontFamily: FONT,
                transition: "0.2s",

                "&:hover": !isCompleted
                    ? {
                        borderColor: "#891B97",
                        boxShadow:
                            "0 4px 12px rgba(137,27,151,0.08)",
                    }
                    : {},

                "&:active": !isCompleted
                    ? { transform: "scale(0.99)" }
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
                        flex: 1,
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

                    <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                            sx={{
                                fontFamily: FONT,
                                fontSize: "0.69rem",
                                fontWeight: 900,
                                color: "#242424",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {bill?.bill_no || `Bill #${bill?.billing_id}`}
                        </Typography>

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                                mt: 0.25,
                                minWidth: 0,
                            }}
                        >
                            <PersonRoundedIcon
                                sx={{
                                    fontSize: 13,
                                    color: "#8A8A85",
                                    flexShrink: 0,
                                }}
                            />

                            <Typography
                                sx={{
                                    fontFamily: FONT,
                                    fontSize: 16,
                                    fontWeight: 700,
                                    color: "#555",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {bill?.patient_name ||
                                    bill?.patient_id ||
                                    "Patient"}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* STATUS + AMOUNT */}
                <Box
                    sx={{
                        textAlign: "right",
                        flexShrink: 0,
                    }}
                >
                    <Chip
                        size="sm"
                        variant="soft"
                        color={
                            isCompleted
                                ? "success"
                                : isInProgress
                                    ? "primary"
                                    : "warning"
                        }
                        sx={{
                            fontFamily: FONT,
                            fontSize: "0.5rem",
                            fontWeight: 900,
                            minHeight: 20,
                            mb: 0.45,
                        }}
                    >
                        {isCompleted
                            ? "COMPLETED"
                            : isInProgress
                                ? "IN PROGRESS"
                                : "PENDING"}
                    </Chip>

                    <Typography
                        sx={{
                            fontFamily: FONT,
                            fontSize: "0.5rem",
                            color: "#999",
                            fontWeight: 700,
                            textTransform: "uppercase",
                        }}
                    >
                        {isCompleted ? "Collected" : "Amount Due"}
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.1,
                            fontFamily: FONT,
                            fontSize: "0.9rem",
                            fontWeight: 900,
                            color: isCompleted ? "#15803D" : "#891B97",
                        }}
                    >
                        {formatAmount(
                            isCompleted
                                ? bill?.paid_amount
                                : bill?.balance_amount
                        )}
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
                        fontFamily: FONT,
                        fontSize: 12,
                        color: "#8B8B86",
                        fontWeight: 600,
                    }}
                >
                    {bill?.patient_id || "-"}
                </Typography>

                <Typography
                    sx={{
                        fontFamily: FONT,
                        fontSize: "0.53rem",
                        color: "#C0C0BB",
                    }}
                >
                    •
                </Typography>

                <Typography
                    sx={{
                        fontFamily: FONT,
                        fontSize: 12,
                        color: "#8B8B86",
                        fontWeight: 600,
                    }}
                >
                    🛌🏽 {bill?.bed_number || "-"}
                </Typography>

                <Typography
                    sx={{
                        fontFamily: FONT,
                        fontSize: "0.53rem",
                        color: "#C0C0BB",
                    }}
                >
                    •
                </Typography>

                <Typography
                    sx={{
                        fontFamily: FONT,
                        fontSize: 12,
                        color: "#8B8B86",
                        fontWeight: 700,
                    }}
                >
                    {bill?.nurse_station_name || "CANTEEN"}
                </Typography>
            </Box>

            {/* BILL AMOUNTS */}
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
                            fontFamily: FONT,
                            fontSize: "0.5rem",
                            color: "#999",
                            fontWeight: 700,
                        }}
                    >
                        BILL AMOUNT
                    </Typography>

                    <Typography
                        sx={{
                            fontFamily: FONT,
                            mt: 0.2,
                            fontSize: 12,
                            fontWeight: 800,
                            color: "#333",
                        }}
                    >
                        {formatAmount(bill?.total_amount)}
                    </Typography>
                </Box>

                {/* COLLECTED */}
                <Box>
                    <Typography
                        sx={{
                            fontFamily: FONT,
                            fontSize: "0.5rem",
                            color: "#999",
                            fontWeight: 700,
                        }}
                    >
                        COLLECTED
                    </Typography>

                    <Typography
                        sx={{
                            fontFamily: FONT,
                            mt: 0.2,
                            fontSize: 12,
                            fontWeight: 800,
                            color: "#333",
                        }}
                    >
                        {formatAmount(bill?.paid_amount)}
                    </Typography>
                </Box>

                {/* BALANCE */}
                <Box>
                    <Typography
                        sx={{
                            fontFamily: FONT,
                            fontSize: "0.5rem",
                            color: "#999",
                            fontWeight: 700,
                        }}
                    >
                        BALANCE
                    </Typography>

                    <Typography
                        sx={{
                            fontFamily: FONT,
                            mt: 0.2,
                            fontSize: 12,
                            fontWeight: 900,
                            color:
                                Number(bill?.balance_amount || 0) > 0
                                    ? "#891B97"
                                    : "#15803D",
                        }}
                    >
                        {formatAmount(bill?.balance_amount)}
                    </Typography>
                </Box>
            </Box>

            {/* ASSIGNMENT DETAILS */}
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
                <Box sx={{ minWidth: 0 }}>
                    <Typography
                        sx={{
                            fontFamily: FONT,
                            fontSize: "0.5rem",
                            color: "#999",
                            fontWeight: 700,
                        }}
                    >
                        ASSIGNED BY
                    </Typography>

                    <Typography
                        sx={{
                            fontFamily: FONT,
                            mt: 0.15,
                            fontSize: "0.59rem",
                            fontWeight: 800,
                            color: "#444",
                            overflowWrap: "anywhere",
                        }}
                    >
                        {bill?.assigned_by_name || "-"}
                    </Typography>
                </Box>

                <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                    <Typography
                        sx={{
                            fontFamily: FONT,
                            fontSize: "0.5rem",
                            color: "#999",
                            fontWeight: 700,
                        }}
                    >
                        ASSIGNED ON
                    </Typography>

                    <Typography
                        sx={{
                            fontFamily: FONT,
                            mt: 0.15,
                            fontSize: "0.55rem",
                            fontWeight: 700,
                            color: "#555",
                        }}
                    >
                        {formatDate(bill?.assigned_at)}
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
                    gap: 1,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.4,
                        minWidth: 0,
                    }}
                >
                    <PaymentsRoundedIcon
                        sx={{
                            fontSize: 12,
                            color: "#888",
                            flexShrink: 0,
                        }}
                    />

                    <Typography
                        sx={{
                            fontFamily: FONT,
                            fontSize: "0.5rem",
                            color: "#888",
                            fontWeight: 700,
                        }}
                    >
                        {bill?.bill_pay_type || "CASH"}
                    </Typography>

                    <Typography
                        sx={{
                            fontFamily: FONT,
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
                            flexShrink: 0,
                        }}
                    />

                    <Typography
                        sx={{
                            fontFamily: FONT,
                            fontSize: "0.49rem",
                            color: "#999",
                            fontWeight: 600,
                        }}
                    >
                        {formatDateTime(bill?.assigned_at)}
                    </Typography>
                </Box>

                {!isCompleted && (
                    <KeyboardArrowRightRoundedIcon
                        sx={{
                            fontSize: 18,
                            color: "#B5B5B0",
                            flexShrink: 0,
                        }}
                    />
                )}
            </Box>
        </Box>
    );
};

export default memo(AssignedCashCard);
