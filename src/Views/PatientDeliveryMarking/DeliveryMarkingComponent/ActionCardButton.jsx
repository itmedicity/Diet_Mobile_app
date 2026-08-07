import React, { memo, useCallback, useMemo, useState } from "react";
import {
    Box,
    Button,
    Divider,
    Chip
} from "@mui/joy";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import TextComponent from "../../../components/TextComponent";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import PaymentSummaryCard from "./PaymentSummaryCard";
import BillDetailList from "./BillDetailList";
import { useNavigate } from "react-router-dom";

const Row = ({ label, value, bold = false, color = "#444" }) => (
    <Box
        sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: .5
        }}
    >
        <TextComponent
            value={label}
            size={12}
            weight={bold ? 700 : 500}
            color={color}
        />

        <TextComponent
            value={value}
            size={12}
            weight={bold ? 700 : 600}
            color={color}
        />
    </Box>
);

const ActionCardButton = ({
    title = "Bill Details",
    subtitle = "View bill",
    floating = true,
    loading = false,
    expand = false,
    billdetail = [],
    onClick,
    setOpenBillDialog,
    patientData
}) => {

    const [selectedItems, setSelectedItems] = useState([]);
    const navigate = useNavigate();

    const billMap = new Map(
        (billdetail || [])?.map(item => [item.ledger_id, item])
    );

    const FinalBillingItem = (selectedItems || [])
        ?.map(id => billMap.get(id))
        ?.filter(Boolean);



    const items = useMemo(() => {

        return (billdetail || [])?.map(item => ({
            id: item.ledger_id,
            source: item.bill_source,

            name:
                item.bill_source === "DIET"
                    ? `${item.diet_name} • ${item.type_desc}`
                    : item.item_name,

            quantity: Number(item.quantity || 0),

            rate: Number(item.unit_rate || 0),

            gross: Number(item.gross_amount || 0),

            discount: Number(item.discount || 0),

            gst: Number(item.gst_amount || 0),

            total: Number(item.net_amount || 0)
        }));

    }, [billdetail]);

    const finalSelected = useMemo(() => {

        return (FinalBillingItem || [])?.map(item => ({
            id: item.ledger_id,
            source: item.bill_source,

            name:
                item.bill_source === "DIET"
                    ? `${item.diet_name} • ${item.type_desc}`
                    : item.item_name,

            quantity: Number(item.quantity || 0),

            rate: Number(item.unit_rate || 0),

            gross: Number(item.gross_amount || 0),

            discount: Number(item.discount || 0),

            gst: Number(item.gst_amount || 0),

            total: Number(item.net_amount || 0)
        }));

    }, [FinalBillingItem]);

    const summary = useMemo(() => ({
        gross: items?.reduce((a, b) => a + b.gross, 0),
        discount: items?.reduce((a, b) => a + b.discount, 0),
        gst: items?.reduce((a, b) => a + b.gst, 0),
        total: items?.reduce((a, b) => a + b.total, 0)
    }), [items]);

    const selectedSummary = useMemo(() => ({
        gross: finalSelected?.reduce((sum, item) => sum + item.gross, 0),
        discount: finalSelected?.reduce((sum, item) => sum + item.discount, 0),
        gst: finalSelected?.reduce((sum, item) => sum + item.gst, 0),
        total: finalSelected?.reduce((sum, item) => sum + item.total, 0),
    }), [finalSelected]);

    const handleNavigate = useCallback(() => {
        navigate("/diet/payment", {
            state: {
                items: finalSelected,
                summary: selectedSummary,
                amount: selectedSummary.total,
                deliveredAmount: summary.total,
                customer: patientData
            },
        })
    }, [FinalBillingItem, selectedSummary, summary])

    return (
        <Box
            sx={{
                ...(floating && {
                    position: "fixed",
                    bottom: 16,
                    left: 16,
                    right: 16,
                    zIndex: 999999,
                    maxWidth: 700,
                    mx: "auto"
                }),
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                borderRadius: 4,
                overflow: "hidden",
                // bgcolor: "#fff",

            }}
        >

            {/* BILL DETAILS (TOP) */}

            <BillDetailList
                expand={expand}
                items={items}
                summary={summary}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
            />


            <PaymentSummaryCard
                expand={expand}
                amount={selectedSummary.total}
                deliveredAmount={summary.total}
                onClick={handleNavigate}
            />


            {/* BOTTOM ACTION BAR */}

            <Box
                sx={{
                    p: 2,
                    bgcolor: "#fff",
                    borderTop: "1px solid #eee",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1
                    }}
                >

                    <ReceiptLongRoundedIcon
                        sx={{
                            color: "#582e7d"
                        }}
                    />

                    <Box>

                        <TextComponent
                            value={title}
                            size={14}
                            weight={700}
                        />

                    </Box>

                </Box>

                <Button
                    loading={loading}
                    sx={{
                        bgcolor: '#8629d1',
                        cursor: 'pointer'
                    }}
                    endDecorator={
                        expand
                            ? <ExpandLessRoundedIcon />
                            : <ChevronRightRoundedIcon />
                    }
                    onClick={expand ? () => setOpenBillDialog(false) : onClick}
                >
                    {expand ? "Hide" : "View"}
                </Button>

            </Box>

        </Box>
    );
};

export default memo(ActionCardButton);