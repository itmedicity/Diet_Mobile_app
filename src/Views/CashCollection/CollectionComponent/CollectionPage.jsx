import React, { memo } from "react";
import { Box } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { COLORS, FONT, focusRing } from "../../../Style/designTokens";

// ₹1,234.50 ; a missing value shows ₹0.00 instead of "₹undefined"
export const money = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// Page frame shared by the cash collection screens: back arrow, title, centred column
const CollectionPage = ({ title, subtitle, children }) => {
    const navigate = useNavigate();

    return (
        <Box sx={{ minHeight: "100dvh", bgcolor: COLORS.surface, fontFamily: FONT }}>
            <Box
                component="header"
                sx={{
                    position: "sticky", top: 0, zIndex: 1100, minHeight: 64, px: 1, py: 0.75, boxSizing: "border-box",
                    display: "flex", alignItems: "center", gap: 0.5, bgcolor: COLORS.white, borderBottom: `1px solid ${COLORS.line}`,
                }}
            >
                <Box
                    component="button"
                    type="button"
                    aria-label="Go back"
                    onClick={() => navigate(-1)}
                    sx={{
                        flexShrink: 0, width: 44, height: 44, border: 0, bgcolor: "transparent", cursor: "pointer", borderRadius: "50%",
                        display: "grid", placeItems: "center", color: COLORS.ink, ...focusRing,
                    }}
                >
                    <ArrowBackRoundedIcon />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                    <Box component="h1" sx={{ m: 0, fontSize: 20, fontWeight: 700, color: COLORS.ink, lineHeight: 1.2 }}>{title}</Box>
                    {subtitle && <Box sx={{ fontSize: 14, color: COLORS.muted }}>{subtitle}</Box>}
                </Box>
            </Box>

            <Box sx={{ maxWidth: 560, mx: "auto", px: 2, pt: 2, pb: 4 }}>{children}</Box>
        </Box>
    );
};

// Grey bars shown while a page loads
export const SkeletonBlock = ({ height = 72, mb = 1.25 }) => (
    <Box
        aria-hidden="true"
        sx={{
            height, mb, borderRadius: "16px", bgcolor: COLORS.wash,
            "@media (prefers-reduced-motion: no-preference)": {
                animation: "collectionPulse 1.4s ease-in-out infinite",
                "@keyframes collectionPulse": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.5 } },
            },
        }}
    />
);

export default memo(CollectionPage);
