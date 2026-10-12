import React, { memo } from "react";
import { Box } from "@mui/joy";
import { useNavigate } from "react-router-dom";

import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import SavingsIcon from '@mui/icons-material/Savings';

import LoginEmployeeHeader from "../../components/LoginEmployeeHeader";
import { COLORS, FONT, focusRing } from "../../Style/designTokens";

const actions = [
    { label: "Summary", hint: "Total collected so far", path: "/cash-collection/summary", icon: AccountBalanceWalletRoundedIcon },
    { label: "Payment modes", hint: "Cash, card, UPI and credit", path: "/cash-collection/modes", icon: PaymentsRoundedIcon },
    { label: "History", hint: "Every payment and its bill", path: "/cash-collection/history", icon: ReceiptLongRoundedIcon },
    { label: "Cash return", hint: "Change still owed to patients", path: "/cash-collection/return", icon: SavingsIcon },
];

const CashCollection = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ minHeight: "100dvh", width: "100%", bgcolor: COLORS.surface, fontFamily: FONT }}>
            <LoginEmployeeHeader />

            <Box sx={{ width: "100%", maxWidth: 560, mx: "auto", px: 2, pt: 2.5, pb: 4, boxSizing: "border-box" }}>
                <Box component="h1" sx={{ m: 0, fontSize: 26, fontWeight: 700, color: COLORS.ink }}>Cash collection</Box>
                <Box sx={{ mt: 0.5, mb: 2, fontSize: 16, color: COLORS.muted }}>Check what you collected and hand it in.</Box>

                <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "flex", flexDirection: "column", gap: 1.25 }}>
                    {actions.map((action) => {
                        const Icon = action.icon;
                        return (
                            <Box component="li" key={action.path}>
                                <Box
                                    component="button"
                                    type="button"
                                    onClick={() => navigate(action.path)}
                                    sx={{
                                        width: "100%", minHeight: 72, px: 2, borderRadius: "16px", cursor: "pointer", textAlign: "left", fontFamily: FONT,
                                        display: "flex", alignItems: "center", gap: 1.5, bgcolor: COLORS.white, border: `1px solid ${COLORS.line}`,
                                        "&:active": { bgcolor: COLORS.wash }, ...focusRing,
                                    }}
                                >
                                    <Box sx={{ flexShrink: 0, width: 48, height: 48, borderRadius: "14px", display: "grid", placeItems: "center", bgcolor: COLORS.wash, color: COLORS.plum }}>
                                        <Icon aria-hidden="true" />
                                    </Box>
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Box sx={{ fontSize: 18, fontWeight: 700, color: COLORS.ink }}>{action.label}</Box>
                                        <Box sx={{ fontSize: 14, color: COLORS.muted }}>{action.hint}</Box>
                                    </Box>
                                    <ChevronRightRoundedIcon aria-hidden="true" sx={{ color: COLORS.muted }} />
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            </Box>
        </Box>
    );
};

export default memo(CashCollection);
