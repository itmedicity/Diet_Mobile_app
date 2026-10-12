//  EmployeeInfo.jsx
import React, { memo } from "react";
import { Box } from "@mui/joy";
import { COLORS, FONT, focusRing } from "../Style/designTokens";

// who is logged in; the round badge opens the profile / log out drawer
const EmployeeInfo = ({ name = "", designation = "", onAvatarClick }) => {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0 }}>
            <Box
                component="button"
                type="button"
                onClick={onAvatarClick}
                aria-label="Open profile and log out"
                sx={{
                    flexShrink: 0, width: 40, height: 40, borderRadius: "50%", border: 0, cursor: "pointer",
                    bgcolor: COLORS.plum, color: COLORS.white, fontFamily: FONT, fontSize: 16, fontWeight: 700,
                    display: "grid", placeItems: "center",
                    ...focusRing,
                }}
            >
                {name?.charAt(0)?.toUpperCase() || "?"}
            </Box>

            <Box sx={{ minWidth: 0, fontFamily: FONT }}>
                <Box sx={{ fontSize: 15, fontWeight: 700, color: COLORS.ink, lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {name}
                </Box>
                <Box sx={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {designation}
                </Box>
            </Box>
        </Box>
    );
};

export default memo(EmployeeInfo);
