import React from "react";
import { Box } from "@mui/joy";
import RenderFoodList from "./RenderFoodList";
import { COLORS, FONT } from "../Style/designTokens";

// The order about to be placed: patient orders are grouped by meal, a bystander's is one flat list
const OrderSummaryContent = ({ assignedFoods, selected }) => {
    const hasItems = Object.keys(assignedFoods || {}).length > 0;

    // Flatten foods for bystanders
    const bystanderFoods =
        selected === "BYSTANDER"
            ? Object.values(assignedFoods)
                .flatMap((time) => time.foods)
                .map((food) => ({ ...food, qty: food.qty || 1 }))
            : [];

    const sectionSx = { mb: 2.5 };
    const headingSx = { fontSize: 15, fontWeight: 700, color: COLORS.plum, mb: 0.5 };

    return (
        <Box
            sx={{
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                px: 2.5,
                py: 2,
                fontFamily: FONT,
                "&::-webkit-scrollbar": { display: "none" },
                scrollbarWidth: "none",
            }}
        >
            {!hasItems && (
                <Box sx={{ mt: 4 }}>
                    <Box sx={{ fontSize: 18, fontWeight: 700, color: COLORS.ink }}>No items selected</Box>
                    <Box sx={{ mt: 0.5, fontSize: 15, lineHeight: 1.5, color: COLORS.muted }}>
                        Close this sheet and tap "Add" on the foods to order.
                    </Box>
                </Box>
            )}

            {selected === "PATIENT" ? (
                Object.entries(assignedFoods || {})?.map(([timeId, time]) => (
                    <Box key={timeId} sx={sectionSx}>
                        <Box sx={headingSx}>{time.time_name}</Box>
                        <RenderFoodList foods={time?.foods} selected={selected} />
                    </Box>
                ))
            ) : (
                bystanderFoods?.length > 0 && (
                    <Box sx={sectionSx}>
                        <Box sx={headingSx}>Food items</Box>
                        <RenderFoodList foods={bystanderFoods} selected={selected} />
                    </Box>
                )
            )}
        </Box>
    );
};

export default OrderSummaryContent;
