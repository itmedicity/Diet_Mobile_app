import React, { memo } from "react";
import { Box, Chip, Divider, Button } from "@mui/joy";

import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";

import { format } from "date-fns";
import TextComponent from "../../components/TextComponent";

const BatchCard = ({ batch, onComplete, completing = false }) => {
    if (!batch) return null;

    const statusConfig = {
        ACTIVE: {
            color: "#D99020",
            bg: "#FFF5E3",
            icon: <AccessTimeRoundedIcon sx={{ fontSize: 14 }} />,
        },
        COMPLETED: {
            color: "#269B69",
            bg: "#E8F7EF",
            icon: <CheckCircleRoundedIcon sx={{ fontSize: 14 }} />,
        },
        CANCELLED: {
            color: "#D64545",
            bg: "#FDECEC",
            icon: <CancelRoundedIcon sx={{ fontSize: 14 }} />,
        },
    };

    const status = statusConfig[batch.batch_status] || statusConfig.ACTIVE;

    const productionDate = batch.production_date
        ? format(
            new Date(batch.production_date.replace(" ", "T")),
            "dd MMM yyyy, hh:mm a"
        )
        : "--";

    return (
        <Box
            sx={{
                bgcolor: "#fff",
                borderRadius: "18px",
                border: "1px solid #EEEEEE",
                p: 2,
                mb: 1.5,
                boxShadow: "0 4px 15px rgba(0,0,0,0.025)",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                    mb: 1.5,
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, minWidth: 0 }}>
                    <Box
                        sx={{
                            width: 42,
                            height: 42,
                            flexShrink: 0,
                            borderRadius: "12px",
                            bgcolor: "#F5E8F7",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Inventory2RoundedIcon sx={{ fontSize: 22, color: "#9b1ea9" }} />
                    </Box>

                    <Box sx={{ minWidth: 0 }}>
                        <TextComponent
                            size={14}
                            weight={900}
                            color="#222"
                            value={batch.type_desc || "Production Batch"}
                        />
                        <TextComponent
                            size={10}
                            color="#888"
                            value={`Batch #${batch.batch_id}`}
                        />
                    </Box>
                </Box>

                <Chip
                    size="sm"
                    startDecorator={status.icon}
                    sx={{
                        flexShrink: 0,
                        bgcolor: status.bg,
                        color: status.color,
                        fontSize: 9,
                        fontWeight: 800,
                        borderRadius: "8px",
                    }}
                >
                    {batch.batch_status}
                </Chip>
            </Box>

            <Divider sx={{ borderColor: "#F1F1F1" }} />

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 1,
                    py: 1.5,
                }}
            >
                <Box>
                    <TextComponent size={9} color="#888" value="PRODUCTION DATE" />
                    <Box mt={0.4}>
                        <TextComponent size={11} weight={700} color="#333" value={productionDate} />
                    </Box>
                </Box>

                <Box sx={{ textAlign: "right" }}>
                    <TextComponent size={9} color="#888" value="BATCH MODE" />
                    <Box mt={0.4}>
                        <TextComponent
                            size={10}
                            weight={800}
                            color="#9b1ea9"
                            value={batch.batch_mode?.replace(/_/g, " ") || "--"}
                        />
                    </Box>
                </Box>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    bgcolor: "#F8F8F8",
                    borderRadius: "10px",
                    px: 1.3,
                    py: 1,
                    mb: batch.production_item_id ? 1.5 : 0,
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                    <RestaurantRoundedIcon sx={{ fontSize: 16, color: "#888" }} />
                    <TextComponent size={10} color="#666" value="Kitchen Status" />
                </Box>

                <TextComponent
                    size={10}
                    weight={800}
                    color={batch.kitchen_status === "COMPLETED" ? "#269B69" : "#D99020"}
                    value={batch.kitchen_status || "--"}
                />
            </Box>

            {batch.production_item_id && (
                <Box sx={{ borderTop: "1px solid #F1F1F1", pt: 1.5 }}>
                    <Box mb={1}>
                        <TextComponent size={10} weight={800} color="#777" value="PRODUCTION ITEM" />
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box sx={{ minWidth: 0 }}>
                            <TextComponent size={12} weight={700} value={batch.item_name || "--"} />
                            <TextComponent size={10} color="#888" value={`Item #${batch.item_id}`} />
                        </Box>

                        <TextComponent
                            size={12}
                            weight={800}
                            value={`${batch.required_qty} ${batch.unit_id || ""}`}
                        />
                    </Box>
                </Box>
            )}

            {batch.batch_status === "ACTIVE" && (
                <Button
                    fullWidth
                    size="sm"
                    loading={completing}
                    disabled={completing}
                    startDecorator={<CheckCircleRoundedIcon />}
                    onClick={() => onComplete?.(batch.batch_id)}
                    sx={{
                        mt: 1.5,
                        minHeight: 38,
                        borderRadius: "10px",
                        bgcolor: "#269B69",
                        fontSize: 11,
                        fontWeight: 800,
                        "&:hover": {
                            bgcolor: "#208357",
                        },
                    }}
                >
                    MARK AS COMPLETED
                </Button>
            )}
        </Box>
    );
};

export default memo(BatchCard);