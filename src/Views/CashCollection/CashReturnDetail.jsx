import React, { memo, useCallback } from "react";
import { Box, Typography } from "@mui/joy";
import { EmpauthId } from "../Constant/Constant";
import { usePaymentReturnDetails } from "../../CommonData/UseQuery";
import CashReturnCard from "./CollectionComponent/CashReturnCard";
import CashReturnCardSkeleton from "./CollectionComponent/CashReturnCardSkeleton";
import { useNavigate } from "react-router-dom";


const CashReturnDetail = () => {
    const id = EmpauthId();

    const navigate = useNavigate();

    const {
        data: ReturnDetails = [],
        isLoading
    } = usePaymentReturnDetails(id);

    const handleCardClick = useCallback((payment) => {
        navigate(`/cash-collection/return/${payment?.billing_id}/${payment?.payment_id}`);
    }, [navigate]);


    return (
        <Box
            sx={{
                width: "100%",
                height: "100dvh",
                background: "#F7F7F5",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                boxSizing: "border-box",
            }}
        >
            <Box
                sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 20,
                    width: "100%",
                    background: "rgba(247, 247, 245, 0.96)",
                    backdropFilter: "blur(10px)",
                    borderBottom: "1px solid #E2E2DD",
                    flexShrink: 0,
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        maxWidth: "480px",
                        mx: "auto",
                        px: { xs: 1.5, sm: 2.5 },
                        py: 1.1,
                        boxSizing: "border-box",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
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
                            💰
                        </Box>

                        <Box sx={{ minWidth: 0 }}>
                            <Typography
                                sx={{
                                    fontSize: {
                                        xs: "0.88rem",
                                        sm: "1rem",
                                    },
                                    fontWeight: 900,
                                    color: "#191919",
                                    lineHeight: 1.15,
                                }}
                            >
                                RETURN DETAILS
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.25,
                                    fontSize: "0.58rem",
                                    color: "#858580",
                                    fontWeight: 700,
                                }}
                            >
                                dsfdfs
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* SCROLLABLE CONTENT */}
            <Box
                sx={{
                    width: "100%",
                    maxWidth: "480px",
                    mx: "auto",
                    px: { xs: 1.5, sm: 2.5 },
                    pt: 1.2,
                    pb: 2,
                    boxSizing: "border-box",
                    flex: 1,
                    minHeight: 0,
                    overflowY: "auto",

                    "&::-webkit-scrollbar": {
                        width: 3,
                    },

                    "&::-webkit-scrollbar-thumb": {
                        background: "#D0D0CB",
                        borderRadius: 10,
                    },
                }}
            >


                {isLoading ? (
                    <>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <CashReturnCardSkeleton key={index} />
                        ))}
                    </>
                ) : ReturnDetails?.length === 0 ? (
                    <Box sx={{ py: 6, textAlign: "center" }}>
                        <Typography
                            sx={{
                                fontSize: "0.8rem",
                                fontWeight: 700,
                                color: "#888",
                            }}>
                            No cash returns pending
                        </Typography>
                    </Box>
                ) : (
                    ReturnDetails?.map((payment, index) => (
                        <CashReturnCard
                            key={`${payment?.payment_id}-${index}`}
                            payment={payment}
                            onClick={handleCardClick}
                        />
                    ))
                )}
            </Box>
        </Box>
    );
};

export default memo(CashReturnDetail);