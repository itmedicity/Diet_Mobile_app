import React, { memo } from "react";
import { Box } from "@mui/joy";
import { useCashSummaryDetail } from "../../CommonData/UseQuery";
import { EmpauthId } from "../Constant/Constant";
import CashCollectionSummarySkeleton from "./CollectionComponent/CashCollectionSummarySkeleton";
import CollectionPage, { money } from "./CollectionComponent/CollectionPage";
import { COLORS } from "../../Style/designTokens";


const CashCollectionSummary = () => {
    const id = EmpauthId()

    const {
        data: SummaryDetails = [],
        isLoading,
    } = useCashSummaryDetail(id);

    const {
        total_collected = 0,
        cash_collected = 0,
        total_transactions = 0,
    } = SummaryDetails[0] || {};

    if (isLoading) { return <CashCollectionSummarySkeleton />; }

    // the server adds up every successful payment you collected (the "today only" filter is switched off there)
    return (
        <CollectionPage title="Collection summary" subtitle="All payments you have collected">
            <Box sx={{ p: 2.5, borderRadius: "20px", bgcolor: COLORS.plum, color: COLORS.white }}>
                <Box sx={{ fontSize: 15, opacity: 0.9 }}>Total collected</Box>
                <Box sx={{ fontSize: 40, fontWeight: 700, lineHeight: 1.15 }}>{money(total_collected)}</Box>
                <Box sx={{ mt: 0.5, fontSize: 15, opacity: 0.9 }}>
                    {`${total_transactions} ${Number(total_transactions) === 1 ? "payment" : "payments"}`}
                </Box>
            </Box>

            <Box sx={{ mt: 1.5, px: 2, py: 1.75, borderRadius: "16px", bgcolor: COLORS.white, border: `1px solid ${COLORS.line}`, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <Box sx={{ fontSize: 17, color: COLORS.ink }}>Of which cash</Box>
                <Box sx={{ fontSize: 22, fontWeight: 700, color: COLORS.ink }}>{money(cash_collected)}</Box>
            </Box>
        </CollectionPage>
    );
};

export default memo(CashCollectionSummary);
