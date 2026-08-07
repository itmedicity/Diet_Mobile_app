import React, { memo } from "react";
import { Box } from "@mui/joy";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import TextComponent from "../../../components/TextComponent";

const PaymentSummaryCard = ({
    expand = true,
    amount = 0,
    title = "Total Payable",
    subtitle = "Amount Due",
    deliveredAmount,
    onClick
}) => {
    return (
        <Box
            onClick={onClick}
            sx={{
                display: !expand ? "none" : "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 2,
                py: 1.1,
                mb: 1.5,
                borderRadius: 50,
                position: "relative",
                overflow: "hidden",
                background:
                    "linear-gradient(#7c13ec,#7c13ec 0%,#7c13ec 100%)",
                color: "#ffffff",
                boxShadow: "0 10px 25px rgba(46,125,50,.28)",
                transition: ".3s",

                "@keyframes walletPulse": {
                    "0%,100%": {
                        transform: "scale(1)",
                    },
                    "50%": {
                        transform: "scale(1.08)",
                    },
                },

                "@keyframes moneySlide": {
                    "0%": {
                        left: "70px",
                        opacity: 0,
                        transform:
                            "translateY(5px) rotate(-15deg)",
                    },

                    "15%": {
                        opacity: .9,
                    },

                    "50%": {
                        opacity: .7,
                        transform:
                            "translateY(-5px) rotate(10deg)",
                    },

                    "85%": {
                        opacity: .5,
                    },

                    "100%": {
                        left: "calc(100% - 120px)",
                        opacity: 0,
                        transform:
                            "translateY(3px) rotate(20deg)",
                    },
                },

                "@keyframes amountPulse": {
                    "0%,100%": {
                        transform: "scale(1)",
                    },

                    "50%": {
                        transform: "scale(1.04)",
                    },
                },

                "@keyframes arrowMove": {
                    "0%,100%": {
                        transform: "translateX(0)",
                    },

                    "50%": {
                        transform: "translateX(4px)",
                    },
                },

                "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow:
                        "0 14px 32px rgba(46,125,50,.38)",
                },
            }}
        >
            {/* Animated Money */}
            {[0, 0.7, 1.4].map((delay, index) => (
                <CurrencyRupeeRoundedIcon
                    key={index}
                    sx={{
                        position: "absolute",
                        left: "70px",
                        top: "50%",
                        fontSize: index === 1 ? 19 : 16,
                        color: "#FFE082",
                        opacity: 0,
                        zIndex: 1,
                        pointerEvents: "none",
                        animation:
                            "moneySlide 3s linear infinite",
                        animationDelay: `${delay}s`,
                    }}
                />
            ))}

            {/* Left */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    position: "relative",
                    zIndex: 2,
                }}
            >
                <Box
                    sx={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        bgcolor: "rgba(255,255,255,.18)",
                        border:
                            "1px solid rgba(255,255,255,.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backdropFilter: "blur(5px)",
                        animation:
                            "walletPulse 2s ease-in-out infinite",
                    }}
                >
                    <AccountBalanceWalletRoundedIcon
                        sx={{
                            fontSize: 24,
                            color: "#fff",
                        }}
                    />
                </Box>

                <Box>
                    <TextComponent
                        value={title}
                        size={8}
                        weight={500}
                        color="rgba(255,255,255,.75)"
                    />

                    <TextComponent
                        value={subtitle}
                        size={12}
                        weight={800}
                        color="#fff"
                    />
                </Box>
            </Box>

            {/* Right */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    position: "relative",
                    zIndex: 3,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: .5,
                        animation: "amountPulse 2s ease-in-out infinite",
                    }}
                >
                    <TextComponent
                        value={`₹${Number(amount).toFixed(2)}`}
                        size={16}
                        weight={900}
                        color="#fff"
                    />

                    <ArrowForwardRoundedIcon
                        sx={{
                            fontSize: 20,
                            animation: "arrowMove 1.3s ease-in-out infinite",
                        }}
                    />
                </Box>

                <TextComponent
                    value={`Delivered : ₹${Number(deliveredAmount).toFixed(2)}`}
                    size={8}
                    color="rgba(255,255,255,.8)"
                />
            </Box>
        </Box>
    );
};

export default memo(PaymentSummaryCard);