import React, { memo, useMemo, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    Box,
    Button,
    Divider,
    Input,
    Typography,
} from "@mui/joy";

import {
    ArrowBackRounded,
    ReceiptLongRounded,
    PersonRounded,
    PaymentsRounded,
    AccountBalanceWalletRounded,
    CheckCircleRounded,
    QrCode2Rounded,
    LocalShippingRounded,
} from "@mui/icons-material";

import {
    useAssignedBillDetails,
    useGetBillingDetails,
} from "../../CommonData/UseQuery";

import {
    EmpauthId,
    succesNofity,
    warningNofity,
} from "../Constant/Constant";
import InfoCard from "./CollectionComponent/InfoCard";
import { DELIVERY_STATUS_COLORS, formatAmount, formatDate, formatDateTime } from "../../CommonData/Common";
import { axioslogin } from "../../Axios/axios";

const PURPLE = "#7C13EC";
const FONT = "Bahnschrift";



const SummaryRow = memo(({ label, value, strong = false }) => (
    <Box
        sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            py: 0.75,
        }}
    >
        <Typography
            sx={{
                fontFamily: FONT,
                fontSize: "0.7rem",
                fontWeight: 600,
                color: "#777",
            }}
        >
            {label}
        </Typography>

        <Typography
            sx={{
                fontFamily: FONT,
                fontSize: "0.75rem",
                fontWeight: strong ? 900 : 700,
                color: strong ? PURPLE : "#333",
                textAlign: "right",
                overflowWrap: "anywhere",
            }}
        >
            {value ?? "-"}
        </Typography>
    </Box>
));


const BillItemRow = memo(({ item, index }) => {
    const status = String(
        item.item_delivery_status ||
        item.delivery_log_status ||
        "UNKNOWN"
    ).toUpperCase();

    const colors =
        DELIVERY_STATUS_COLORS[status] ||
        DELIVERY_STATUS_COLORS.UNKNOWN;

    const deliveredTime =
        formatDateTime(item.delivered_at) ||
        formatDateTime(item.delivered_time);

    return (
        <React.Fragment>
            {index > 0 && <Divider sx={{ my: 1.3 }} />}

            <Box>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 1,
                    }}
                >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                            sx={{
                                fontFamily: FONT,
                                fontSize: "0.78rem",
                                fontWeight: 900,
                                color: "#292929",
                                overflowWrap: "anywhere",
                            }}
                        >
                            {item.item_name ||
                                item.description ||
                                "Bill Item"}
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.4,
                                fontFamily: FONT,
                                fontSize: "0.64rem",
                                color: "#888",
                            }}
                        >
                            Qty: {Number(item.quantity || 0)}
                            {" × "}
                            {formatAmount(item.rate)}
                        </Typography>

                        {Number(item.gst_amount || 0) > 0 && (
                            <Typography
                                sx={{
                                    mt: 0.25,
                                    fontFamily: FONT,
                                    fontSize: "0.62rem",
                                    color: "#999",
                                }}
                            >
                                GST: {formatAmount(item.gst_amount)}
                            </Typography>
                        )}
                    </Box>

                    <Typography
                        sx={{
                            fontFamily: FONT,
                            fontSize: "0.8rem",
                            fontWeight: 900,
                            color: "#292929",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {formatAmount(item.amount)}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        mt: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 1,
                        flexWrap: "wrap",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.6,
                        }}
                    >
                        <LocalShippingRounded
                            sx={{
                                fontSize: 16,
                                color: "#777",
                            }}
                        />

                        <Typography
                            sx={{
                                fontFamily: FONT,
                                fontSize: "0.65rem",
                                color: "#777",
                            }}
                        >
                            Delivery status
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            px: 1,
                            py: 0.4,
                            borderRadius: "7px",
                            bgcolor: colors.bg,
                        }}
                    >
                        <Typography
                            sx={{
                                fontFamily: FONT,
                                fontSize: "0.62rem",
                                fontWeight: 900,
                                color: colors.color,
                            }}
                        >
                            {status.replace(/_/g, " ")}
                        </Typography>
                    </Box>
                </Box>

                {deliveredTime && (
                    <Typography
                        sx={{
                            mt: 0.6,
                            fontFamily: FONT,
                            fontSize: "0.62rem",
                            color: "#999",
                        }}
                    >
                        Delivery time: {deliveredTime}
                    </Typography>
                )}

                {item.delivery_remarks && (
                    <Typography
                        sx={{
                            mt: 0.4,
                            fontFamily: FONT,
                            fontSize: "0.63rem",
                            color: "#777",
                            overflowWrap: "anywhere",
                        }}
                    >
                        Remarks: {item.delivery_remarks}
                    </Typography>
                )}
            </Box>
        </React.Fragment>
    );
});

