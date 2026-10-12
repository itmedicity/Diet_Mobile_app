import React, { memo, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box } from "@mui/joy";

import {
    usePaymentHistoryBillDetail,
    useReturnLogDetails,
} from "../../CommonData/UseQuery";

import PaymentHistorySkeleton from "./CollectionComponent/PaymentHistorySkeleton";
import CollectionPage from "./CollectionComponent/CollectionPage";

import {
    EmpauthId,
    errorNofity,
    infoNofity,
    succesNofity,
    warningNofity,
} from "../Constant/Constant";

import { axioslogin } from "../../Axios/axios";
import { useQueryClient } from "@tanstack/react-query";
import { COLORS, FONT, focusRing } from "../../Style/designTokens";

const fieldSx = {
    boxSizing: "border-box", width: "100%", px: 1.5, fontFamily: FONT, fontSize: 18, color: COLORS.ink,
    bgcolor: COLORS.white, border: `1.5px solid ${COLORS.fieldBorder}`, borderRadius: "12px", outline: "none",
    "&:focus": { borderColor: COLORS.plum, boxShadow: `0 0 0 3px ${COLORS.orchid}` },
};

const Card = ({ title, children }) => (
    <Box sx={{ mt: 1.5, p: 2, bgcolor: COLORS.white, border: `1px solid ${COLORS.line}`, borderRadius: "16px", fontFamily: FONT }}>
        {title && <Box component="h2" sx={{ m: 0, mb: 1, fontSize: 17, fontWeight: 700, color: COLORS.ink }}>{title}</Box>}
        {children}
    </Box>
);

