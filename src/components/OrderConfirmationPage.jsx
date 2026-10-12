import React from "react";
import { Box } from "@mui/joy";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import Pride from "react-canvas-confetti/dist/presets/pride";
import randomInRange from "react-canvas-confetti/dist/helpers/randomInRange";
import { COLORS, FONT, focusRing } from "../Style/designTokens";

const OrderConfirmationPage = ({
    orderId,
    message = "The kitchen can see it now.",
    onBack,
    showCelebration
}) => {

    const decorateOptions = (defaultOptions) => ({
        ...defaultOptions,
        colors: [COLORS.plum, COLORS.orchid, COLORS.success],
        scalar: randomInRange(0.6, 1.2),
        particleCount: randomInRange(2, 8),
    });

    return (
        <Box
            sx={{
                flex: 1,
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                px: 3,
                position: "relative",
                fontFamily: FONT,
            }}
        >
            {/* Confetti: only right after the order was placed */}
            {showCelebration && (
                <Pride
                    autorun={{ speed: 20 }}
                    decorateOptions={decorateOptions}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
                />
            )}

            <CheckCircleRoundedIcon aria-hidden="true" sx={{ fontSize: 64, color: COLORS.success }} />

            <Box component="h2" role="status" sx={{ m: 0, mt: 2, fontSize: 28, fontWeight: 700, color: COLORS.ink, letterSpacing: "-0.01em" }}>
                Order placed
            </Box>

            <Box sx={{ mt: 1, fontSize: 16, lineHeight: 1.5, color: COLORS.muted }}>
                {message}
            </Box>

            {orderId && (
                <Box sx={{ mt: 2, fontSize: 15, fontWeight: 600, color: COLORS.ink }}>
                    {`Order ID: ${orderId}`}
                </Box>
            )}

            <Box
                component="button"
                type="button"
                onClick={onBack}
                sx={{
                    mt: 4, height: 52, px: 3, border: 0, borderRadius: "14px", cursor: "pointer",
                    bgcolor: COLORS.plum, color: COLORS.white, fontFamily: FONT, fontSize: 17, fontWeight: 700,
                    "&:active": { bgcolor: COLORS.plumDark },
                    ...focusRing,
                }}
            >
                View placed orders
            </Box>
        </Box>
    );
};

export default OrderConfirmationPage;
