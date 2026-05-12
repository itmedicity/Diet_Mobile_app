import React, { memo } from "react";
import { Box } from "@mui/joy";
import TextComponent from "./TextComponent";

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
                key={food.food_id}
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 1.2,
                    borderBottom:
                        index !== foods.length - 1
                            ? "1px dashed #8e8c8c"
                            : "none",
                }} >
                <Box>
                    <TextComponent
                        value={food.item_name}
                        size={14}
                        weight={600}
                    />
                    <TextComponent
                        value={`₹${price} × ${food.qty}`}
                        size={11}
                        color="#777"
                    />
                </Box>

                <TextComponent
                    value={`₹${price * food.qty}`}
                    size={14}
                    weight={700}
                />
            </Box>
        );
    });
};

export default memo(RenderFoodList);