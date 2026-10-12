import React, { memo } from "react";
import { Box } from "@mui/joy";
import { COLORS, FONT } from "../Style/designTokens";

// One line per food: name, "₹price × qty", and the line total
const RenderFoodList = ({ foods = [], selected }) => {

    const selectedType = selected?.toUpperCase(); // normalize once

    return foods?.map((food, index) => {

        //  FIX: case-safe comparison
        const selectedPriceObj = food?.prices?.find(
            (p) => p.party_name?.toUpperCase() === selectedType
        );

        const price = selectedPriceObj?.price || 0;

        return (
            <Box
                key={food.item_id ?? food.food_id ?? index}
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    gap: 2,
                    py: 1.25,
                    fontFamily: FONT,
                    borderBottom: index !== foods.length - 1 ? `1px solid ${COLORS.line}` : "none",
                }} >
                <Box sx={{ minWidth: 0 }}>
                    <Box sx={{ fontSize: 16, fontWeight: 600, color: COLORS.ink }}>{food.item_name}</Box>
                    <Box sx={{ fontSize: 14, color: COLORS.muted }}>{`₹${price} × ${food.qty}`}</Box>
                </Box>

                <Box sx={{ flexShrink: 0, fontSize: 16, fontWeight: 700, color: COLORS.ink }}>
                    {`₹${price * food.qty}`}
                </Box>
            </Box>
        );
    });
};

export default memo(RenderFoodList);
