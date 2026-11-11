import React, { memo } from "react";
import { Box, Checkbox } from "@mui/joy";
import TextComponent from "./TextComponent";
import { useProductionBatchDetails } from "../CommonData/UseQuery";
import { EmpauthId } from "../Views/Constant/Constant";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";


const RenderFoodList = ({
    foods = [],
    selected,
    onToggleUrgent,
    disable
}) => {
    const selectedType = selected?.toUpperCase();

    const empId = EmpauthId();

    const {
        data: productionDetails = [],
    } = useProductionBatchDetails(empId);


    const ActiveProdcutionBatchDetail = productionDetails?.filter(
        item => String(item?.batch_status) === "ACTIVE"
    ) || [];


    return foods?.map((food, index) => {
        const selectedPriceObj = food?.prices?.find(
            (p) => p.party_name?.toUpperCase() === selectedType
        );

        const MatchedTime = ActiveProdcutionBatchDetail &&
            ActiveProdcutionBatchDetail?.length > 0
            ? ActiveProdcutionBatchDetail
                ?.find(item => item.type_desc === food.time_name) : {}

        const price = selectedPriceObj?.price || 0;

        return (
            <Box
                key={food?.item_id ?? food.food_id}
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
                    {
                        MatchedTime &&
                        <TextComponent
                            value={`Direct Delviery Category of Batch BTC-${MatchedTime?.batch_id}`}
                            size={8}
                            weight={600}
                        />
                    }

                    <TextComponent
                        value={`₹${price} × ${food.qty}`}
                        size={11}
                        color="#777"
                    />

                    <Checkbox
                        size="sm"
                        disabled={disable || MatchedTime}
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
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: "flex-end"
                }}>
                    {
                        MatchedTime && (
                            <Box
                                sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 0.6,
                                    px: 1,
                                    py: 0.45,
                                    borderRadius: "20px",
                                    bgcolor: "#F3E8FF",
                                    color: "#8B2CBF",
                                    fontSize: 8,
                                    fontWeight: 800,
                                    letterSpacing: 0.3,
                                    border: "1px solid #E9D5FF",
                                    whiteSpace: "nowrap"
                                }}
                            >
                                <LocalShippingRoundedIcon sx={{ fontSize: 13 }} />
                                Instant Delivery
                            </Box>
                        )
                    }

                    <TextComponent
                        value={`₹${price * food.qty}`}
                        size={14}
                        weight={700}
                    />
                </Box>

            </Box>
        );
    });
};

export default memo(RenderFoodList);