import React from "react";
import { Box } from "@mui/joy";
import TextComponent from "./TextComponent";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import RenderFoodList from "./RenderFoodList"; // your memoized component


const OrderSummaryContent = ({ assignedFoods, selected }) => {
    const hasItems = Object.keys(assignedFoods || {}).length > 0;


    // Flatten foods for bystanders
    const bystanderFoods =
        selected === "BYSTANDER"
            ? Object.values(assignedFoods)
                .flatMap((time) => time.foods)
                .map((food) => ({ ...food, qty: food.qty || 1 }))
            : [];

    return (
        <Box
            sx={{
                flex: 1,
                overflow: "hidden",
                px: 2,
                py: 2,
                bgcolor: "#f9f9fb",
                borderTopRightRadius: 16,
                borderTopLeftRadius: 16,
                position: "relative",
            }}
        >


            <Box
                sx={{
                    height: "100%",
                    overflowY: "auto",
                    "&::-webkit-scrollbar": { display: "none" },
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                }}
            >
                {!hasItems && (
                    <Box
                        sx={{
                            mt: 6,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            opacity: 0.6,
                        }}
                    >
                        <Box
                            sx={{
                                width: 70,
                                height: 70,
                                borderRadius: "50%",
                                bgcolor: "#dedcdc",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mb: 2,
                                fontSize: 28,
                            }}
                        >
                            🍽️
                        </Box>

                        <TextComponent
                            value="No items selected"
                            size={15}
                            weight={600}
                            color="#666"
                        />
                    </Box>
                )}

                {selected === "PATIENT" ? (
                    // Patient view: grouped by time
                    Object.entries(assignedFoods || {})?.map(([timeId, time]) => (
                        <Box
                            key={timeId}
                            sx={{
                                mb: 3,
                                bgcolor: "#ffffff",
                                borderRadius: 14,
                                p: 2,
                                boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                            }}
                        >
                            <Box sx={{ mb: 1.5 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <FastfoodIcon sx={{ fontSize: 15, color: "#7b1fa2" }} />
                                    <TextComponent value={time.time_name} size={13} weight={700} />
                                </Box>
                            </Box>
                            <RenderFoodList foods={time?.foods} selected={selected} />
                        </Box>
                    ))
                ) : (
                    // Bystander view: flat list
                    bystanderFoods?.length > 0 && (
                        <Box
                            sx={{
                                mb: 3,
                                bgcolor: "#ffffff",
                                borderRadius: 14,
                                p: 2,
                                boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                            }}
                        >
                            <TextComponent value="Food Item" size={14} weight={700} sx={{ mb: 1 }} />
                            <RenderFoodList foods={bystanderFoods} selected={selected} />
                        </Box>
                    )
                )}
            </Box>
        </Box>
    );
};

export default OrderSummaryContent;