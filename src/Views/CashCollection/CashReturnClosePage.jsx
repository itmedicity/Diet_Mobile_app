import React, { memo, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    Box,
    Button,
    Divider,
    Input,
    Textarea,
    Typography,
} from "@mui/joy";

import {
    ArrowBackRounded,
    CheckCircleRounded,
    PersonRounded,
    ReceiptLongRounded,
    CurrencyRupeeRounded,
} from "@mui/icons-material";

import {
    usePaymentHistoryBillDetail,
    useReturnLogDetails,
} from "../../CommonData/UseQuery";

import PaymentHistorySkeleton from "./CollectionComponent/PaymentHistorySkeleton";

import {
    EmpauthId,
    errorNofity,
    infoNofity,
    succesNofity,
    warningNofity,
} from "../Constant/Constant";

import { axioslogin } from "../../Axios/axios";
import { useQueryClient } from "@tanstack/react-query";

const CashReturnClosePage = () => {
    const navigate = useNavigate();
    const { billingId, paymentId } = useParams();

    const id = EmpauthId();
    const queryClient = useQueryClient();

    const {
        data: BillDetails = {
            bill: null,
            items: [],
            payments: [],
        },
        isLoading,
    } = usePaymentHistoryBillDetail(billingId);

    /*
     * Return history for this payment.
     *
     * Example:
     *
     * [
     *   {
     *      returned_amount: 20,
     *      returned_by: 168
     *   },
     *   {
     *      returned_amount: 10,
     *      returned_by: 168
     *   }
     * ]
     */
    const {
        data: ReturnLogDetails = [],
    } = useReturnLogDetails(paymentId);

    const {
        bill = null,
        payments = [],
    } = BillDetails;

    const [returnAmount, setReturnAmount] = useState("");
    const [returnRemarks, setReturnRemarks] = useState("");
    const [loading, setLoading] = useState(false);

    /*
     * Find the successful CASH payment for this bill.
     */
    const cashPayment = useMemo(() => {
        return payments?.find(
            (payment) =>
                payment?.payment_mode === "CASH" &&
                payment?.payment_status === "SUCCESS"
        );
    }, [payments]);

    /*
     * Original change amount.
     *
     * Example:
     *
     * Bill Amount      = ₹658
     * Cash Received    = ₹700
     * Original Change  = ₹42
     */
    const actualChangeAmount = Number(
        cashPayment?.change_amount || 0
    );

    /*
     * Calculate TOTAL amount returned from the return history.
     *
     * Example:
     *
     * Return 1 = ₹20
     * Return 2 = ₹10
     *
     * Total Returned = ₹30
     */
    const returnedAmount = useMemo(() => {
        return ReturnLogDetails.reduce(
            (total, item) =>
                total + Number(item?.returned_amount || 0),
            0
        );
    }, [ReturnLogDetails]);

    /*
     * Amount still remaining to be returned.
     *
     * Example:
     *
     * Original Change = ₹50
     * Already Returned = ₹30
     *
     * Remaining = ₹20
     */
    const remainingReturnAmount = Math.max(
        actualChangeAmount - returnedAmount,
        0
    );

    /*
     * Cash actually received from the customer.
     */
    const receivedAmount = Number(
        cashPayment?.received_amount ??
        cashPayment?.amount ??
        0
    );

    /*
     * Total bill amount.
     */
    const billAmount = Number(
        bill?.total_amount || 0
    );

    /*
     * Original calculated change.
     *
     * This is only for verification/display.
     */

    /*
     * If no amount is manually entered,
     * use the CURRENT remaining amount.
     */
    const finalReturnAmount =
        returnAmount === ""
            ? remainingReturnAmount
            : Number(returnAmount || 0);

    /*
     * Format currency amount.
     */
    const formatAmount = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2,
        }).format(Number(amount || 0));
    };

    /*
     * Format date.
     */
    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    /*
     * Handle amount input.
     *
     * Allows maximum 2 decimal places.
     */
    const handleReturnAmountChange = (event) => {
        const value = event.target.value;

        if (value === "") {
            setReturnAmount("");
            return;
        }

        if (!/^\d*\.?\d{0,2}$/.test(value)) {
            return;
        }

        setReturnAmount(value);
    };

    /*
     * Insert the current return into
     * patient_bill_change_return
     *
     * AND update patient_bill_payment.change_status
     *
     * Important:
     *
     * returned_amount sent to backend is ONLY
     * the amount being returned NOW.
     *
     * Example:
     *
     * Already returned = ₹20
     * Current return   = ₹10
     *
     * Send:
     *
     * returned_amount = ₹10
     *
     * NOT ₹30.
     */
    const handleCloseReturn = async () => {

        /*
         * Make sure payment exists.
         */
        if (!cashPayment?.payment_id) {
            return infoNofity(
                "Payment Detail Missing. Please Reload!"
            );
        }

        /*
         * Amount physically being returned NOW.
         */
        const currentReturnAmount = Number(
            finalReturnAmount || 0
        );

        /*
         * Do not allow zero amount.
         */
        if (currentReturnAmount <= 0) {
            return infoNofity(
                "Please enter the Amount to Return"
            );
        }

        /*
         * Prevent returning more than
         * the remaining amount.
         */
        if (currentReturnAmount > remainingReturnAmount) {
            return warningNofity(
                "Returning Amount Exceeds Remaining Change Amount!"
            );
        }

        /*
         * Calculate the amount after this return.
         *
         * Example:
         *
         * Original Change = ₹50
         * Already Returned = ₹20
         * Current Return = ₹30
         *
         * Total = ₹50
         */
        const totalReturnedAmount =
            returnedAmount + currentReturnAmount;

        /*
         * Determine the new status.
         */
        const changeStatus =
            totalReturnedAmount >= actualChangeAmount
                ? "RETURNED"
                : "PENDING";

        /*
         * API payload.
         *
         * IMPORTANT:
         * returned_amount is ONLY the current transaction amount.
         */
        const payload = {
            payment_id: cashPayment?.payment_id,

            change_status: changeStatus,

            returned_by: id,

            returned_amount: currentReturnAmount,

            remarks: returnRemarks?.trim()
                ? returnRemarks.trim()
                : null,
        };

        try {
            setLoading(true);

            /*
             * Insert return transaction
             * and update payment status.
             */
            const response = await axioslogin.patch(
                "/dietdelivery/return-settled",
                payload
            );

            const {
                success,
                message,
            } = response?.data ?? {};

            /*
             * Handle unsuccessful response.
             */
            if (success !== 1) {
                return warningNofity(
                    message ||
                    "Cash Return Settlement Failed!"
                );
            }

            /*
             * Success message.
             */
            succesNofity(
                changeStatus === "RETURNED"
                    ? "Successfully Returned the Amount!"
                    : "Partial Amount Returned Successfully!"
            );

            /*
             * Refresh pending return list.
             */
            await queryClient.invalidateQueries({
                queryKey: ["payment-return", id],
            });

            /*
             * Go back to cash return list.
             */
            navigate("/cash-collection/return");

        } catch (error) {
            console.error(
                "Error in Performing Amount Returning Process!",
                error
            );

            errorNofity(
                "Error in Returning Amount Process!"
            );
        } finally {
            setLoading(false);
        }
    };

    /*
     * Loading state.
     */
    if (isLoading) {
        return <PaymentHistorySkeleton />;
    }

    /*
     * Bill not found.
     */
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

            {/* HEADER */}
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
                        px: {
                            xs: 1.5,
                            sm: 2.5,
                        },
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
                            <ArrowBackRounded
                                sx={{
                                    fontSize: 19,
                                    color: "#333",
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
                                CASH RETURN CLOSING
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

            {/* CONTENT */}
            <Box
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    px: {
                        xs: 1.5,
                        sm: 2.5,
                    },
                    py: 1.5,
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        maxWidth: "480px",
                        mx: "auto",
                        pb: 3,
                    }}
                >

                    {/* CUSTOMER */}
                    <Box
                        sx={{
                            background: "#FFFFFF",
                            border: "1px solid #E2E2DD",
                            borderRadius: "16px",
                            p: 1.5,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mb: 1.3,
                            }}
                        >
                            <Box
                                sx={{
                                    width: 34,
                                    height: 34,
                                    borderRadius: "10px",
                                    background: "#F1F1ED",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <PersonRounded
                                    sx={{
                                        fontSize: 19,
                                        color: "#555",
                                    }}
                                />
                            </Box>

                            <Box>
                                <Typography
                                    sx={{
                                        fontSize: "0.62rem",
                                        fontWeight: 800,
                                        color: "#8A8A85",
                                    }}
                                >
                                    CUSTOMER
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: "0.88rem",
                                        fontWeight: 900,
                                        color: "#202020",
                                    }}
                                >
                                    {bill.patient_name || "-"}
                                </Typography>
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: 1,
                            }}
                        >
                            <Box>
                                <Typography
                                    sx={{
                                        fontSize: "0.58rem",
                                        color: "#999",
                                        fontWeight: 700,
                                    }}
                                >
                                    PATIENT ID
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: "0.7rem",
                                        fontWeight: 800,
                                        color: "#333",
                                    }}
                                >
                                    {bill.patient_id || "-"}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography
                                    sx={{
                                        fontSize: "0.58rem",
                                        color: "#999",
                                        fontWeight: 700,
                                    }}
                                >
                                    PARTY
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: "0.7rem",
                                        fontWeight: 800,
                                        color: "#333",
                                    }}
                                >
                                    {bill.party_name || "-"}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* BILL SUMMARY */}
                    <Box
                        sx={{
                            mt: 1.2,
                            background: "#FFFFFF",
                            border: "1px solid #E2E2DD",
                            borderRadius: "16px",
                            overflow: "hidden",
                        }}
                    >
                        <Box
                            sx={{
                                p: 1.5,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                            }}
                        >
                            <ReceiptLongRounded
                                sx={{
                                    fontSize: 20,
                                    color: "#555",
                                }}
                            />

                            <Typography
                                sx={{
                                    fontSize: "0.72rem",
                                    fontWeight: 900,
                                    color: "#222",
                                }}
                            >
                                BILL SUMMARY
                            </Typography>
                        </Box>

                        <Divider />

                        <Box sx={{ p: 1.5 }}>

                            <SummaryRow
                                label="Bill Amount"
                                value={formatAmount(
                                    billAmount
                                )}
                            />

                            <SummaryRow
                                label="Cash Received"
                                value={formatAmount(
                                    receivedAmount
                                )}
                            />

                            <SummaryRow
                                label="Paid Amount"
                                value={formatAmount(
                                    Number(
                                        cashPayment?.amount || 0
                                    )
                                )}
                            />

                            <SummaryRow
                                label="Original Change"
                                value={formatAmount(
                                    actualChangeAmount
                                )}
                            />

                            {returnedAmount > 0 && (
                                <SummaryRow
                                    label="Already Returned"
                                    value={formatAmount(
                                        returnedAmount
                                    )}
                                />
                            )}

                            <Divider sx={{ my: 1.2 }} />

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent:
                                        "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: "0.72rem",
                                        fontWeight: 900,
                                        color: "#222",
                                    }}
                                >
                                    REMAINING RETURN
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: "1rem",
                                        fontWeight: 900,
                                        color:
                                            remainingReturnAmount > 0
                                                ? "#B45309"
                                                : "#16803C",
                                    }}
                                >
                                    {formatAmount(
                                        remainingReturnAmount
                                    )}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* RETURN HISTORY */}
                    {ReturnLogDetails?.length > 0 && (
                        <Box
                            sx={{
                                mt: 1.2,
                                background: "#FFFFFF",
                                border: "1px solid #E2E2DD",
                                borderRadius: "16px",
                                p: 1.5,
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: "0.72rem",
                                    fontWeight: 900,
                                    color: "#222",
                                    mb: 1,
                                }}
                            >
                                RETURN HISTORY
                            </Typography>

                            {
                                ReturnLogDetails?.map(
                                    (item, index) => (
                                        <Box
                                            key={
                                                item?.return_id ||
                                                index
                                            }
                                            sx={{
                                                py: 0.9,
                                                borderTop:
                                                    index > 0
                                                        ? "1px solid #EEEEEA"
                                                        : "none",
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    alignItems:
                                                        "center",
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize:
                                                            "0.65rem",
                                                        fontWeight: 800,
                                                        color: "#555",
                                                    }}
                                                >
                                                    Return #
                                                    {index + 1}
                                                </Typography>

                                                <Typography
                                                    sx={{
                                                        fontSize:
                                                            "0.7rem",
                                                        fontWeight: 900,
                                                        color:
                                                            "#16803C",
                                                    }}
                                                >
                                                    {formatAmount(
                                                        item?.returned_amount
                                                    )}
                                                </Typography>
                                            </Box>

                                            <Typography
                                                sx={{
                                                    mt: 0.25,
                                                    fontSize:
                                                        "0.52rem",
                                                    color: "#999",
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {formatDate(
                                                    item?.returned_at
                                                )}
                                                {" · Employee "}
                                                {item?.em_name ||
                                                    "-"}
                                            </Typography>

                                            {item?.remarks && (
                                                <Typography
                                                    sx={{
                                                        mt: 0.35,
                                                        fontSize:
                                                            "0.55rem",
                                                        color: "#777",
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    {item.remarks}
                                                </Typography>
                                            )}
                                        </Box>
                                    )
                                )}
                        </Box>
                    )}

                    {/* CASH RETURN */}
                    <Box
                        sx={{
                            mt: 1.2,
                            background: "#FFFFFF",
                            border: "1px solid #E2E2DD",
                            borderRadius: "16px",
                            p: 1.5,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mb: 1.5,
                            }}
                        >
                            <CurrencyRupeeRounded
                                sx={{
                                    fontSize: 20,
                                    color: "#555",
                                }}
                            />

                            <Box>
                                <Typography
                                    sx={{
                                        fontSize: "0.72rem",
                                        fontWeight: 900,
                                        color: "#222",
                                    }}
                                >
                                    CASH RETURN
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 0.25,
                                        fontSize: "0.58rem",
                                        color: "#999",
                                        fontWeight: 700,
                                    }}
                                >
                                    Enter the amount physically
                                    returned to the customer
                                </Typography>
                            </Box>
                        </Box>

                        <Typography
                            sx={{
                                fontSize: "0.63rem",
                                fontWeight: 800,
                                color: "#555",
                                mb: 0.6,
                            }}
                        >
                            AMOUNT TO RETURN
                        </Typography>

                        <Input
                            value={returnAmount}
                            onChange={
                                handleReturnAmountChange
                            }
                            startDecorator={
                                <Typography
                                    sx={{
                                        fontWeight: 900,
                                        color: "#555",
                                    }}
                                >
                                    ₹
                                </Typography>
                            }
                            placeholder={remainingReturnAmount.toFixed(
                                2
                            )}
                            type="text"
                            slotProps={{
                                input: {
                                    inputMode: "decimal",
                                },
                            }}
                            sx={{
                                "--Input-radius": "12px",
                                "--Input-minHeight": "48px",
                                fontSize: "1rem",
                                fontWeight: 900,
                                background: "#FAFAF8",
                            }}
                        />

                        {/* RETURN PROGRESS */}
                        <Box
                            sx={{
                                mt: 1,
                                px: 1.1,
                                py: 0.9,
                                borderRadius: "10px",
                                background: "#F7F7F5",
                                display: "flex",
                                justifyContent:
                                    "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Box>
                                <Typography
                                    sx={{
                                        fontSize: "0.6rem",
                                        fontWeight: 700,
                                        color: "#777",
                                    }}
                                >
                                    REMAINING RETURN
                                </Typography>

                                {returnedAmount > 0 && (
                                    <Typography
                                        sx={{
                                            mt: 0.2,
                                            fontSize: "0.5rem",
                                            color: "#999",
                                            fontWeight: 600,
                                        }}
                                    >
                                        Already returned{" "}
                                        {formatAmount(
                                            returnedAmount
                                        )}
                                    </Typography>
                                )}
                            </Box>

                            <Typography
                                sx={{
                                    fontSize: "0.72rem",
                                    fontWeight: 900,
                                    color: "#333",
                                }}
                            >
                                {formatAmount(
                                    remainingReturnAmount
                                )}
                            </Typography>
                        </Box>

                        {/* CURRENT RETURN */}
                        <Box
                            sx={{
                                mt: 1.5,
                                p: 1.2,
                                borderRadius: "12px",
                                background:
                                    finalReturnAmount ===
                                        remainingReturnAmount
                                        ? "#F0F8F2"
                                        : "#FFF8E8",
                                border:
                                    finalReturnAmount ===
                                        remainingReturnAmount
                                        ? "1px solid #D7EBD9"
                                        : "1px solid #F0DDA8",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: "0.62rem",
                                    fontWeight: 800,
                                    color: "#666",
                                }}
                            >
                                CURRENT RETURN
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.2,
                                    fontSize: "1.3rem",
                                    fontWeight: 900,
                                    color: "#222",
                                }}
                            >
                                {formatAmount(
                                    finalReturnAmount
                                )}
                            </Typography>
                        </Box>

                        {/* RETURN REMARK */}
                        <Typography
                            sx={{
                                mt: 1.5,
                                mb: 0.6,
                                fontSize: "0.63rem",
                                fontWeight: 800,
                                color: "#555",
                            }}
                        >
                            RETURN REMARK
                        </Typography>

                        <Textarea
                            value={returnRemarks}
                            onChange={(event) =>
                                setReturnRemarks(
                                    event.target.value
                                )
                            }
                            placeholder="Enter a remark about the cash return..."
                            minRows={3}
                            maxRows={5}
                            sx={{
                                "--Textarea-radius": "12px",
                                fontSize: "0.72rem",
                                fontWeight: 600,
                                background: "#FAFAF8",
                            }}
                        />

                        {/* CONFIRM BUTTON */}
                        <Button
                            fullWidth
                            startDecorator={
                                <CheckCircleRounded
                                    sx={{ fontSize: 19 }}
                                />
                            }
                            loading={loading}
                            disabled={
                                loading ||
                                finalReturnAmount <= 0 ||
                                remainingReturnAmount <= 0
                            }
                            onClick={handleCloseReturn}
                            sx={{
                                mt: 1.5,
                                minHeight: 46,
                                borderRadius: "12px",
                                fontSize: "0.72rem",
                                fontWeight: 900,
                            }}
                        >
                            CONFIRM CASH RETURN
                        </Button>
                    </Box>

                    {/* PAYMENT INFO */}
                    {cashPayment && (
                        <Box
                            sx={{
                                mt: 1.2,
                                px: 1,
                                py: 0.8,
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: "0.55rem",
                                    color: "#999",
                                    fontWeight: 700,
                                    textAlign: "center",
                                }}
                            >
                                Cash payment collected on{" "}
                                {formatDate(
                                    cashPayment.payment_date
                                )}
                            </Typography>
                        </Box>
                    )}

                </Box>
            </Box>
        </Box>
    );
};

/*
 * Reusable summary row.
 */
const SummaryRow = ({ label, value }) => {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
            }}
        >
            <Typography
                sx={{
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    color: "#888",
                }}
            >
                {label}
            </Typography>

            <Typography
                sx={{
                    fontSize: "0.7rem",
                    fontWeight: 900,
                    color: "#333",
                }}
            >
                {value}
            </Typography>
        </Box>
    );
};

export default memo(CashReturnClosePage);
