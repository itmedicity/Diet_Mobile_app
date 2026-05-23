import { Box } from '@mui/joy'
import React, { memo, useMemo } from 'react'
import TextComponent from './TextComponent'
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import FormatListBulletedRoundedIcon from "@mui/icons-material/FormatListBulletedRounded";
import SwipeUpOrderBar from './SwipeUpOrderBar';

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
                bottom: 20,
                left: "50%",
                transform: "translateX(-50%)",
                width: "90%",
                // maxWidth: 380,
                height: 45,
                borderRadius: 10,
                bgcolor: "#fff",
                border: "1.5px solid #9d25b8",
                boxShadow:
                    "0 10px 25px rgba(0,0,0,0.08), 0 4px 10px rgba(157,37,184,0.08)",
                display: "flex",
                overflow: "hidden",
                zIndex: 1000,
            }}
        >

            {/* VIEW BUTTON (Only if localStorage exists) */}
            {hasOrders && (
                <Box
                    onClick={() => {
                        setShowConfirmation(false)
                        onOpen("view")
                    }}
                    sx={{
                        // flex: 1,
                        width: hasOrders ? '40%' : '0%',
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                        color: "#9d25b8",
                        borderRight: "1px solid #eee",
                        "&:active": { transform: "scale(0.95)" }
                    }}
                >
                    <VisibilityRoundedIcon sx={{ fontSize: 20, mr: 0.5 }} />
                    <TextComponent
                        value="Previous Order"
                        size={13}
                        weight={600}
                        color="#9d25b8"
                    />
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