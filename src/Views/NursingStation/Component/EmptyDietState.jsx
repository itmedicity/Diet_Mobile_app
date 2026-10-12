import React, { memo } from "react";
import { Box } from "@mui/joy";
import NoMealsIcon from "@mui/icons-material/NoMeals";
import { COLORS, FONT } from "../../../Style/designTokens";


const EmptyDietState = ({
    title = "No diet meals yet",
    subtitle = "The kitchen has not processed this patient's diet. Meals show here once it is processed."
}) => {
    return (
        <Box sx={{ mt: 3, py: 3, fontFamily: FONT, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 1 }}>
            <NoMealsIcon aria-hidden="true" sx={{ fontSize: 40, color: COLORS.orchid }} />
            <Box sx={{ fontSize: 18, fontWeight: 700, color: COLORS.ink }}>{title}</Box>
            <Box sx={{ fontSize: 15, lineHeight: 1.5, color: COLORS.muted }}>{subtitle}</Box>
        </Box>
    );
};

export default memo(EmptyDietState);
