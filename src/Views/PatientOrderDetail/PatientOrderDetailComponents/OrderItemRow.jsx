import React, { memo } from "react";
import { Box, IconButton } from "@mui/joy";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import { getBgColor, getItemType } from "../../../CommonData/Common";
import TextComponent from "../../../components/TextComponent";

const OrderItemRow = ({
    item,
    index,
    selected,
    editingOrder,
    updateQuantity,
    handleCancelItem,
    order,
    selectedStatus
}) => {

    const itemType = getItemType(item);

    return (
        <Box sx={{ mb: 1 }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    py: 0.5,
                }}
            >
                {/* LEFT SIDE */}
                <Box sx={{ display: 'flex', gap: 0.2 }}>

                    <TextComponent
                        value={`${index + 1} .`}
                        size={10}
                        color="#555"
                    />

                    <TextComponent
                        value={item?.item_name}
                        size={10}
                        color="#555"
                    />
                    {
                        selectedStatus === "PENDING" &&
                        <Box
                            sx={{
                                bgcolor: getBgColor(itemType),
                                color: "#fff",
                                fontSize: 8,
                                px: 1,
                                py: 0.5,
                                borderRadius: 5,
                                fontWeight: 600,
                                textAlign: 'center',
                                height: 10,
                                ml: 1
                            }}
                        >
                            {selected !== "BYSTANDER" ? itemType : "CANTEEN"}
                        </Box>

                    }
                </Box>

                {/* RIGHT SIDE */}
                {editingOrder ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>

                        <IconButton
                            size="sm"
                            color="primary"
                            variant="soft"
                            onClick={() => updateQuantity(item.item_id, "dec")}
                        >
                            <RemoveIcon sx={{ fontSize: 15 }} />
                        </IconButton>

                        <TextComponent
                            value={`${item?.quantity}`}
                            size={10}
                            weight={600}
                            color="#2e7d32"
                        />

                        <IconButton
                            size="sm"
                            color="success"
                            variant="soft"
                            onClick={() => updateQuantity(item.item_id, "inc")}
                        >
                            <AddIcon sx={{ fontSize: 15 }} />
                        </IconButton>


                        {order?.items?.length > 1 && (
                            <IconButton
                                size="sm"
                                color="danger"
                                variant="soft"
                                onClick={() => handleCancelItem(order, item)}
                            >
                                <CancelIcon sx={{ fontSize: 15 }} />
                            </IconButton>
                        )}
                        {/* <IconButton
                            size="sm"
                            color="danger"
                            variant="soft"
                            onClick={() => handleCancelItem(order, item)}
                        >
                            <CancelIcon sx={{ fontSize: 15 }} />
                        </IconButton> */}

                    </Box>
                ) : (
                    <TextComponent
                        value={`${item?.quantity}`}
                        size={10}
                        weight={600}
                        color="#2e7d32"
                    />
                )}
            </Box>
        </Box>
    );
};

export default memo(OrderItemRow);