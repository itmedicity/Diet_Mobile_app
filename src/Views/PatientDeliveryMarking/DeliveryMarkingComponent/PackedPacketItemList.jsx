import React, { memo } from "react";
import { Box } from "@mui/joy";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { COLORS, FONT, focusRing } from "../../../Style/designTokens";

// Items already placed in one packet; each can be taken back out
const PackedPacketItemList = ({
    items = [],
    onRemoveItem
}) => {

    if (!items?.length) {
        return (
            <Box sx={{ py: 1.5, textAlign: "center", fontFamily: FONT, fontSize: 15, color: COLORS.muted }}>
                No items in this packet
            </Box>
        );
    }

    return (
        <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, fontFamily: FONT }}>

            {items.map((foodItem, index) => {

                const itemId =
                    foodItem?.canteen_order_item_id ??
                    foodItem?.order_detail_id ??
                    foodItem?.item_id ??
                    index;

                return (
                    <Box
                        component="li"
                        key={itemId}
                        sx={{
                            display: "flex", alignItems: "center", gap: 1, minHeight: 48,
                            borderTop: index === 0 ? "none" : `1px solid ${COLORS.line}`,
                        }}
                    >
                        <Box sx={{ flex: 1, minWidth: 0, fontSize: 16, fontWeight: 600, color: COLORS.ink }}>
                            {foodItem?.item_name}
                        </Box>

                        <Box sx={{ fontSize: 15, fontWeight: 700, color: COLORS.muted }}>
                            {`× ${foodItem?.quantity ?? 0}`}
                        </Box>

                        {onRemoveItem && (
                            <Box
                                component="button"
                                type="button"
                                aria-label={`Take ${foodItem?.item_name} out of the packet`}
                                onClick={() => onRemoveItem(foodItem)}
                                sx={{
                                    flexShrink: 0, width: 44, height: 44, border: 0, borderRadius: "12px", cursor: "pointer",
                                    display: "grid", placeItems: "center", bgcolor: "#FBE9E7", color: COLORS.error, ...focusRing,
                                }}
                            >
                                <DeleteOutlineRoundedIcon />
                            </Box>
                        )}
                    </Box>
                );
            })}

        </Box>
    );
};

export default memo(PackedPacketItemList);