const CashCollectionPage = () => {

    const navigate = useNavigate();

    const { billingId } = useParams();

    const employeeId = EmpauthId();

    const {
        data: assignedBills = [],
        isLoading: assignedBillsLoading,
        isError: assignedBillsError,
    } = useAssignedBillDetails(employeeId);

    const {
        data: billingDetailsResponse = [],
        isLoading: billingDetailsLoading,
        isError: billingDetailsError,
    } = useGetBillingDetails(billingId);

    const [paymentMethod, setPaymentMethod] = useState("CASH");
    const [cashAmount, setCashAmount] = useState("");
    const [upiTransactionId, setUpiTransactionId] = useState("");

    const [loading, setLoading] = useState(false);

    const bill = useMemo(() => {
        const bills = Array.isArray(assignedBills)
            ? assignedBills
            : Array.isArray(assignedBills?.data)
                ? assignedBills.data
                : [];

        return (
            bills.find(
                (item) =>
                    Number(item?.billing_id) === Number(billingId)
            ) || null
        );
    }, [assignedBills, billingId]);

    /*
     * Normalize billing detail API response and remove duplicate
     * billing_detail_id values caused by multiple delivery-log rows.
     */
    const billingItems = useMemo(() => {
        const response = Array.isArray(billingDetailsResponse)
            ? billingDetailsResponse
            : Array.isArray(billingDetailsResponse?.data)
                ? billingDetailsResponse.data
                : [];

        const uniqueItems = new Map();

        response.forEach((item) => {
            const key = item.billing_detail_id;

            if (key == null) return;

            const existing = uniqueItems.get(key);

            if (!existing) {
                uniqueItems.set(key, item);
                return;
            }

            // Prefer a record with a delivery status and delivery time.
            const existingHasDetails = Boolean(
                existing.delivery_id ||
                existing.item_delivery_status ||
                existing.delivery_log_status
            );

            const itemHasDetails = Boolean(
                item.delivery_id ||
                item.item_delivery_status ||
                item.delivery_log_status
            );

            if (!existingHasDetails && itemHasDetails) {
                uniqueItems.set(key, item);
            } else if (
                !existing.delivered_time &&
                item.delivered_time
            ) {
                uniqueItems.set(key, item);
            }
        });

        return Array.from(uniqueItems.values());
    }, [billingDetailsResponse]);

    const billAmount = Number(bill?.total_amount || 0);
    const alreadyPaid = Number(bill?.paid_amount || 0);

    const balanceAmount = Number(
        bill?.balance_amount ?? billAmount - alreadyPaid
    );

    const receivedAmount = Number(cashAmount || 0);

    const changeAmount = Math.max(
        receivedAmount - balanceAmount,
        0
    );

    const isCompleted =
        bill?.collection_display_status === "COMPLETED" ||
        bill?.bill_assignment_status === "COMPLETED";

    const handleCashAmountChange = useCallback((event) => {
        const value = event.target.value;

        if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
            setCashAmount(value);
        }
    }, []);

    /*
     * Validation only. Connect this to your collection API
     * when the backend endpoint is ready.
     */
    const handleCollectPayment = useCallback(async () => {
        if (!bill) {
            return warningNofity("Bill details not found");
        }

        if (isCompleted) {
            return warningNofity(
                "This collection has already been completed"
            );
        }

        if (!Number.isFinite(balanceAmount) || balanceAmount <= 0) {
            return warningNofity(
                "This bill has no outstanding balance"
            );
        }

        if (!paymentMethod) {
            return warningNofity("Please select payment method");
        }

        const isCash = paymentMethod === "CASH";
        const isUpi = paymentMethod === "UPI";

        /* VALIDATE CASH */

        if (isCash) {
            if (!cashAmount.trim() || receivedAmount <= 0) {
                return warningNofity(
                    "Enter the cash received amount"
                );
            }

            if (receivedAmount < balanceAmount) {
                return warningNofity(
                    `Cash received cannot be less than ${formatAmount(balanceAmount)}`
                );
            }
        }

        /* VALIDATE UPI */

        if (isUpi) {
            if (!upiTransactionId.trim()) {
                return warningNofity(
                    "Enter the UPI transaction ID"
                );
            }

            if (
                !/^[A-Za-z0-9]{12,35}$/.test(
                    upiTransactionId.trim()
                )
            ) {
                return warningNofity(
                    "Enter a valid UPI transaction ID"
                );
            }
        }

        /* PREPARE OUTSTANDING BILL ITEMS */

        const paymentsItems = billingItems
            .map((item) => {
                const itemStatus = String(
                    item.bill_item_status ||
                    item.item_status ||
                    ""
                ).toUpperCase();

                const originalAmount = Number(item.amount || 0);
                const alreadyPaidAmount = Number(
                    item.paid_amount || 0
                );

                const outstandingItemAmount =
                    item.balance_amount != null
                        ? Number(item.balance_amount)
                        : Math.max(
                            originalAmount - alreadyPaidAmount,
                            0
                        );

                return {
                    billing_detail_id: Number(
                        item.billing_detail_id
                    ),
                    paid_amount: Number(
                        outstandingItemAmount.toFixed(2)
                    ),
                    itemStatus,
                };
            })
            .filter(
                (item) =>
                    item.billing_detail_id > 0 &&
                    item.paid_amount > 0 &&
                    item.itemStatus !== "PAID"
            )
            .map(({ billing_detail_id, paid_amount }) => ({
                billing_detail_id,
                paid_amount,
            }));

        if (!paymentsItems.length) {
            return warningNofity(
                "No outstanding billing items available"
            );
        }

        /* VALIDATE ITEM TOTAL AGAINST BILL BALANCE */

        const itemTotal = Number(
            paymentsItems
                .reduce(
                    (sum, item) => sum + item.paid_amount,
                    0
                )
                .toFixed(2)
        );

        const paymentAmount = Number(balanceAmount.toFixed(2));

        if (itemTotal !== paymentAmount) {
            console.error("Collection amount mismatch:", {
                itemTotal,
                paymentAmount,
                paymentsItems,
            });

            return warningNofity(
                "Billing item balances do not match the outstanding bill amount. Please refresh the bill."
            );
        }

        /* PREPARE ONE PAYMENT FOR THIS BILL */

        const payments = [
            {
                billing_id: Number(bill.billing_id),
                amount: paymentAmount,
                payment_mode: paymentMethod,
                collected_by: Number(employeeId),
                collected_location: "DELIVERY",
                remarks: null,
                transaction_id: isUpi
                    ? upiTransactionId.trim()
                    : null,
                items: paymentsItems,
            },
        ];

        /* FINAL API PAYLOAD */

        const payload = {
            amount: paymentAmount,
            payment_mode: paymentMethod,
            collected_by: Number(employeeId),
            collected_location: "DELIVERY",

            transaction_id: isUpi
                ? upiTransactionId.trim()
                : null,

            received_amount: isCash
                ? Number(receivedAmount.toFixed(2))
                : null,

            change_amount: isCash
                ? Number(changeAmount.toFixed(2))
                : null,

            change_status:
                isCash && changeAmount > 0
                    ? "PENDING"
                    : null,

            remarks: "Collection payment",
            payments,
        };

        /* CALL PAYMENT API */

        try {
            setLoading(true);

            const response = await axioslogin.post(
                "/dietdelivery/billing/payment",
                payload
            );

            const {
                success,
                message,
                data,
            } = response?.data || {};

            if (success !== 1) {
                return warningNofity(
                    message || "Unable to collect payment"
                );
            }

            succesNofity(
                message || "Payment collected successfully"
            );

            navigate("/diet/payment/success", {
                state: {
                    amount: paymentAmount,

                    transactionId: isUpi
                        ? upiTransactionId.trim()
                        : null,

                    paymentMethod,

                    paymentDate: new Date().toLocaleString(
                        "en-IN"
                    ),

                    payerName:
                        bill?.fb_ptc_name ||
                        bill?.patient_name ||
                        "-",

                    payermobile:
                        bill?.fb_ptc_mobile ||
                        bill?.patient_mobile ||
                        "-",

                    referenceNo: isUpi
                        ? upiTransactionId.trim()
                        : null,

                    title: "Payment Successful!",

                    message:
                        "Your collection has been recorded successfully.",

                    buttonText: "Back to Collection",

                    payments,
                    customer: bill,
                    paymentData: data,
                },
            });
        } catch (error) {
            console.error(
                "Collection Payment Error:",
                error
            );

            warningNofity(
                error?.response?.data?.message ||
                "Unable to process collection payment"
            );
        } finally {
            setLoading(false);
        }
    }, [
        bill,
        isCompleted,
        balanceAmount,
        paymentMethod,
        cashAmount,
        receivedAmount,
        upiTransactionId,
        billingItems,
        employeeId,
        changeAmount,
        navigate,
    ]);

    const pageLoading =
        assignedBillsLoading || billingDetailsLoading;

    if (pageLoading) {
        return (
            <Box
                sx={{
                    minHeight: "100dvh",
                    bgcolor: "#F7F7F5",
                    p: 2,
                    fontFamily: FONT,
                }}
            >
                {[1, 2, 3].map((item) => (
                    <Box
                        key={item}
                        sx={{
                            height: item === 1 ? 100 : 150,
                            mb: 1.3,
                            borderRadius: "15px",
                            bgcolor: "#EAEAE6",
                            animation: "pulse 1.4s ease-in-out infinite",
                            "@keyframes pulse": {
                                "0%, 100%": { opacity: 1 },
                                "50%": { opacity: 0.45 },
                            },
                        }}
                    />
                ))}
            </Box>
        );
    }

    if (assignedBillsError || !bill) {
        return (
            <Box
                sx={{
                    minHeight: "100dvh",
                    bgcolor: "#F7F7F5",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1.5,
                    px: 2,
                }}
            >
                <ReceiptLongRounded
                    sx={{ fontSize: 38, color: "#999" }}
                />

                <Typography
                    sx={{
                        fontFamily: FONT,
                        fontSize: "0.85rem",
                        fontWeight: 800,
                        color: "#555",
                    }}
                >
                    Bill details not found
                </Typography>

                <Typography
                    sx={{
                        fontFamily: FONT,
                        fontSize: "0.7rem",
                        color: "#888",
                        textAlign: "center",
                    }}
                >
                    This bill may no longer be assigned to you.
                </Typography>

                <Button
                    onClick={() => navigate(-1)}
                    sx={{
                        bgcolor: PURPLE,
                        fontFamily: FONT,
                        fontWeight: 800,
                        "&:hover": {
                            bgcolor: "#6510C5",
                        },
                    }}
                >
                    Go Back
                </Button>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: "100dvh",
                bgcolor: "#F7F7F5",
                display: "flex",
                flexDirection: "column",
                fontFamily: FONT,
                pb: 3,
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    bgcolor: "rgba(247,247,245,0.96)",
                    backdropFilter: "blur(10px)",
                    borderBottom: "1px solid #E2E2DD",
                }}
            >
                <Box
                    sx={{
                        maxWidth: 520,
                        mx: "auto",
                        px: 1.5,
                        py: 1.2,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                    }}
                >
                    <Box
                        onClick={() => navigate(-1)}
                        sx={{
                            width: 36,
                            height: 36,
                            borderRadius: "11px",
                            bgcolor: "#FFFFFF",
                            border: "1px solid #E2E2DD",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            flexShrink: 0,
                        }}
                    >
                        <ArrowBackRounded
                            sx={{ fontSize: 20, color: "#333" }}
                        />
                    </Box>

                    <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                            sx={{
                                fontFamily: FONT,
                                fontSize: "0.9rem",
                                fontWeight: 900,
                                color: "#191919",
                            }}
                        >
                            CASH COLLECTION
                        </Typography>

                        <Typography
                            sx={{
                                fontFamily: FONT,
                                fontSize: "0.62rem",
                                color: "#858580",
                                fontWeight: 700,
                                overflowWrap: "anywhere",
                            }}
                        >
                            {bill.bill_no}
                        </Typography>
                    </Box>

                    {isCompleted && (
                        <CheckCircleRounded
                            sx={{
                                color: "#16803C",
                                fontSize: 22,
                            }}
                        />
                    )}
                </Box>
            </Box>

            <Box
                sx={{
                    width: "100%",
                    maxWidth: 520,
                    mx: "auto",
                    px: 1.5,
                    pt: 1.5,
                    boxSizing: "border-box",
                }}
            >
                {/* Bill Summary */}
                <Box
                    sx={{
                        p: 1.8,
                        borderRadius: "16px",
                        bgcolor: "#FFFFFF",
                        border: "1px solid #E3E3DE",
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily: FONT,
                            fontSize: "0.65rem",
                            fontWeight: 800,
                            color: "#888",
                        }}
                    >
                        BALANCE TO COLLECT
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.35,
                            fontFamily: FONT,
                            fontSize: "1.8rem",
                            fontWeight: 900,
                            color: isCompleted ? "#16803C" : PURPLE,
                            lineHeight: 1.2,
                        }}
                    >
                        {formatAmount(balanceAmount)}
                    </Typography>

                    <Divider sx={{ my: 1.4 }} />

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 1.5,
                        }}
                    >
                        <Box>
                            <Typography
                                sx={{
                                    fontFamily: FONT,
                                    fontSize: "0.58rem",
                                    fontWeight: 700,
                                    color: "#999",
                                }}
                            >
                                BILL AMOUNT
                            </Typography>

                            <Typography
                                sx={{
                                    fontFamily: FONT,
                                    fontSize: "0.78rem",
                                    fontWeight: 800,
                                    color: "#333",
                                }}
                            >
                                {formatAmount(billAmount)}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography
                                sx={{
                                    fontFamily: FONT,
                                    fontSize: "0.58rem",
                                    fontWeight: 700,
                                    color: "#999",
                                }}
                            >
                                ALREADY PAID
                            </Typography>

                            <Typography
                                sx={{
                                    fontFamily: FONT,
                                    fontSize: "0.78rem",
                                    fontWeight: 800,
                                    color: "#16803C",
                                }}
                            >
                                {formatAmount(alreadyPaid)}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Customer Details */}
                <InfoCard
                    title="CUSTOMER DETAILS"
                    icon={<PersonRounded sx={{ fontSize: 19 }} />}
                >
                    <SummaryRow
                        label="Patient / Customer ID"
                        value={bill?.patient_id || "-"}
                    />

                    <SummaryRow
                        label="Admission ID"
                        value={bill?.admission_id || "-"}
                    />

                    <SummaryRow
                        label="Bill Location"
                        value={`${bill?.nurse_station_name} - ${bill?.bed_number}`}
                    />

                    <SummaryRow
                        label="Payment Type"
                        value={bill?.bill_pay_type || "-"}
                    />

                    <SummaryRow
                        label="Billing Date"
                        value={formatDate(bill?.billing_date)}
                    />
                </InfoCard>

                {/* Bill Items */}
                <InfoCard
                    title={`BILL ITEMS (${billingItems?.length})`}
                    icon={<ReceiptLongRounded sx={{ fontSize: 19 }} />}
                >
                    {billingDetailsError ? (
                        <Typography
                            sx={{
                                fontFamily: FONT,
                                fontSize: "0.72rem",
                                color: "#B42318",
                                textAlign: "center",
                                py: 2,
                            }}
                        >
                            Unable to load bill items
                        </Typography>
                    ) : billingItems.length === 0 ? (
                        <Typography
                            sx={{
                                fontFamily: FONT,
                                fontSize: "0.72rem",
                                color: "#888",
                                textAlign: "center",
                                py: 2,
                            }}
                        >
                            No bill items found
                        </Typography>
                    ) : (
                        <Box>
                            {billingItems.map((item, index) => (
                                <BillItemRow
                                    key={item.billing_detail_id}
                                    item={item}
                                    index={index}
                                />
                            ))}
                        </Box>
                    )}
                </InfoCard>

                {/* Payment Method */}
                <InfoCard
                    title="PAYMENT METHOD"
                    icon={<PaymentsRounded sx={{ fontSize: 19 }} />}
                >
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 1,
                        }}
                    >
                        {[
                            {
                                value: "CASH",
                                label: "Cash",
                                icon: <PaymentsRounded />,
                            },
                            {
                                value: "UPI",
                                label: "UPI",
                                icon: <QrCode2Rounded />,
                            },
                        ].map((method) => {
                            const selected =
                                paymentMethod === method.value;

                            return (
                                <Box
                                    key={method.value}
                                    onClick={() => {
                                        if (!isCompleted) {
                                            setPaymentMethod(method.value);
                                        }
                                    }}
                                    sx={{
                                        p: 1.2,
                                        borderRadius: "12px",
                                        border: selected
                                            ? `1.5px solid ${PURPLE}`
                                            : "1px solid #E3E3DE",
                                        bgcolor: selected
                                            ? "#F7F0FF"
                                            : "#FFFFFF",
                                        cursor: isCompleted
                                            ? "default"
                                            : "pointer",
                                        opacity: isCompleted ? 0.7 : 1,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            color: PURPLE,
                                            mb: 0.7,
                                        }}
                                    >
                                        {React.cloneElement(method.icon, {
                                            sx: { fontSize: 21 },
                                        })}

                                        {selected && (
                                            <CheckCircleRounded
                                                sx={{ fontSize: 16 }}
                                            />
                                        )}
                                    </Box>

                                    <Typography
                                        sx={{
                                            fontFamily: FONT,
                                            fontSize: "0.75rem",
                                            fontWeight: 900,
                                            color: "#333",
                                        }}
                                    >
                                        {method.label}
                                    </Typography>
                                </Box>
                            );
                        })}
                    </Box>

                    {!isCompleted && paymentMethod === "CASH" && (
                        <Box sx={{ mt: 1.7 }}>
                            <Typography
                                sx={{
                                    fontFamily: FONT,
                                    fontSize: "0.67rem",
                                    fontWeight: 800,
                                    color: "#555",
                                    mb: 0.7,
                                }}
                            >
                                CASH RECEIVED
                            </Typography>

                            <Input
                                type="number"
                                value={cashAmount}
                                onChange={handleCashAmountChange}
                                placeholder="Enter amount received"
                                startDecorator="₹"
                                slotProps={{
                                    input: {
                                        min: 0,
                                        step: "0.01",
                                    },
                                }}
                                sx={{
                                    minHeight: 46,
                                    borderRadius: "11px",
                                    "--Input-focusedHighlight": PURPLE,
                                    fontFamily: FONT,
                                }}
                            />

                            <Box
                                sx={{
                                    mt: 1,
                                    p: 1.2,
                                    borderRadius: "11px",
                                    bgcolor: "#F7F7F5",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontFamily: FONT,
                                        fontSize: "0.68rem",
                                        fontWeight: 700,
                                        color: "#777",
                                    }}
                                >
                                    CHANGE TO RETURN
                                </Typography>

                                <Typography
                                    sx={{
                                        fontFamily: FONT,
                                        fontSize: "0.85rem",
                                        fontWeight: 900,
                                        color: PURPLE,
                                    }}
                                >
                                    {formatAmount(changeAmount)}
                                </Typography>
                            </Box>
                        </Box>
                    )}

                    {!isCompleted && paymentMethod === "UPI" && (
                        <Box sx={{ mt: 1.7 }}>
                            <Typography
                                sx={{
                                    fontFamily: FONT,
                                    fontSize: "0.67rem",
                                    fontWeight: 800,
                                    color: "#555",
                                    mb: 0.7,
                                }}
                            >
                                UPI TRANSACTION ID
                            </Typography>

                            <Input
                                value={upiTransactionId}
                                onChange={(event) =>
                                    setUpiTransactionId(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter transaction reference"
                                sx={{
                                    minHeight: 46,
                                    borderRadius: "11px",
                                    "--Input-focusedHighlight": PURPLE,
                                    fontFamily: FONT,
                                }}
                            />
                        </Box>
                    )}
                </InfoCard>

                {/* Collection Summary */}
                <Box
                    sx={{
                        mt: 1.5,
                        p: 1.5,
                        border: "1px solid #E3E3DE",
                        borderRadius: "15px",
                        bgcolor: "#FFFFFF",
                    }}
                >
                    <SummaryRow
                        label="Bill Number"
                        value={bill.bill_no || "-"}
                    />

                    <SummaryRow
                        label="Payment Method"
                        value={paymentMethod}
                    />

                    <SummaryRow
                        label="Amount to Collect"
                        value={formatAmount(balanceAmount)}
                        strong
                    />

                    {paymentMethod === "CASH" && !isCompleted && (
                        <SummaryRow
                            label="Change to Return"
                            value={formatAmount(changeAmount)}
                        />
                    )}

                    <Button
                        fullWidth
                        disabled={isCompleted || balanceAmount <= 0 || loading}
                        loading={loading}
                        onClick={handleCollectPayment}
                        startDecorator={
                            isCompleted
                                ? <CheckCircleRounded />
                                : <AccountBalanceWalletRounded />
                        }
                        sx={{
                            mt: 1.2,
                            minHeight: 46,
                            borderRadius: "12px",
                            bgcolor: PURPLE,
                            fontFamily: FONT,
                            fontSize: "0.78rem",
                            fontWeight: 900,
                            "&:hover": {
                                bgcolor: "#6510C5",
                            },
                            "&.Mui-disabled": {
                                bgcolor: "#E5E5E1",
                                color: "#888",
                            },
                        }}
                    >
                        {isCompleted
                            ? "COLLECTION COMPLETED"
                            : `COLLECT ${formatAmount(balanceAmount)}`}
                    </Button>
                </Box>

            </Box>
        </Box>
    );
};

export default memo(CashCollectionPage);
