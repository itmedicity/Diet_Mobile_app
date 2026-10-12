import React, { memo } from "react";
import { Box } from "@mui/joy";
import { COLORS } from "../Style/designTokens";
import { ROUNDS } from "../CommonData/mealRound";

// Breakfast / Lunch / Snacks / Dinner with the running round filled in
const MealRoundStrip = ({ activeIndex }) => (
    <Box
        component="ol"
        aria-label="Today's meal rounds"
        sx={{ listStyle: "none", m: 0, p: 0, display: "flex", gap: 0.75 }}
    >
        {ROUNDS.map((item, index) => {
            const active = index === activeIndex;
            return (
                <Box component="li" key={item.name} aria-current={active ? "step" : undefined} sx={{ flex: 1 }}>
                    <Box sx={{ height: 4, borderRadius: 2, bgcolor: active ? COLORS.plum : COLORS.orchid }} />
                    <Box
                        sx={{
                            mt: 0.75, fontSize: 13,
                            color: active ? COLORS.ink : COLORS.muted,
                            fontWeight: active ? 700 : 500,
                        }}
                    >
                        {item.name}
                    </Box>
                </Box>
            );
        })}
    </Box>
);

export default memo(MealRoundStrip);
