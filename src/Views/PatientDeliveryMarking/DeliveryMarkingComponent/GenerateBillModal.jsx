import React, { useState } from "react";
import { Box } from "@mui/joy";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { COLORS, FONT, focusRing } from "../../../Style/designTokens";

const paymentTypes = [
    { value: "INPATIENT_CREDIT", title: "Inpatient credit", description: "Add to the patient's account", icon: <LocalHospitalRoundedIcon /> },
    { value: "CASH", title: "Cash", description: "Collect payment now", icon: <PaymentsRoundedIcon /> },
    { value: "BYSTANDER_CREDIT", title: "Bystander credit", description: "Credit to the bystander", icon: <PersonRoundedIcon /> },
];

// Bottom sheet: how will this bill be paid?
const GenerateBillModal = ({ open, onClose, onContinue, loading = false }) => {
    const [selectedType, setSelectedType] = useState("CASH");

    if (!open) return null;

    const handleContinue = () => {
        if (!selectedType || loading) return;
        onContinue?.(selectedType);
    };

    return (
        <>
            <Box onClick={onClose} sx={{ position: "fixed", inset: 0, bgcolor: "rgba(42,16,56,0.5)", zIndex: 1700 }} />

            <Box
                role="dialog"
                aria-modal="true"
                aria-label="Generate bill"
                sx={{
                    position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 1800, maxWidth: 560, mx: "auto",
                    bgcolor: COLORS.white, borderRadius: "28px 28px 0 0", fontFamily: FONT,
                    pb: "calc(16px + env(safe-area-inset-bottom))",
                }}
            >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", px: 2.5, pt: 2.5, pb: 1 }}>
                    <Box>
                        <Box sx={{ fontSize: 22, fontWeight: 700, color: COLORS.ink }}>Generate bill</Box>
                        <Box sx={{ mt: 0.25, fontSize: 15, color: COLORS.muted }}>How will this bill be paid?</Box>
                    </Box>
                    <Box component="button" type="button" aria-label="Close" onClick={onClose}
                        sx={{
                            width: 48, height: 48, border: 0, borderRadius: "50%", cursor: "pointer",
                            display: "grid", placeItems: "center", bgcolor: COLORS.wash, color: COLORS.plum, ...focusRing,
                        }}>
                        <CloseRoundedIcon />
                    </Box>
                </Box>

                <Box role="radiogroup" aria-label="Bill pay type" sx={{ display: "flex", flexDirection: "column", gap: 1.25, px: 2.5, pt: 1 }}>
                    {paymentTypes.map((type) => {
                        const selected = selectedType === type.value;
                        return (
                            <Box
                                key={type.value}
                                component="button"
                                type="button"
                                role="radio"
                                aria-checked={selected}
                                onClick={() => setSelectedType(type.value)}
                                sx={{
                                    minHeight: 68, px: 1.75, borderRadius: "14px", cursor: "pointer", textAlign: "left", fontFamily: FONT,
                                    display: "flex", alignItems: "center", gap: 1.5,
                                    bgcolor: selected ? COLORS.wash : COLORS.white,
                                    border: `${selected ? 2 : 1.5}px solid ${selected ? COLORS.plum : COLORS.fieldBorder}`,
                                    color: COLORS.plum, ...focusRing,
                                }}
                            >
                                {type.icon}
                                <Box sx={{ flex: 1 }}>
                                    <Box sx={{ fontSize: 17, fontWeight: 700, color: COLORS.ink }}>{type.title}</Box>
                                    <Box sx={{ fontSize: 14, color: COLORS.muted }}>{type.description}</Box>
                                </Box>
                                <Box
                                    sx={{
                                        width: 24, height: 24, borderRadius: "50%", display: "grid", placeItems: "center",
                                        border: `2px solid ${COLORS.plum}`,
                                    }}
                                >
                                    {selected && <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: COLORS.plum }} />}
                                </Box>
                            </Box>
                        );
                    })}
                </Box>

                <Box sx={{ px: 2.5, pt: 2 }}>
                    <Box
                        component="button"
                        type="button"
                        onClick={handleContinue}
                        disabled={!selectedType || loading}
                        sx={{
                            width: "100%", height: 52, border: 0, borderRadius: "14px", cursor: "pointer",
                            bgcolor: COLORS.plum, color: COLORS.white, fontFamily: FONT, fontSize: 17, fontWeight: 700,
                            "&:active": { bgcolor: COLORS.plumDark },
                            "&:disabled": { bgcolor: COLORS.orchid, color: COLORS.muted, cursor: "not-allowed" },
                            ...focusRing,
                        }}
                    >
                        {loading ? "Generating bill…" : "Generate bill"}
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default GenerateBillModal;
