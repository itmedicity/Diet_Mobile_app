import React, { memo } from "react";
import { Box } from "@mui/joy";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { getItemType } from "../../../CommonData/Common";
import { COLORS, FONT, focusRing } from "../../../Style/designTokens";

const stepButton = (danger) => ({
    width: 44, height: 44, p: 0, border: 0, borderRadius: "12px", cursor: "pointer",
    display: "grid", placeItems: "center",
    bgcolor: danger ? "#FBE9E7" : COLORS.wash,
    color: danger ? COLORS.error : COLORS.plum,
    "&:active": { bgcolor: danger ? "#F5CFC9" : COLORS.orchid },
    ...focusRing,
});

// One food line of a placed order; in edit mode it gets the quantity stepper and a remove button
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
        <Box
            sx={{
                display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1,
                py: 1, minHeight: 44, fontFamily: FONT,
                borderTop: index === 0 ? "none" : `1px solid ${COLORS.line}`,
            }}
        >
            <Box sx={{ minWidth: 0 }}>
                <Box sx={{ fontSize: 16, fontWeight: 600, color: COLORS.ink }}>{item?.item_name}</Box>
                {selectedStatus === "PENDING" && (
                    <Box sx={{ fontSize: 13, color: COLORS.muted }}>
                        {selected !== "BYSTANDER" ? itemType : "Canteen"}
                    </Box>
                )}
            </Box>

            {editingOrder ? (
                <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Box component="button" type="button" aria-label={`Fewer ${item?.item_name}`}
                        onClick={() => updateQuantity(item.item_id, "dec")} sx={stepButton(false)}>
                        <RemoveIcon />
                    </Box>

                    <Box aria-live="polite" sx={{ minWidth: 28, textAlign: "center", fontSize: 18, fontWeight: 700, color: COLORS.ink }}>
                        {item?.quantity}
                    </Box>

                    <Box component="button" type="button" aria-label={`More ${item?.item_name}`}
                        onClick={() => updateQuantity(item.item_id, "inc")} sx={stepButton(false)}>
                        <AddIcon />
                    </Box>

                    {order?.items?.length > 1 && (
                        <Box component="button" type="button" aria-label={`Remove ${item?.item_name} from this order`}
                            onClick={() => handleCancelItem(order, item)} sx={{ ...stepButton(true), ml: 0.5 }}>
                            <DeleteOutlineRoundedIcon />
                        </Box>
                    )}
                </Box>
            ) : (
                <Box sx={{ flexShrink: 0, fontSize: 18, fontWeight: 700, color: COLORS.ink }}>
                    {`× ${item?.quantity}`}
                </Box>
            )}
        </Box>
    );
};

export default memo(OrderItemRow);
