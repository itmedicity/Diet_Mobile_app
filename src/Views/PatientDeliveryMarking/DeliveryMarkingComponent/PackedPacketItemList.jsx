import React, { memo } from "react";
import { Box, IconButton } from "@mui/joy";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import TextComponent from "../../../components/TextComponent";

const PackedPacketItemList = ({
    items = [],
    onRemoveItem
}) => {

    if (!items?.length) {
        return (
            <Box
                sx={{
                    py: 1,
                    px: 0.8,
                    textAlign: "center",
                    borderRadius: "8px",
                    background: "#fafafa",
                    border: "1px dashed #ddd"
                }}
            >
                <TextComponent
                    value="No items added"
                    size={7}
                    weight={600}
                    color="#999"
                />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 0.3
            }}
        >

            {items.map((foodItem, index) => {

                const itemId =
                    foodItem?.canteen_order_item_id ??
                    foodItem?.order_detail_id ??
                    foodItem?.item_id ??
                    index;

                return (
                    <Box
                        key={itemId}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            py: 0.35,
                            px: 0.7,
                            borderRadius: "7px",
                            background: "#fff",
                            border: "1px solid #eeeeee"
                        }}
                    >

                        {/* ITEM NAME */}
                        <Box
                            sx={{
                                flex: 1,
                                minWidth: 0
                            }}
                        >
                            <TextComponent
                                value={foodItem?.item_name}
                                size={8}
                                weight={700}
                            />
                        </Box>

                        {/* QUANTITY */}
                        <TextComponent
                            value={`× ${foodItem?.quantity ?? 0}`}
                            size={8}
                            weight={800}
                            color="#777"
                        />

                        {/* REMOVE */}
                        <IconButton
                            size="sm"
                            variant="plain"
                            color="danger"
                            onClick={() =>
                                onRemoveItem?.(foodItem)
                            }
                            sx={{
                                minWidth: 24,
                                width: 24,
                                height: 24,
                                borderRadius: "6px",

                                "&:hover": {
                                    background: "#fff0f0"
                                }
                            }}
                        >
                            <DeleteOutlineRoundedIcon
                                sx={{
                                    fontSize: 15
                                }}
                            />
                        </IconButton>

                    </Box>
                );
            })}

        </Box>
    );
};

export default memo(PackedPacketItemList);