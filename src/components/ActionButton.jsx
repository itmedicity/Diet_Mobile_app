import React, { memo } from "react";
import { Box } from "@mui/joy";
import { COLORS, FONT, focusRing } from "../Style/designTokens";

// A secondary button next to a form or card. `danger` is for actions that cannot be undone.
const ActionButton = ({
    onClick,
    label,
    icon,
    danger = false,
    primary = false
}) => {
    const fg = danger ? COLORS.error : primary ? COLORS.white : COLORS.plum;
    const bg = primary ? COLORS.plum : COLORS.white;
    const border = danger ? COLORS.error : COLORS.plum;

    return (
        <Box
            component="button"
            type="button"
            onClick={onClick}
            sx={{
                flex: 1, minHeight: 48, px: 1.5, borderRadius: "12px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 0.75,
                fontFamily: FONT, fontSize: 16, fontWeight: 700,
                border: `1.5px solid ${border}`, bgcolor: bg, color: fg,
                "&:active": { opacity: 0.85 },
                ...focusRing,
            }}
        >
            {icon}
            {label}
        </Box>
    );
};

export default memo(ActionButton);
