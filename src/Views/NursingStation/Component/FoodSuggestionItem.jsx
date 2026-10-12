import React, { memo } from "react";
import { Box } from "@mui/joy";
import { safeParseJSON } from "../../Constant/Common";
import { COLORS, FONT, focusRing } from "../../../Style/designTokens";

// Matching foods under the search box; tapping one selects it
const FoodSuggestionItem = ({ suggestions, onSelect, activeIndex, personType }) => {

    if (!suggestions?.length) return null;

    return (
        <Box
            component="ul"
            sx={{
                listStyle: "none", m: 0, mt: 1, p: 0, fontFamily: FONT,
                border: `1px solid ${COLORS.line}`, borderRadius: "14px", overflow: "hidden", bgcolor: COLORS.white,
            }}
        >
            {
                suggestions?.map((food, index) => {

                    const parsed = safeParseJSON(food.price_details);
                    const parsedPrices = Array.isArray(parsed) ? parsed : [];

                    const match = parsedPrices.find(
                        item => Number(item.party_type_id) === Number(personType)
                    );

                    // fallback if no match
                    const selected = match || parsedPrices[0] || {};

                    const finalFoodDetail = {
                        ...food,
                        price: selected.price ?? 0,
                        gst_rate: selected.gst_rate ?? 0,
                        discount: selected.discount ?? 0
                    };

                    return (
                        <Box
                            component="li"
                            key={food?.item_slno ?? food?.item_id ?? index}
                            sx={{ borderTop: index === 0 ? "none" : `1px solid ${COLORS.line}` }}
                        >
                            <Box
                                component="button"
                                type="button"
                                onClick={() => onSelect(finalFoodDetail)}
                                sx={{
                                    width: "100%", minHeight: 56, px: 1.5, py: 1, border: 0, cursor: "pointer", textAlign: "left",
                                    fontFamily: FONT,
                                    bgcolor: index === activeIndex ? COLORS.wash : "transparent",
                                    "&:active": { bgcolor: COLORS.wash },
                                    ...focusRing,
                                }}
                            >
                                <Box sx={{ fontSize: 16, fontWeight: 600, color: COLORS.ink }}>
                                    {food.item_name}
                                </Box>
                                <Box sx={{ fontSize: 14, color: COLORS.muted }}>
                                    {[food.item_code, food.category_name, `₹${match?.price ?? food.price ?? 0}`].filter(Boolean).join("  ·  ")}
                                </Box>
                            </Box>
                        </Box>
                    )
                })}
        </Box>
    );
};

export default memo(FoodSuggestionItem);
