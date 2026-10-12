import React from "react";
import { Box } from "@mui/joy";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import qrcodeimage from "../../../assets/images/qrcode.png";
import { COLORS, FONT, focusRing } from "../../../Style/designTokens";

// Bottom sheet showing the hospital UPI QR code
const UploadQrcode = ({
    open,
    onClose,
    title = "Scan to pay",
    subtitle = "Ask the payer to scan this with any UPI app, then enter the transaction ID.",
}) => {

    if (!open) return null;

    return (
        <>
            <Box onClick={onClose} sx={{ position: "fixed", inset: 0, bgcolor: "rgba(42,16,56,0.5)", zIndex: 1700 }} />

            <Box
                role="dialog"
                aria-modal="true"
                aria-label={title}
                sx={{
                    position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 1800, maxWidth: 560, mx: "auto",
                    bgcolor: COLORS.white, borderRadius: "28px 28px 0 0", fontFamily: FONT,
                    pb: "calc(20px + env(safe-area-inset-bottom))",
                }}
            >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1, px: 2.5, pt: 2.5 }}>
                    <Box>
                        <Box sx={{ fontSize: 22, fontWeight: 700, color: COLORS.ink }}>{title}</Box>
                        <Box sx={{ mt: 0.25, fontSize: 15, color: COLORS.muted, lineHeight: 1.4 }}>{subtitle}</Box>
                    </Box>
                    <Box component="button" type="button" aria-label="Close" onClick={onClose}
                        sx={{
                            flexShrink: 0, width: 48, height: 48, border: 0, borderRadius: "50%", cursor: "pointer",
                            display: "grid", placeItems: "center", bgcolor: COLORS.wash, color: COLORS.plum, ...focusRing,
                        }}>
                        <CloseRoundedIcon />
                    </Box>
                </Box>

                <Box sx={{ mx: "auto", mt: 2, width: "min(72vw, 320px)", aspectRatio: "1", borderRadius: "16px", overflow: "hidden", border: `1px solid ${COLORS.line}` }}>
                    <img src={qrcodeimage} alt="UPI QR code" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                </Box>
            </Box>
        </>
    );
};

export default UploadQrcode;
