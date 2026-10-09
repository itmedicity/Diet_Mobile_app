
import React, { memo } from "react";
import { Box, Typography } from "@mui/joy";
import { useNavigate } from "react-router-dom";

import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import SavingsIcon from '@mui/icons-material/Savings';

import LoginEmployeeHeader from "../../components/LoginEmployeeHeader";

const CashCollection = () => {
    const navigate = useNavigate();

    const actions = [
        {
            label: "Summary",
            path: "/cash-collection/summary",
            icon: AccountBalanceWalletRoundedIcon,
        },
        {
            label: "Payment Modes",
            path: "/cash-collection/modes",
            icon: PaymentsRoundedIcon,
        },
        {
            label: "History",
            path: "/cash-collection/history",
            icon: ReceiptLongRoundedIcon,
        },
        {
            label: "Cash Return",
            path: "/cash-collection/return",
            icon: SavingsIcon,
        },
    ];

    return (
        <Box
            sx={{
                minHeight: "100dvh",
                width: "100%",
                background: "#F7F7F5",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                boxSizing: "border-box",
            }}
        >
            <LoginEmployeeHeader />

            <Box
                sx={{
                    width: "100%",
                    maxWidth: "480px",
                    mx: "auto",
                    px: { xs: 2, sm: 2.5 },
                    pt: 2,
                    boxSizing: "border-box",
                }}
            >
                {/* HEADER */}
                <Box
                    sx={{
                        mb: 2.2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                fontSize: { xs: "1.05rem", sm: "1.15rem" },
                                fontWeight: 900,
                                color: "#171717",
                                lineHeight: 1.2,
                            }}
                        >
                            Cash Collection
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.35,
                                fontSize: "0.68rem",
                                color: "#858585",
                                fontWeight: 600,
                            }}
                        >
                            Manage and track collections
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            width: 34,
                            height: 34,
                            borderRadius: "50%",
                            background: "#EAF7EE",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <CheckCircleRoundedIcon
                            sx={{
                                fontSize: 19,
                                color: "#239447",
                            }}
                        />
                    </Box>
                </Box>


                {/* ACTIONS */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: { xs: 1, sm: 1.5 },
                        px: { xs: 0.5, sm: 1 },
                    }}
                >
                    {actions?.map((action) => {
                        const Icon = action.icon;

                        return (
                            <Box
                                key={action.path}
                                onClick={() => navigate(action.path)}
                                sx={{
                                    width: { xs: 88, sm: 96 },
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    cursor: "pointer",
                                    userSelect: "none",

                                    "&:active .action-icon": {
                                        transform: "scale(0.9)",
                                        background: "#F0F0ED",
                                    },
                                }}
                            >
                                <Box
                                    className="action-icon"
                                    sx={{
                                        width: { xs: 56, sm: 60 },
                                        height: { xs: 56, sm: 60 },
                                        borderRadius: "18px",
                                        background: "#FFFFFF",
                                        border: "1px solid #891b97",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        transition:
                                            "transform 0.15s ease, background 0.15s ease",
                                        boxShadow:
                                            "0 3px 10px rgba(241, 148, 219, 0.56)",
                                    }}
                                >
                                    <Icon
                                        sx={{
                                            fontSize: {
                                                xs: 26,
                                                sm: 28,
                                            },
                                            color: "#891b97",
                                        }}
                                    />
                                </Box>

                                <Typography
                                    sx={{
                                        mt: 0.9,
                                        fontSize: {
                                            xs: "0.62rem",
                                            sm: "0.68rem",
                                        },
                                        fontWeight: 800,
                                        color: "#444",
                                        textAlign: "center",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {action.label}
                                </Typography>

                                <ArrowForwardIosRoundedIcon
                                    sx={{
                                        mt: 0.35,
                                        fontSize: 9,
                                        color: "#B5B5B0",
                                    }}
                                />
                            </Box>
                        );
                    })}
                </Box>
            </Box>
        </Box>
    );
};

export default memo(CashCollection);
