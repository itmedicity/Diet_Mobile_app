import React, { memo } from "react";
import { Box, Typography } from "@mui/joy";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import { useCashSummaryDetail } from "../../CommonData/UseQuery";
import { EmpauthId } from "../Constant/Constant";
import CashCollectionSummarySkeleton from "./CollectionComponent/CashCollectionSummarySkeleton";


const CashCollectionSummary = () => {
    const id = EmpauthId()

    const {
        data: SummaryDetails = [],
        isLoading,
    } = useCashSummaryDetail(id);

    const {
        total_collected = 0,
        cash_collected = 0,
        total_transactions = 0,
    } = SummaryDetails[0] || {};



    if (isLoading) { return <CashCollectionSummarySkeleton />; }

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
                            📜
                        </Box>

                        <Box>
                            <Typography
                                sx={{
                                    fontSize: "1rem",
                                    fontWeight: 900,
                                    color: "#191919",
                                }}
                            >
                                SUMMARY DETAILS
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
                }}>



                {/* SUMMARY */}
                <Box
                    sx={{
                        background: "#FFFFFF",
                        border: "1px solid #E3E3DE",
                        borderRadius: "20px",
                        px: { xs: 2, sm: 2.5 },
                        py: 2.5,
                        boxSizing: "border-box",
                        mt: 2
                    }}
                >
                    {/* TOTAL */}
                    <Box
                        sx={{
                            textAlign: "center",
                            pb: 2.2,
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: {
                                    xs: "2rem",
                                    sm: "2.2rem",
                                },
                                lineHeight: 1.1,
                                fontWeight: 900,
                                color: "#171717",
                                letterSpacing: "-0.04em",
                            }}
                        >
                            {total_collected}
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.55,
                                fontSize: "0.64rem",
                                fontWeight: 800,
                                color: "#777",
                                letterSpacing: "0.08em",
                            }}
                        >
                            TOTAL COLLECTED
                        </Typography>

                        <Box
                            sx={{
                                mt: 1.2,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 0.6,
                                px: 1.2,
                                py: 0.5,
                                borderRadius: "20px",
                                background: "#F4F4F1",
                            }}
                        >
                            <ReceiptLongRoundedIcon
                                sx={{
                                    fontSize: 14,
                                    color: "#666",
                                }}
                            />

                            <Typography
                                sx={{
                                    fontSize: "0.62rem",
                                    fontWeight: 800,
                                    color: "#555",
                                }}
                            >
                                {total_transactions} TRANSACTIONS
                            </Typography>
                        </Box>
                    </Box>

                    {/* DIVIDER */}
                    <Box
                        sx={{
                            height: "1px",
                            background: "#E8E8E3",
                        }}
                    />

                    {/* TODAY */}
                    <Box
                        sx={{
                            pt: 2,
                            display: "flex",
                            flexDirection: "column",
                            gap: 1.5,
                        }}
                    >
                        <Box>
                            <Typography
                                sx={{
                                    fontSize: "0.68rem",
                                    fontWeight: 700,
                                    color: "#777",
                                }}
                            >
                                Today's collection
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.25,
                                    fontSize: "1rem",
                                    fontWeight: 900,
                                    color: "#181818",
                                }}
                            >
                                {total_collected}
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <Box>
                                <Typography
                                    sx={{
                                        fontSize: "0.68rem",
                                        fontWeight: 700,
                                        color: "#777",
                                    }}
                                >
                                    Cash collected
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 0.25,
                                        fontSize: "1rem",
                                        fontWeight: 900,
                                        color: "#181818",
                                    }}
                                >
                                    {cash_collected}
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    width: 38,
                                    height: 38,
                                    borderRadius: "12px",
                                    background: "#F3F3F0",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <AccountBalanceWalletRoundedIcon
                                    sx={{
                                        fontSize: 20,
                                        color: "#303030",
                                    }}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default memo(CashCollectionSummary);
