import React, { memo, useCallback } from "react";
import { Box } from "@mui/joy";
import { EmpauthId } from "../Constant/Constant";
import { usePaymentReturnDetails } from "../../CommonData/UseQuery";
import CashReturnCard from "./CollectionComponent/CashReturnCard";
import CashReturnCardSkeleton from "./CollectionComponent/CashReturnCardSkeleton";
import CollectionPage from "./CollectionComponent/CollectionPage";
import { useNavigate } from "react-router-dom";
import { COLORS } from "../../Style/designTokens";


const CashReturnDetail = () => {
    const id = EmpauthId();

    const navigate = useNavigate();

    const {
        data: ReturnDetails = [],
        isLoading
    } = usePaymentReturnDetails(id);

    const handleCardClick = useCallback((payment) => {
        navigate(`/cash-collection/return/${payment?.billing_id}/${payment?.payment_id}`);
    }, [navigate]);

    return (
        <CollectionPage title="Cash return" subtitle="Change still owed to patients">
            {isLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                    <CashReturnCardSkeleton key={index} />
                ))
            ) : ReturnDetails?.length === 0 ? (
                <Box sx={{ py: 6, textAlign: "center", fontSize: 16, color: COLORS.muted }}>
                    No change is waiting to be returned.
                </Box>
            ) : (
                ReturnDetails?.map((payment, index) => (
                    <CashReturnCard
                        key={`${payment?.payment_id}-${index}`}
                        payment={payment}
                        onClick={handleCardClick}
                    />
                ))
            )}
        </CollectionPage>
    );
};

export default memo(CashReturnDetail);