const SummaryRow = ({ label, value, bold = false, color = COLORS.ink }) => (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", py: 0.5 }}>
        <Box sx={{ fontSize: bold ? 17 : 15, fontWeight: bold ? 700 : 500, color: bold ? color : COLORS.muted }}>{label}</Box>
        <Box sx={{ fontSize: bold ? 20 : 16, fontWeight: 700, color }}>{value}</Box>
    </Box>
);

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
        // Use the payment from the URL. A bill can have several cash payments
        // (instalments); picking the first one mixed up change and return history.
        return payments?.find(
            (payment) =>
                Number(payment?.payment_id) === Number(paymentId) &&
                payment?.payment_mode === "CASH" &&
                payment?.payment_status === "SUCCESS"
        );
    }, [payments, paymentId]);

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

        // ignore taps while a request is already running
        if (loading) return;

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
        return (
            <CollectionPage title="Return change" subtitle="Loading…">
                <PaymentHistorySkeleton />
            </CollectionPage>
        );
    }

    /*
     * Bill not found.
     */
    if (!bill) {
        return (
            <CollectionPage title="Return change">
                <Box sx={{ py: 6, textAlign: "center", fontFamily: FONT, fontSize: 16, color: COLORS.muted }}>
                    This bill was not found. Go back and open it again from the cash return list.
                </Box>
            </CollectionPage>
        );
    }

    const confirmReturn = () => {
        if (window.confirm(`Hand back ${formatAmount(finalReturnAmount)} to ${bill.patient_name || "the patient"}?`)) {
            handleCloseReturn();
        }
    };

    const canSubmit = !loading && finalReturnAmount > 0 && remainingReturnAmount > 0;
    const meta = [bill.patient_id, bill.party_name].filter(Boolean).join("  ·  ");

    return (
        <CollectionPage title="Return change" subtitle={`Bill ${bill.bill_no}`}>

            {/* WHO */}
            <Box sx={{ p: 2, bgcolor: COLORS.white, border: `1px solid ${COLORS.line}`, borderRadius: "16px", fontFamily: FONT }}>
                <Box sx={{ fontSize: 20, fontWeight: 700, color: COLORS.ink }}>{bill.patient_name || "-"}</Box>
                {meta && <Box sx={{ mt: 0.25, fontSize: 14, color: COLORS.muted }}>{meta}</Box>}
            </Box>

            {/* HOW MUCH */}
            <Box sx={{ mt: 1.5, p: 2.5, borderRadius: "20px", bgcolor: remainingReturnAmount > 0 ? COLORS.plum : COLORS.success, color: COLORS.white, fontFamily: FONT }}>
                <Box sx={{ fontSize: 15, opacity: 0.9 }}>{remainingReturnAmount > 0 ? "Change still to return" : "All change returned"}</Box>
                <Box sx={{ fontSize: 40, fontWeight: 700, lineHeight: 1.15 }}>{formatAmount(remainingReturnAmount)}</Box>
                {returnedAmount > 0 && (
                    <Box sx={{ mt: 0.5, fontSize: 15, opacity: 0.9 }}>{`Already returned ${formatAmount(returnedAmount)}`}</Box>
                )}
            </Box>

            <Card title="Bill and payment">
                <SummaryRow label="Bill amount" value={formatAmount(billAmount)} />
                <SummaryRow label="Cash received" value={formatAmount(receivedAmount)} />
                <SummaryRow label="Paid amount" value={formatAmount(Number(cashPayment?.amount || 0))} />
                <SummaryRow label="Change due" value={formatAmount(actualChangeAmount)} />
            </Card>

            {/* RETURN HISTORY */}
            {ReturnLogDetails?.length > 0 && (
                <Card title="Returned so far">
                    {ReturnLogDetails.map((item, index) => (
                        <Box
                            key={item?.return_id || index}
                            sx={{ py: 1, borderTop: index > 0 ? `1px solid ${COLORS.line}` : "none" }}
                        >
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                <Box sx={{ fontSize: 16, fontWeight: 600, color: COLORS.ink }}>{`Return ${index + 1}`}</Box>
                                <Box sx={{ fontSize: 17, fontWeight: 700, color: COLORS.success }}>{formatAmount(item?.returned_amount)}</Box>
                            </Box>
                            <Box sx={{ fontSize: 14, color: COLORS.muted }}>
                                {`${formatDate(item?.returned_at)} · ${item?.em_name || "-"}`}
                            </Box>
                            {item?.remarks && <Box sx={{ mt: 0.25, fontSize: 14, color: COLORS.ink }}>{item.remarks}</Box>}
                        </Box>
                    ))}
                </Card>
            )}

            {/* RETURN NOW */}
            <Card title="Return change now">
                <Box component="label" htmlFor="return-amount" sx={{ display: "block", fontSize: 15, fontWeight: 600, color: COLORS.ink }}>
                    Amount handed back
                </Box>
                <Box sx={{ mt: 0.25, mb: 1, fontSize: 14, color: COLORS.muted }}>
                    Leave it empty to return everything that is left.
                </Box>
                <Box
                    component="input"
                    id="return-amount"
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    value={returnAmount}
                    onChange={handleReturnAmountChange}
                    placeholder={`₹${remainingReturnAmount.toFixed(2)}`}
                    sx={{ ...fieldSx, height: 52 }}
                />

                <Box
                    role="status"
                    sx={{
                        mt: 1.5, p: 1.5, borderRadius: "12px",
                        bgcolor: finalReturnAmount === remainingReturnAmount ? "#E3F3E8" : "#FFF1D6",
                        border: `1px solid ${finalReturnAmount === remainingReturnAmount ? "#A9D3B8" : "#EBCB8B"}`,
                    }}
                >
                    <Box sx={{ fontSize: 14, color: COLORS.muted }}>You are returning now</Box>
                    <Box sx={{ fontSize: 26, fontWeight: 700, color: COLORS.ink }}>{formatAmount(finalReturnAmount)}</Box>
                    {finalReturnAmount > remainingReturnAmount && (
                        <Box sx={{ fontSize: 14, color: COLORS.error }}>This is more than the change that is left.</Box>
                    )}
                </Box>

                <Box component="label" htmlFor="return-remarks" sx={{ display: "block", mt: 1.5, mb: 0.75, fontSize: 15, fontWeight: 600, color: COLORS.ink }}>
                    Remark (optional)
                </Box>
                <Box
                    component="textarea"
                    id="return-remarks"
                    rows={3}
                    value={returnRemarks}
                    onChange={(event) => setReturnRemarks(event.target.value)}
                    placeholder="For example: returned to the bystander"
                    sx={{ ...fieldSx, py: 1.25, fontSize: 16, resize: "vertical" }}
                />

                <Box
                    component="button"
                    type="button"
                    onClick={confirmReturn}
                    disabled={!canSubmit}
                    sx={{
                        mt: 2, width: "100%", height: 56, border: 0, borderRadius: "14px", cursor: "pointer",
                        bgcolor: COLORS.plum, color: COLORS.white, fontFamily: FONT, fontSize: 18, fontWeight: 700,
                        "&:active": { bgcolor: COLORS.plumDark },
                        "&:disabled": { bgcolor: COLORS.orchid, color: COLORS.muted, cursor: "not-allowed" },
                        ...focusRing,
                    }}
                >
                    {loading ? "Saving…" : "Confirm return"}
                </Box>
            </Card>

            {cashPayment && (
                <Box sx={{ mt: 1.5, textAlign: "center", fontFamily: FONT, fontSize: 14, color: COLORS.muted }}>
                    {`Cash payment collected on ${formatDate(cashPayment.payment_date)}`}
                </Box>
            )}

        </CollectionPage>
    );
};

export default memo(CashReturnClosePage);
