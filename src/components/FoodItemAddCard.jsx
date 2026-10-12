import { Box } from '@mui/joy'
import React, { memo } from 'react'
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { COLORS, FONT, focusRing } from '../Style/designTokens';

const stepButton = {
    width: 44, height: 44, p: 0, border: 0, borderRadius: "12px", cursor: "pointer",
    display: "grid", placeItems: "center",
    bgcolor: COLORS.wash, color: COLORS.plum,
    "&:active": { bgcolor: COLORS.orchid },
    "&:disabled": { opacity: 0.4, cursor: "not-allowed" },
    ...focusRing,
};

// One food item: tap the row (or "Add") to select it, then use the stepper for the quantity.
const FoodItemAddCard = ({
    onIncrement,
    onDecrement,
    assignedFood,
    foodDetail,
    onClick
}) => {

    const name = foodDetail?.item_name;
    const group = foodDetail?.category;
    const qty = assignedFood?.qty || 0;
    const added = !!assignedFood;
    const description = foodDetail?.description;

    return (
        <Box
            sx={{
                width: '100%', boxSizing: "border-box", mb: 1, p: 1.25, borderRadius: "16px", fontFamily: FONT,
                display: 'flex', alignItems: 'center', gap: 1,
                bgcolor: added ? COLORS.wash : COLORS.white,
                border: `${added ? 2 : 1}px solid ${added ? COLORS.plum : COLORS.line}`,
            }}>

            <Box
                component="button"
                type="button"
                onClick={onClick}
                aria-pressed={added}
                sx={{
                    flex: 1, minWidth: 0, minHeight: 48, p: 0.5, border: 0, bgcolor: "transparent", cursor: "pointer",
                    textAlign: "left", fontFamily: FONT, borderRadius: "10px",
                    ...focusRing,
                }}
            >
                <Box sx={{ fontSize: 16, fontWeight: 600, color: COLORS.ink, lineHeight: 1.3 }}>{name}</Box>
                {(description || group) && (
                    <Box sx={{ mt: 0.25, fontSize: 13, color: COLORS.muted, lineHeight: 1.35 }}>
                        {[description, group].filter(Boolean).join("  ·  ")}
                    </Box>
                )}
            </Box>

            {added ? (
                <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 0.5 }}>
                    {qty <= 1 ? (
                        // at 1 the minus becomes "remove", so an item can be taken off without hunting for the row
                        <Box component="button" type="button" onClick={onClick} aria-label={`Remove ${name}`} sx={stepButton}>
                            <DeleteOutlineRoundedIcon />
                        </Box>
                    ) : (
                        <Box component="button" type="button" onClick={onDecrement} aria-label={`Fewer ${name}`} sx={stepButton}>
                            <RemoveIcon />
                        </Box>
                    )}

                    <Box aria-live="polite" sx={{ minWidth: 28, textAlign: "center", fontSize: 18, fontWeight: 700, color: COLORS.ink }}>
                        {qty}
                    </Box>

                    <Box component="button" type="button" onClick={onIncrement} aria-label={`More ${name}`} sx={stepButton}>
                        <AddIcon />
                    </Box>
                </Box>
            ) : (
                <Box
                    component="button"
                    type="button"
                    onClick={onClick}
                    aria-label={`Add ${name}`}
                    sx={{
                        flexShrink: 0, height: 44, px: 2, borderRadius: "12px", cursor: "pointer",
                        border: `1.5px solid ${COLORS.plum}`, bgcolor: COLORS.white, color: COLORS.plum,
                        fontFamily: FONT, fontSize: 16, fontWeight: 700,
                        "&:active": { bgcolor: COLORS.wash },
                        ...focusRing,
                    }}
                >
                    Add
                </Box>
            )}
        </Box>
    )
}

export default memo(FoodItemAddCard)
