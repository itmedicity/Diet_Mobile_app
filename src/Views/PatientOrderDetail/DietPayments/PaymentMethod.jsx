import React, { memo, useMemo, useState, useCallback } from "react";
import { Box } from "@mui/joy";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import QrCode2RoundedIcon from "@mui/icons-material/QrCode2Rounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import { useLocation, useNavigate } from "react-router-dom";
import PaymentBillDetailList from "./PaymentBillDetailList";
import { EmpauthId, succesNofity, warningNofity } from "../../Constant/Constant";
import UploadQrcode from "./UploadQrcode";
import { axioslogin } from "../../../Axios/axios";
import PizzaLoader from "../../../components/PizzaLoader";
import { COLORS, FONT, focusRing } from "../../../Style/designTokens";

const METHODS = [
    { value: "CASH", title: "Cash", description: "Collect cash from the patient or bystander", icon: <PaymentsRoundedIcon /> },
    { value: "UPI", title: "UPI", description: "Scan the QR code and note the transaction ID", icon: <QrCode2RoundedIcon /> },
];

const fieldSx = {
    boxSizing: "border-box", width: "100%", height: 52, px: 1.5, fontFamily: FONT, fontSize: 18, color: COLORS.ink,
    bgcolor: COLORS.white, border: `1.5px solid ${COLORS.fieldBorder}`, borderRadius: "12px", outline: "none",
    "&:focus": { borderColor: COLORS.plum, boxShadow: `0 0 0 3px ${COLORS.orchid}` },
};

