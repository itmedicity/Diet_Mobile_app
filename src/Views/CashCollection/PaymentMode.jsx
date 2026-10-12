import React, { memo } from "react";
import { Box } from "@mui/joy";

import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import QrCode2RoundedIcon from "@mui/icons-material/QrCode2Rounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";

import { useCashPaymentModeDetail } from "../../CommonData/UseQuery";
import { EmpauthId } from "../Constant/Constant";
import PaymentModeSkeleton from "./CollectionComponent/PaymentModeSkeleton";
import CollectionPage, { money } from "./CollectionComponent/CollectionPage";
import { COLORS } from "../../Style/designTokens";

const PaymentMode = () => {

    const id = EmpauthId()
    const { data: PaymentModes = [], isLoading } = useCashPaymentModeDetail(id);

    const paymentModes = [
        { label: "Cash", amount: PaymentModes[0]?.cash_amount, icon: PaymentsRoundedIcon },
        { label: "Card", amount: PaymentModes[0]?.card_amount, icon: CreditCardRoundedIcon },
        { label: "UPI", amount: PaymentModes[0]?.upi_amount, icon: QrCode2RoundedIcon },
        { label: "Credit", amount: PaymentModes[0]?.credit_amount, icon: AccountBalanceWalletRoundedIcon },
    ];

    if (isLoading) {
        return <PaymentModeSkeleton />
    }

    return (
        <CollectionPage title="Payment modes" subtitle="What you collected, by how it was paid">
            <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, bgcolor: COLORS.white, border: `1px solid ${COLORS.line}`, borderRadius: "16px", overflow: "hidden" }}>
                {paymentModes.map((mode, index) => {
                    const Icon = mode.icon;

                    return (
                        <Box
                            component="li"
                            key={mode.label}
                            sx={{
                                minHeight: 72, px: 2, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.5,
                                borderTop: index === 0 ? "none" : `1px solid ${COLORS.line}`,
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, color: COLORS.plum }}>
                                <Icon aria-hidden="true" />
                                <Box sx={{ fontSize: 18, fontWeight: 600, color: COLORS.ink }}>{mode.label}</Box>
                            </Box>
                            <Box sx={{ fontSize: 20, fontWeight: 700, color: COLORS.ink }}>{money(mode.amount)}</Box>
                        </Box>
                    );
                })}
            </Box>
        </CollectionPage>
    );
};

export default memo(PaymentMode);
