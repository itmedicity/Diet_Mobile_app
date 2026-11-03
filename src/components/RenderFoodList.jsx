import React, { memo } from "react";
import { Box, Checkbox } from "@mui/joy";
import TextComponent from "./TextComponent";

const RenderFoodList = ({
    foods = [],
    selected,
    onToggleUrgent,
    disable
}) => {
    const selectedType = selected?.toUpperCase();

    return foods.map((food, index) => {
        const selectedPriceObj = food?.prices?.find(
            (p) => p.party_name?.toUpperCase() === selectedType
        );

        const price = selectedPriceObj?.price || 0;

        return (
            <Box
                key={food.item_id ?? food.food_id}
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 1.2,
                    borderBottom:
                        index !== foods.length - 1
                            ? "1px dashed #8e8c8c"
                            : "none",
                    gap: 1,
                }}
            >
                <Box sx={{ flex: 1, minWidth: 0 }}>
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

                    <Checkbox
                        size="sm"
                        disabled={disable}
                        checked={Boolean(food.is_urgent)}
                        onChange={() => onToggleUrgent?.(food.item_id)}
                        label="Urgent"
                        sx={{
                            mt: 0.5,
                            fontSize: 11,
                            "--Checkbox-size": "15px",
                            color: food.is_urgent ? "#d32f2f" : "#777",
                        }}
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