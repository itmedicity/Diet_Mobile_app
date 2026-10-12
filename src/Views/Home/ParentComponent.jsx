import React, { memo, useMemo } from "react";
import { Box } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import LoginEmployeeHeader from "../../components/LoginEmployeeHeader";
import MealRoundStrip from "../../components/MealRoundStrip";
import { ROUNDS, currentRoundIndex } from "../../CommonData/mealRound";
import { COLORS, FONT, focusRing } from "../../Style/designTokens";

// What staff can start from here, in the order of a ward round: take the order, deliver it, collect the cash
const ACTIONS = [
    {
        key: "order",
        path: "/Home",
        title: "Take an order",
        hint: "Choose a nursing station, then a patient's bed.",
        icon: AddRoundedIcon,
        primary: true,
    },
    {
        key: "delivery",
        path: "/delivery",
        title: "Deliver orders",
        hint: "Pick up packed trays and mark them delivered.",
        icon: LocalShippingRoundedIcon,
    },
    {
        key: "cash",
        path: "/cash-collection",
        title: "Cash collection",
        hint: "Your payments, returns and history.",
        icon: PaymentsRoundedIcon,
    },
];

const ParentComponent = () => {
    const navigate = useNavigate();

    const roundIndex = useMemo(() => currentRoundIndex(), []);

    return (
        <Box
            sx={{
                minHeight: "100dvh",
                width: "100%",
                bgcolor: COLORS.wash,
                display: "flex",
                flexDirection: "column",
                fontFamily: FONT,
                color: COLORS.ink,
            }}
        >
            <LoginEmployeeHeader />

            <Box sx={{ width: "100%", maxWidth: 480, mx: "auto", flex: 1, display: "flex", flexDirection: "column" }}>

                {/* The round that is running now */}
                <Box sx={{ px: 3, pt: 4, pb: 4 }}>
                    <Box component="h1" sx={{ m: 0, fontSize: 32, lineHeight: 1.1, fontWeight: 700, letterSpacing: "-0.02em" }}>
                        {ROUNDS[roundIndex].name} round
                    </Box>
                    <Box sx={{ mt: 3 }}>
                        <MealRoundStrip activeIndex={roundIndex} />
                    </Box>
                </Box>

                {/* What to do next */}
                <Box
                    component="main"
                    sx={{
                        flex: 1, bgcolor: COLORS.white, borderTopLeftRadius: 28, borderTopRightRadius: 28,
                        px: 2.5, pt: 3, pb: "calc(24px + env(safe-area-inset-bottom))",
                        display: "flex", flexDirection: "column", gap: 1.5,
                    }}
                >
                    {ACTIONS.map(({ key, path, title, hint, icon: Icon, primary }) => (
                        <Box
                            key={key}
                            component="button"
                            type="button"
                            onClick={() => navigate(path)}
                            sx={{
                                width: "100%", minHeight: primary ? 92 : 76, px: 2, py: 1.5,
                                display: "flex", alignItems: "center", gap: 2, textAlign: "left", cursor: "pointer",
                                fontFamily: FONT, borderRadius: "16px",
                                bgcolor: primary ? COLORS.plum : COLORS.white,
                                color: primary ? COLORS.white : COLORS.ink,
                                border: primary ? 0 : `1.5px solid ${COLORS.line}`,
                                "&:active": { bgcolor: primary ? COLORS.plumDark : COLORS.wash },
                                ...focusRing,
                            }}
                        >
                            <Box
                                aria-hidden="true"
                                sx={{
                                    flexShrink: 0, width: 44, height: 44, borderRadius: "12px", display: "grid", placeItems: "center",
                                    bgcolor: primary ? "rgba(255,255,255,0.18)" : COLORS.wash,
                                    color: primary ? COLORS.white : COLORS.plum,
                                }}
                            >
                                <Icon />
                            </Box>

                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Box sx={{ fontSize: 18, fontWeight: 700, lineHeight: 1.2 }}>{title}</Box>
                                <Box sx={{ mt: 0.25, fontSize: 14, lineHeight: 1.4, color: primary ? "rgba(255,255,255,0.88)" : COLORS.muted }}>
                                    {hint}
                                </Box>
                            </Box>

                            <ChevronRightRoundedIcon
                                aria-hidden="true"
                                sx={{ flexShrink: 0, color: primary ? COLORS.white : COLORS.muted }}
                            />
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default memo(ParentComponent);
