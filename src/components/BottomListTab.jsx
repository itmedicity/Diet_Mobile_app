import { Box } from '@mui/joy'
import React, { memo, useMemo } from 'react'
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import SwipeUpOrderBar from './SwipeUpOrderBar';
import { COLORS, FONT, focusRing } from '../Style/designTokens';

const BottomListTab = ({
    assignedFoods,
    onOpen,
    setShowConfirmation,
    selected,
    hasOrders
}) => {



    const { totalAmount, totalItems } = useMemo(() => {
        let totalAmount = 0;
        let totalItems = 0;

        Object.values(assignedFoods || {}).forEach(time => {
            (time?.foods || []).forEach(food => {

                const priceObj = food.prices?.find(
                    p => p.party_name?.toUpperCase() === selected?.party_name?.toUpperCase()
                );

                const price = priceObj?.price || 0;

                if (food.qty > 0) {
                    totalAmount += price * food.qty;
                    totalItems += 1;
                }
            });
        });

        return { totalAmount, totalItems };
    }, [assignedFoods, selected]);



    const hasItems = totalItems > 0;



    return (
        <Box
            sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                boxSizing: "border-box",
                px: 2,
                pt: 1.25,
                pb: "calc(12px + env(safe-area-inset-bottom))",
                bgcolor: COLORS.white,
                borderTop: `1px solid ${COLORS.line}`,
                display: "flex",
                gap: 1,
                zIndex: 1000,
            }}
        >

            {/* previous orders of this patient / bystander, shown only when there are some */}
            {hasOrders && (
                <Box
                    component="button"
                    type="button"
                    onClick={() => {
                        setShowConfirmation(false)
                        onOpen("view")
                    }}
                    sx={{
                        flexShrink: 0,
                        height: 56,
                        px: 2,
                        borderRadius: "16px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 0.75,
                        border: `1.5px solid ${COLORS.plum}`,
                        bgcolor: COLORS.white,
                        color: COLORS.plum,
                        fontFamily: FONT,
                        fontSize: 15,
                        fontWeight: 700,
                        "&:active": { bgcolor: COLORS.wash },
                        ...focusRing,
                    }}
                >
                    <VisibilityRoundedIcon aria-hidden="true" sx={{ fontSize: 20 }} />
                    Previous
                </Box>
            )}

            {/* LIST BUTTON */}

            <SwipeUpOrderBar
                hasItems={hasItems}
                totalItems={totalItems}
                totalAmount={totalAmount}
                onOpen={onOpen}
                hasOrders={hasOrders}
            />

        </Box>
    )
}

export default memo(BottomListTab);