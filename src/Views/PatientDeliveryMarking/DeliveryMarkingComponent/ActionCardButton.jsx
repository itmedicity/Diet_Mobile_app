import React, {
    memo,
    useCallback,
    useMemo,
    useState
} from "react";

import { Box } from "@mui/joy";

import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PaymentSummaryCard from "./PaymentSummaryCard";
import BillDetailList from "./BillDetailList";
import { useNavigate } from "react-router-dom";
import ProformaDetailList from "./ProformaDetailList";
import { COLORS, FONT, focusRing } from "../../../Style/designTokens";

const footerButton = (filled) => ({
    height: 48, px: 2, whiteSpace: "nowrap", borderRadius: "12px", cursor: "pointer", fontFamily: FONT, fontSize: 16, fontWeight: 700,
    display: "flex", alignItems: "center", gap: 0.5,
    bgcolor: filled ? COLORS.plum : COLORS.wash, color: filled ? COLORS.white : COLORS.plum,
    border: `1.5px solid ${COLORS.plum}`,
    "&:disabled": { opacity: 0.6, cursor: "not-allowed" },
    ...focusRing,
});

const ActionCardButton = ({
    title = "Bill Details",
    subtitle = "View bill",
    floating = true,
    loading = false,
    expand = false,
    billdetail = [],
    setOpenBillDialog,
    patientData,
    OnGenerateBill,
    isBystander,
    porformainvoice
}) => {


    const navigate = useNavigate();

    const [selectedItems, setSelectedItems] = useState([]);
    const [expandProforma, setExpandProforma] = useState(false)

    /*
    ============================================================
    CHECK WHETHER BILL ITEMS EXIST
    ============================================================
    */

    const isBillItemExist = Array.isArray(billdetail) &&
        billdetail.length > 0 &&
        billdetail?.some(item => item.billing_status === 'NOT_BILLED');


    const canView = Array.isArray(billdetail) &&
        billdetail?.length > 0 &&
        billdetail.some((item) => item?.billing_id != null);

    /*
    ============================================================
    BILL MAP
    ============================================================

    ledger_id is the unique identifier for the service ledger
    item.
    */

    // const billMap = useMemo(() => {
    //     return new Map(
    //         (billdetail || []).map(item => [
    //             Number(item?.ledger_id),
    //             item
    //         ])
    //     );
    // }, [billdetail]);


    const billMap = useMemo(() => {
        return new Map(
            (billdetail || []).map(item => {
                const key = `${item?.reference_table}-${item?.reference_id}`;
                return [
                    key,
                    item
                ];
            })
        );

    }, [billdetail]);

    /*
    ============================================================
    SELECTED BILLING ITEMS
    ============================================================
    */

    const FinalBillingItem = useMemo(() => {
        return (selectedItems || [])
            .map(key => billMap.get(key))
            .filter(Boolean);

    }, [selectedItems, billMap]);

    /*
    ============================================================
    FORMAT BILL ITEMS
    ============================================================
    */

    // const items = useMemo(() => {
    //     return (billdetail || []).map(item => {
    //         const isBilled =
    //             item?.ledger_status === "BILLED";
    //         return {
    //             id: Number(item?.ledger_id),
    //             ledger_id: Number(item?.ledger_id),
    //             billing_id:
    //                 Number(item?.billing_id || 0),
    //             billing_detail_id: Number(item?.billing_detail_id || 0),
    //             name: item?.item_name || "Unknown Item",
    //             quantity:
    //                 Number(item?.quantity || 0),
    //             rate:
    //                 Number(item?.unit_rate || 0),
    //             gross:
    //                 Number(item?.gross_amount || 0),
    //             discount:
    //                 Number(item?.discount || 0),
    //             gstRate:
    //                 Number(item?.gst_rate || 0),
    //             gst:
    //                 Number(item?.gst_amount || 0),
    //             total:
    //                 Number(item?.net_amount || 0),
    //             ledger_status:
    //                 item?.ledger_status || "PENDING",
    //             bill_item_status:
    //                 item?.billing_status || null,

    //             billing_status:
    //                 item?.billing_status || "NOT_BILLED",

    //             bill_status:
    //                 item?.bill_status || null,
    //             isBilled
    //         };
    //     });

    // }, [billdetail]);


    const items = useMemo(() => {

        return (billdetail || []).map(item => {

            const referenceKey =
                `${item?.reference_table}-${item?.reference_id}`;

            const isLedgerItem =
                item?.reference_table === "diet_service_ledger";

            const isProformaItem =
                item?.reference_table === "proforma_detail";

            return {

                id: referenceKey,

                reference_key: referenceKey,

                reference_table:
                    item?.reference_table || null,

                reference_id:
                    Number(item?.reference_id || 0),

                ledger_id:
                    item?.ledger_id
                        ? Number(item.ledger_id)
                        : null,

                delivery_id:
                    item?.delivery_id
                        ? Number(item.delivery_id)
                        : null,

                billing_id:
                    Number(item?.billing_id || 0),

                billing_detail_id:
                    Number(item?.billing_detail_id || 0),

                name:
                    item?.item_name ||
                    item?.description ||
                    "Unknown Item",

                quantity:
                    Number(item?.quantity || 0),

                rate:
                    Number(item?.unit_rate ?? item?.rate ?? 0),

                gross:
                    Number(
                        item?.gross_amount ??
                        item?.amount ??
                        0
                    ),

                discount:
                    Number(item?.discount || 0),

                gstRate:
                    Number(
                        item?.gst_rate ??
                        item?.gst ??
                        0
                    ),

                gst:
                    Number(item?.gst_amount || 0),

                total:
                    Number(
                        item?.net_amount ??
                        item?.amount ??
                        0
                    ),

                ledger_status:
                    item?.ledger_status || null,

                bill_item_status:
                    item?.bill_item_status || null,

                billing_status:
                    item?.billing_status ||
                    item?.bill_item_status ||
                    "NOT_BILLED",

                bill_status:
                    item?.bill_status || null,

                isLedgerItem,
                isProformaItem

            };

        });

    }, [billdetail]);


    /*
    ============================================================
    SELECTED ITEMS FORMAT
    ============================================================
    */

    // const finalSelected = useMemo(() => {
    //     return FinalBillingItem.map(item => ({
    //         id: Number(item?.ledger_id),
    //         ledger_id: Number(item?.ledger_id),
    //         billing_id: Number(item?.billing_id || 0),
    //         billing_detail_id: Number(item?.billing_detail_id || 0),
    //         name: item?.item_name || "Unknown Item",
    //         quantity: Number(item?.quantity || 0),
    //         rate: Number(item?.unit_rate || 0),
    //         gross:
    //             Number(item?.gross_amount || 0),
    //         discount: Number(item?.discount || 0),
    //         gst: Number(item?.gst_amount || 0),
    //         total: Number(item?.net_amount || 0)
    //     }));

    // }, [FinalBillingItem]);

    const finalSelected = useMemo(() => {
        return FinalBillingItem?.map(item => {

            const referenceKey =
                `${item?.reference_table}-${item?.reference_id}`;

            return {
                id: referenceKey,

                reference_key: referenceKey,

                reference_table:
                    item?.reference_table || null,

                reference_id:
                    Number(item?.reference_id || 0),

                // Exists only for ledger-based billing
                ledger_id:
                    item?.ledger_id
                        ? Number(item.ledger_id)
                        : null,

                delivery_id:
                    item?.delivery_id
                        ? Number(item.delivery_id)
                        : null,

                billing_id:
                    Number(item?.billing_id || 0),

                billing_detail_id:
                    Number(item?.billing_detail_id || 0),

                name:
                    item?.item_name ||
                    item?.description ||
                    "Unknown Item",

                quantity:
                    Number(item?.quantity || 0),

                rate:
                    Number(
                        item?.unit_rate ??
                        item?.rate ??
                        0
                    ),

                gross:
                    Number(
                        item?.gross_amount ??
                        item?.amount ??
                        0
                    ),

                discount:
                    Number(item?.discount || 0),

                gst:
                    Number(item?.gst_amount || 0),

                total:
                    Number(
                        item?.net_amount ??
                        item?.amount ??
                        0
                    )
            };

        });

    }, [FinalBillingItem]);

   
    

    const finalPaidBillItems = useMemo(() => {
        return items ? items?.filter((item) => item.billing_status === 'PAID') : []
    }, [items]);


    const isPaymentPendingExist = useMemo(() => {
        return items ? items?.some((item) => item.billing_status !== 'PAID') : []
    }, [items]);

    const summary = useMemo(() => ({
        gross: (items || []).reduce((sum, item) => sum + Number(item?.rate || 0), 0),
        discount: (items || []).reduce((sum, item) => sum + Number(item?.discount || 0), 0),
        gst: (items || []).reduce((sum, item) => sum + Number(item?.gst || 0), 0),
        total: (items || []).reduce((sum, item) => sum + Number(item?.total || 0), 0)
    }), [items]);



    const selectedSummary = useMemo(() => ({
        gross: (finalSelected || []).reduce((sum, item) => sum + Number(item?.rate || 0), 0),
        discount: (finalSelected || []).reduce((sum, item) => sum + Number(item?.discount || 0), 0),
        gst: (finalSelected || []).reduce((sum, item) => sum + Number(item?.gst || 0), 0),
        total: (finalSelected || []).reduce((sum, item) => sum + Number(item?.total || 0), 0)
    }), [finalSelected]);


    const billedItemSummary = useMemo(() => ({
        gross: (finalPaidBillItems || []).reduce((sum, item) => sum + Number(item?.gross || 0), 0),
        discount: (finalPaidBillItems || []).reduce((sum, item) => sum + Number(item?.discount || 0), 0),
        gst: (finalPaidBillItems || []).reduce((sum, item) => sum + Number(item?.gst || 0), 0),
        total: (finalPaidBillItems || []).reduce((sum, item) => sum + Number(item?.total || 0), 0)
    }), [finalPaidBillItems]);


    /*
    ============================================================
    NAVIGATE TO PAYMENT
    ============================================================
    */

    const handleNavigate = useCallback(() => {

        if (!finalSelected.length) {
            return;
        }
        navigate("/diet/payment", {
            state: {
                items: finalSelected,
                summary: selectedSummary,
                amount: selectedSummary.total,
                deliveredAmount: summary.total,
                customer: patientData
            }
        });

    }, [
        navigate,
        finalSelected,
        selectedSummary,
        summary,
        patientData
    ]);



    return (

        <Box
            sx={{
                ...(floating && {
                    position: "fixed",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 1600,
                    maxWidth: 700,
                    mx: "auto",
                }),
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                bgcolor: COLORS.white,
                borderTop: `1px solid ${COLORS.line}`,
                borderRadius: "20px 20px 0 0",
                boxShadow: "0 -6px 20px rgba(42,16,56,0.12)",
                overflow: "hidden",
            }}
        >

            <ProformaDetailList
                expand={expandProforma}
                items={porformainvoice}
            />
            <BillDetailList
                expand={expand}
                items={items}
                summary={summary}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
            />

            <PaymentSummaryCard
                expand={expand}
                isPaymentPendingExist={isPaymentPendingExist}
                amount={selectedSummary.total}
                deliveredAmount={summary.total}
                totalPayedAmount={billedItemSummary.total}
                onClick={handleNavigate}
            />

            <Box
                sx={{
                    px: 2.5, pt: 1.5, pb: "calc(12px + env(safe-area-inset-bottom))",
                    display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1,
                    fontFamily: FONT,
                }}
            >
                <Box sx={{ minWidth: 0 }}>
                    <Box sx={{ fontSize: 17, fontWeight: 700, color: COLORS.ink }}>{title}</Box>
                    <Box sx={{ fontSize: 14, color: COLORS.muted }}>{subtitle}</Box>
                </Box>

                <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
                    {porformainvoice?.length > 0 && (
                        <Box
                            component="button"
                            type="button"
                            aria-expanded={expandProforma}
                            onClick={() => setExpandProforma(prev => !prev)}
                            sx={footerButton(false)}
                        >
                            Proforma
                        </Box>
                    )}

                    {isBillItemExist && isBystander && (
                        <Box
                            component="button"
                            type="button"
                            onClick={OnGenerateBill}
                            disabled={loading}
                            sx={footerButton(true)}
                        >
                            <ReceiptIcon aria-hidden="true" sx={{ fontSize: 20 }} />
                            {loading ? "Generating…" : "Generate bill"}
                        </Box>
                    )}

                    {canView && (
                        <Box
                            component="button"
                            type="button"
                            aria-expanded={expand}
                            onClick={() => setOpenBillDialog(prev => !prev)}
                            sx={footerButton(true)}
                        >
                            {expand ? "Hide" : "View"}
                            {expand
                                ? <ExpandMoreRoundedIcon aria-hidden="true" />
                                : <ExpandLessRoundedIcon aria-hidden="true" />}
                        </Box>
                    )}
                </Box>
            </Box>

        </Box>
    );
};


export default memo(ActionCardButton);
