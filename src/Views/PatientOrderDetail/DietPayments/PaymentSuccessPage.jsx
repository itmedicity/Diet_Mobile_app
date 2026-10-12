import React from "react";
import { Box } from "@mui/joy";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import Pride from "react-canvas-confetti/dist/presets/pride";
import randomInRange from "react-canvas-confetti/dist/helpers/randomInRange";
import { useLocation, useNavigate } from "react-router-dom";
import { COLORS, FONT, focusRing } from "../../../Style/designTokens";

const PaymentSuccessPage = () => {

    const navigate = useNavigate();
    const { state } = useLocation();

    const {
        amount = 0,
        paymentMethod = "UPI",
        paymentDate = "",
        payerName = "",
        referenceNo = "",
        message = "The payment has been recorded.",
        title = "Payment recorded",
        buttonText = "Back to deliveries",
        showCelebration = true,
    } = state ?? {};

    const decorateOptions = (defaultOptions) => ({
        ...defaultOptions,
        colors: [COLORS.plum, COLORS.focus, COLORS.orchid, COLORS.success],
        scalar: randomInRange(0.7, 1.2),
        particleCount: randomInRange(3, 8),
    });

    const rows = [
        ["Method", paymentMethod],
        ["Date", paymentDate],
        ["Paid by", payerName],
        ["Reference", referenceNo],
    ].filter(([, value]) => value);

    return (
        <Box
            sx={{
                minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                bgcolor: COLORS.wash, px: 2.5, py: 4, position: "relative", fontFamily: FONT, boxSizing: "border-box",
            }}
        >
            {showCelebration && (
                <Pride
                    autorun={{ speed: 18 }}
                    decorateOptions={decorateOptions}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
                />
            )}

            <Box sx={{ width: "100%", maxWidth: 430, textAlign: "center", position: "relative" }}>
                <CheckCircleRoundedIcon aria-hidden="true" sx={{ fontSize: 72, color: COLORS.success }} />
                <Box role="status" sx={{ mt: 1, fontSize: 26, fontWeight: 700, color: COLORS.ink }}>{title}</Box>
                <Box sx={{ mt: 0.5, fontSize: 16, color: COLORS.muted }}>{message}</Box>

                <Box sx={{ mt: 3, p: 2.5, borderRadius: "20px", bgcolor: COLORS.white, border: `1px solid ${COLORS.line}` }}>
                    <Box sx={{ fontSize: 15, color: COLORS.muted }}>Amount collected</Box>
                    <Box sx={{ fontSize: 40, fontWeight: 700, color: COLORS.ink, lineHeight: 1.2 }}>
                        {`₹${Number(amount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    </Box>

                    {rows.length > 0 && (
                        <Box sx={{ mt: 1.5, pt: 1, borderTop: `1px solid ${COLORS.line}`, textAlign: "left" }}>
                            {rows.map(([label, value]) => (
                                <Box key={label} sx={{ display: "flex", justifyContent: "space-between", gap: 2, py: 0.75 }}>
                                    <Box sx={{ fontSize: 15, color: COLORS.muted }}>{label}</Box>
                                    <Box sx={{ fontSize: 15, fontWeight: 600, color: COLORS.ink, textAlign: "right", wordBreak: "break-all" }}>{value}</Box>
                                </Box>
                            ))}
                        </Box>
                    )}
                </Box>

                <Box
                    component="button"
                    type="button"
                    onClick={() => navigate("/delivery")}
                    sx={{
                        mt: 3, width: "100%", height: 56, border: 0, borderRadius: "14px", cursor: "pointer",
                        bgcolor: COLORS.plum, color: COLORS.white, fontFamily: FONT, fontSize: 18, fontWeight: 700,
                        "&:active": { bgcolor: COLORS.plumDark }, ...focusRing,
                    }}
                >
                    {buttonText}
                </Box>
            </Box>
        </Box>
    );
};

export default PaymentSuccessPage;