const PaymentMethod = () => {

    const [openQrModal, setOpenQrModal] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const id = EmpauthId();

    const paymentData = location.state ?? {};

    const {
        items = [],
        amount = 0,
        deliveredAmount = 0,
        summary,
        customer
    } = paymentData;

    const [paymentMethod, setPaymentMethod] = useState("UPI");
    const [upiId, setUpiId] = useState("");
    const [loading, setLoading] = useState(false);
    const [cashAmount, setCashAmount] = useState(Number(amount || 0).toFixed(2));

    const totalItems = useMemo(() => items.length, [items]);





    const groupedBills = items?.reduce((acc, item) => {
        const billingId = Number(item.billing_id);
        if (!acc[billingId]) {
            acc[billingId] = [];
        }
        acc[billingId].push(item);
        return acc;
    }, {});


    const receivedAmount = Number(cashAmount || 0);
    const billAmount = Number(amount || 0);

    const changeAmount = Math.max(receivedAmount - billAmount, 0);


  


    const handleContinue = useCallback(async () => {
        // ignore extra taps while a payment request is running
        if (loading) return;

        if (!items?.length) {
            return warningNofity("No billing items selected");
        }

        if (!amount || Number(amount) <= 0) {
            return warningNofity("Invalid payment amount");
        }

        if (!paymentMethod) {
            return warningNofity("Please select payment method");
        }

        if (paymentMethod === "UPI") {
            if (!upiId.trim()) {
                return warningNofity(
                    "Please enter the UPI Transaction ID"
                );
            }
            const upiRegex = /^[A-Za-z0-9]{12,35}$/;
            if (!upiRegex.test(upiId.trim())) {
                return warningNofity(
                    "Please enter a valid Transaction ID"
                );
            }
        }


        /* PREPARE BILL PAYMENTS  ONE PAYMENT PER BILL   */

        const payments = Object.entries(groupedBills)?.map(([billingId, billItems]) => {

            const billAmount = billItems.reduce((sum, item) => sum + Number(item?.total || 0), 0);

            return {
                billing_id: Number(billingId),
                amount: Number(billAmount.toFixed(2)),
                payment_mode: paymentMethod,
                collected_location: "DELIVERY",
                remarks: null,
                /* UPI reference */
                transaction_id:
                    paymentMethod === "UPI"
                        ? upiId.trim()
                        : null,
                items: billItems.map(item => ({
                    billing_detail_id:
                        Number(item?.billing_detail_id),
                    paid_amount:
                        Number(item?.total || 0)
                }))
            };
        });


        /* VALIDATE BILL DATA */

        if (!payments.length) {
            return warningNofity(
                "No bills available for payment"
            );
        }

        const invalidBill = payments.find(
            bill =>
                !bill.billing_id ||
                !bill.items?.length
        );

        if (invalidBill) {
            return warningNofity("Invalid billing information");
        }
        /*  VALIDATE TOTAL*/
        const calculatedAmount = payments?.reduce((sum, bill) =>
            sum + Number(bill.amount || 0), 0);

        if (Number(calculatedAmount.toFixed(2)) !== Number(Number(amount).toFixed(2))) {
            return warningNofity("Payment amount does not match selected items");
        };
        const isCash = paymentMethod === "CASH";
        const isUpi = paymentMethod === "UPI";
        if (isCash) {
            if (!cashAmount || receivedAmount <= 0) {
                warningNofity("Please enter the cash received amount");
                return;
            }

            if (receivedAmount < billAmount) {
                warningNofity(
                    `Cash received cannot be less than ₹${billAmount.toFixed(2)}`
                );
                return;
            }
        }
        /* FINAL PAYLOAD*/
        const payload = {
            amount: Number(calculatedAmount.toFixed(2)),
            payment_mode: paymentMethod,
            collected_by: Number(id) || null,
            collected_location: "DELIVERY",

            transaction_id: isUpi ? upiId.trim() : null,
            received_amount: isCash ? Number(receivedAmount.toFixed(2)) : null,
            change_amount: isCash ? Number(changeAmount.toFixed(2)) : null,
            change_status: isCash && changeAmount > 0 ? 'PENDING' : null,
            remarks: "paid successfully",
            payments,
        };

      
        
        /*  CALL PAYMENT API */
        try {
            setLoading(true);
            const response = await axioslogin.post("/dietdelivery/billing/payment", payload);
            const { success, message } = response?.data || {};
            if (success !== 1) return warningNofity(message || "Failed to generate bill");
            succesNofity(message || "Bill generated successfully");
            navigate(
                "/diet/payment/success",
                {
                    state: {
                        amount:
                            calculatedAmount,

                        transactionId:
                            paymentMethod === "UPI"
                                ? upiId.trim()
                                : null,

                        paymentMethod,

                        paymentDate:
                            new Date().toLocaleString(
                                "en-IN"
                            ),

                        payerName:
                            customer?.fb_ptc_name,

                        payermobile:
                            customer?.fb_ptc_mobile,

                        referenceNo:
                            paymentMethod === "UPI"
                                ? upiId.trim()
                                : null,

                        title:
                            "Payment recorded",

                        message:
                            "The payment has been recorded for this bill.",

                        buttonText:
                            "Back to deliveries",

                        payments,

                        customer
                    }
                }
            );
        } catch (error) {
            console.error("Payment Error:", error);
            warningNofity(
                error?.response?.data?.message ||
                "Unable to process payment"
            );
        } finally {
            setLoading(false);
        }

    }, [
        loading,
        items,
        amount,
        paymentMethod,
        upiId,
        groupedBills,
        customer,
        navigate,
        receivedAmount,
        changeAmount,
        cashAmount,
        billAmount,
        id

    ]);

    if (!location.state) {

        return (
            <Box
                sx={{
                    minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center",
                    flexDirection: "column", gap: 2, px: 3, textAlign: "center", fontFamily: FONT, bgcolor: COLORS.surface,
                }}
            >
                <Box sx={{ fontSize: 20, fontWeight: 700, color: COLORS.ink }}>No payment to show</Box>
                <Box sx={{ fontSize: 16, color: COLORS.muted }}>Open a bill from the delivery screen and choose Pay.</Box>
                <Box
                    component="button"
                    type="button"
                    onClick={() => navigate(-1)}
                    sx={{
                        height: 52, px: 3, border: 0, borderRadius: "14px", cursor: "pointer",
                        bgcolor: COLORS.plum, color: COLORS.white, fontFamily: FONT, fontSize: 17, fontWeight: 700, ...focusRing,
                    }}
                >
                    Go back
                </Box>
            </Box>
        );

    }

    return (
        <>
            {loading && <PizzaLoader />}

            <Box sx={{ minHeight: "100dvh", bgcolor: COLORS.surface, fontFamily: FONT, pb: "120px" }}>

                {/* HEADER */}
                <Box
                    component="header"
                    sx={{
                        position: "sticky", top: 0, zIndex: 1100, height: 56, px: 1, boxSizing: "border-box",
                        display: "flex", alignItems: "center", gap: 0.5, bgcolor: COLORS.white, borderBottom: `1px solid ${COLORS.line}`,
                    }}
                >
                    <Box
                        component="button"
                        type="button"
                        aria-label="Go back"
                        onClick={() => navigate(-1)}
                        sx={{
                            width: 44, height: 44, border: 0, bgcolor: "transparent", cursor: "pointer", borderRadius: "50%",
                            display: "grid", placeItems: "center", color: COLORS.ink, ...focusRing,
                        }}
                    >
                        <ArrowBackRoundedIcon />
                    </Box>
                    <Box sx={{ fontSize: 20, fontWeight: 700, color: COLORS.ink }}>Collect payment</Box>
                </Box>

                <Box sx={{ maxWidth: 560, mx: "auto", px: 2 }}>

                    {/* AMOUNT */}
                    <Box sx={{ mt: 2, p: 2.5, borderRadius: "20px", bgcolor: COLORS.plum, color: COLORS.white }}>
                        <Box sx={{ fontSize: 15, opacity: 0.9 }}>Amount to collect</Box>
                        <Box sx={{ fontSize: 40, fontWeight: 700, lineHeight: 1.15 }}>{`₹${Number(amount).toFixed(2)}`}</Box>
                        <Box sx={{ mt: 1, display: "flex", justifyContent: "space-between", fontSize: 15, opacity: 0.9 }}>
                            <span>{`${totalItems} ${totalItems === 1 ? "item" : "items"} selected`}</span>
                            <span>{`Delivered ₹${Number(deliveredAmount).toFixed(2)}`}</span>
                        </Box>
                        {customer?.fb_ptc_name && (
                            <Box sx={{ mt: 0.5, fontSize: 15, opacity: 0.9 }}>{`For ${customer.fb_ptc_name}`}</Box>
                        )}
                    </Box>

                    {/* METHOD */}
                    <Box sx={{ mt: 3, mb: 1, fontSize: 18, fontWeight: 700, color: COLORS.ink }}>How is the patient paying?</Box>

                    <Box role="radiogroup" aria-label="Payment method" sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
                        {METHODS.map((method) => {
                            const selected = paymentMethod === method.value;
                            return (
                                <Box
                                    key={method.value}
                                    component="button"
                                    type="button"
                                    role="radio"
                                    aria-checked={selected}
                                    onClick={() => setPaymentMethod(method.value)}
                                    sx={{
                                        minHeight: 68, px: 1.75, borderRadius: "14px", cursor: "pointer", textAlign: "left", fontFamily: FONT,
                                        display: "flex", alignItems: "center", gap: 1.5, color: COLORS.plum,
                                        bgcolor: selected ? COLORS.wash : COLORS.white,
                                        border: `${selected ? 2 : 1.5}px solid ${selected ? COLORS.plum : COLORS.fieldBorder}`,
                                        ...focusRing,
                                    }}
                                >
                                    {method.icon}
                                    <Box sx={{ flex: 1 }}>
                                        <Box sx={{ fontSize: 17, fontWeight: 700, color: COLORS.ink }}>{method.title}</Box>
                                        <Box sx={{ fontSize: 14, color: COLORS.muted }}>{method.description}</Box>
                                    </Box>
                                    <Box sx={{ width: 24, height: 24, borderRadius: "50%", display: "grid", placeItems: "center", border: `2px solid ${COLORS.plum}` }}>
                                        {selected && <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: COLORS.plum }} />}
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>

                    {/* DETAILS FOR THE CHOSEN METHOD */}
                    {["UPI", "CASH"].includes(paymentMethod) && (
                        <Box sx={{ mt: 2, p: 2, borderRadius: "16px", bgcolor: COLORS.white, border: `1px solid ${COLORS.line}` }}>
                            <Box component="label" htmlFor="payment-value" sx={{ display: "block", fontSize: 16, fontWeight: 700, color: COLORS.ink }}>
                                {paymentMethod === "UPI" ? "UPI transaction ID" : "Cash received"}
                            </Box>
                            <Box sx={{ mt: 0.25, mb: 1, fontSize: 14, color: COLORS.muted }}>
                                {paymentMethod === "UPI"
                                    ? "Enter the transaction ID shown in the payer's UPI app (12 to 35 letters or digits)."
                                    : "Enter the amount handed over in cash."}
                            </Box>

                            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                <Box
                                    component="input"
                                    id="payment-value"
                                    type="text"
                                    inputMode={paymentMethod === "CASH" ? "decimal" : "text"}
                                    autoComplete="off"
                                    value={paymentMethod === "UPI" ? upiId : cashAmount}
                                    onChange={(e) => {
                                        if (paymentMethod === "UPI") {
                                            setUpiId(e.target.value);
                                        } else {
                                            // digits and one decimal point only
                                            setCashAmount(e.target.value.replace(/[^0-9.]/g, ""));
                                        }
                                    }}
                                    placeholder={paymentMethod === "UPI" ? "For example 123456789012" : "For example 500"}
                                    sx={fieldSx}
                                />
                                {paymentMethod === "UPI" && (
                                    <Box
                                        component="button"
                                        type="button"
                                        aria-label="Show the QR code to scan"
                                        onClick={() => setOpenQrModal(true)}
                                        sx={{
                                            flexShrink: 0, width: 52, height: 52, border: `1.5px solid ${COLORS.plum}`, borderRadius: "12px", cursor: "pointer",
                                            display: "grid", placeItems: "center", bgcolor: COLORS.wash, color: COLORS.plum, ...focusRing,
                                        }}
                                    >
                                        <QrCode2RoundedIcon />
                                    </Box>
                                )}
                            </Box>

                            {paymentMethod === "CASH" && (
                                <Box sx={{ mt: 1.5, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                    <Box sx={{ fontSize: 16, fontWeight: 600, color: COLORS.ink }}>Change to give back</Box>
                                    <Box sx={{ fontSize: 22, fontWeight: 700, color: COLORS.plum }}>{`₹${changeAmount.toFixed(2)}`}</Box>
                                </Box>
                            )}
                        </Box>
                    )}

                    {/* BILL SUMMARY */}
                    <Box sx={{ mt: 3, mb: 1, fontSize: 18, fontWeight: 700, color: COLORS.ink }}>Bill</Box>
                    <PaymentBillDetailList items={items} summary={summary} />
                </Box>

                {/* PAY */}
                <Box
                    sx={{
                        position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 1600,
                        px: 2.5, pt: 1.5, pb: "calc(12px + env(safe-area-inset-bottom))",
                        bgcolor: COLORS.white, borderTop: `1px solid ${COLORS.line}`,
                    }}
                >
                    <Box
                        component="button"
                        type="button"
                        onClick={handleContinue}
                        disabled={loading}
                        sx={{
                            display: "block", width: "100%", maxWidth: 560, mx: "auto", height: 56, border: 0, borderRadius: "14px", cursor: "pointer",
                            bgcolor: COLORS.plum, color: COLORS.white, fontFamily: FONT, fontSize: 18, fontWeight: 700,
                            "&:active": { bgcolor: COLORS.plumDark },
                            "&:disabled": { bgcolor: COLORS.orchid, color: COLORS.muted, cursor: "not-allowed" },
                            ...focusRing,
                        }}
                    >
                        {loading ? "Recording payment…" : `Collect ₹${Number(amount).toFixed(2)}`}
                    </Box>
                </Box>

                {/* UploadQrcode shows its own bundled QR image (assets/images/qrcode.png) */}
                <UploadQrcode
                    open={openQrModal}
                    onClose={() => setOpenQrModal(false)}
                />
            </Box>
        </>
    );
};

export default memo(PaymentMethod);
