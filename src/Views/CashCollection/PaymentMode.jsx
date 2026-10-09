import React, { memo } from "react";
import { Box, Typography } from "@mui/joy";

import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";

import { useCashPaymentModeDetail } from "../../CommonData/UseQuery";
import { EmpauthId } from "../Constant/Constant";
import PaymentModeSkeleton from "./CollectionComponent/PaymentModeSkeleton";

const PaymentMode = () => {

    const id = EmpauthId()
    const { data: PaymentModes = [], isLoading } = useCashPaymentModeDetail(id);


    const paymentModes = [
        {
            label: "Cash",
            amount: `₹${PaymentModes[0]?.cash_amount}`,
            icon: PaymentsRoundedIcon,
        },
        {
            label: "Card",
            amount: `₹${PaymentModes[0]?.card_amount}`,
            icon: CreditCardRoundedIcon,
        },
        {
            label: "UPI",
            amount: `₹${PaymentModes[0]?.upi_amount}`,
            icon: PaymentsRoundedIcon,
        },
        {
            label: "Credit",
            amount: `₹${PaymentModes[0]?.credit_amount}`,
            icon: AccountBalanceWalletRoundedIcon,
        },
    ];


    if (isLoading) {
       return <PaymentModeSkeleton />
    }

    return (
        <Box
            sx={{
                minHeight: "100dvh",
                width: "100%",
                background: "#F7F7F5",
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
                overflow: "hidden",
            }}
        >
            {/* HEADER */}
            <Box
                sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 20,
                    width: "100%",
                    background: "#F7F7F5",
                    borderBottom: "1px solid #E5E5E0",
                    flexShrink: 0,
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        maxWidth: "480px",
                        mx: "auto",
                        px: { xs: 1.5, sm: 2.5 },
                        py: 1.2,
                        boxSizing: "border-box",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1

                        }}
                    >
                        <Box

                            sx={{
                                width: 34,
                                height: 34,
                                borderRadius: "11px",
                                background: "#FFFFFF",
                                border: "1px solid #E2E2DD",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",

                                "&:active": {
                                    transform: "scale(0.94)",
                                },
                            }}
                        >
                            💸
                        </Box>

                        <Box>
                            <Typography
                                sx={{
                                    fontSize: "1rem",
                                    fontWeight: 900,
                                    color: "#191919",
                                }}
                            >
                                PAYMENT MODES
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: "0.62rem",
                                    color: "#898985",
                                    fontWeight: 600,
                                    mt: 0.2,
                                }}
                            >
                                Collection by payment method
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Box
                sx={{
                    width: "100%",
                    maxWidth: "480px",
                    mx: "auto",
                    px: { xs: 2, sm: 2.5 },
                    pt: 1.5,
                    boxSizing: "border-box",
                }}
            >

                {/* PAYMENT LIST */}
                <Box
                    sx={{
                        background: "#FFFFFF",
                        border: "1px solid #E3E3DE",
                        borderRadius: "18px",
                        overflow: "hidden",
                        mt: 1
                    }}
                >
                    {paymentModes.map((mode, index) => {
                        const Icon = mode.icon;

                        return (
                            <Box
                                key={mode.label}
                                sx={{
                                    minHeight: 72,
                                    px: 1.5,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    borderBottom:
                                        index !== paymentModes.length - 1
                                            ? "1px solid #ECECE7"
                                            : "none",
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1.2,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: "12px",
                                            background: "#F4F4F1",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Icon
                                            sx={{
                                                fontSize: 20,
                                                color: "#303030",
                                            }}
                                        />
                                    </Box>

                                    <Box>
                                        <Typography
                                            sx={{
                                                fontSize: "0.72rem",
                                                fontWeight: 800,
                                                color: "#242424",
                                            }}
                                        >
                                            {mode.label}
                                        </Typography>

                                    </Box>
                                </Box>

                                <Typography
                                    sx={{
                                        fontSize: "0.86rem",
                                        fontWeight: 900,
                                        color: "#181818",
                                    }}
                                >
                                    {mode.amount}
                                </Typography>
                            </Box>
                        );
                    })}
                </Box>
            </Box>
        </Box>
    );
};

export default memo(PaymentMode);
