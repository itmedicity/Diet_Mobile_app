import React, { memo } from "react";
import { Box, Skeleton } from "@mui/joy";

const CashCollectionSummarySkeleton = () => {
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
            {/* HEADER SKELETON */}
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
                            gap: 1,
                        }}
                    >
                        {/* HEADER ICON */}
                        <Skeleton
                            variant="rectangular"
                            sx={{
                                width: 34,
                                height: 34,
                                borderRadius: "11px",
                                flexShrink: 0,
                            }}
                        />

                        {/* HEADER TEXT */}
                        <Box>
                            <Skeleton
                                variant="text"
                                sx={{
                                    width: 145,
                                    height: 17,
                                    borderRadius: "5px",
                                }}
                            />

                            <Skeleton
                                variant="text"
                                sx={{
                                    width: 175,
                                    height: 11,
                                    mt: 0.2,
                                    borderRadius: "5px",
                                }}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* CONTENT */}
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
                {/* SUMMARY SKELETON */}
                <Box
                    sx={{
                        background: "#FFFFFF",
                        border: "1px solid #E3E3DE",
                        borderRadius: "20px",
                        px: { xs: 2, sm: 2.5 },
                        py: 2.5,
                        boxSizing: "border-box",
                        mt: 2,
                    }}
                >
                    {/* TOTAL */}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            pb: 2.2,
                        }}
                    >
                        {/* TOTAL AMOUNT */}
                        <Skeleton
                            variant="text"
                            sx={{
                                width: {
                                    xs: 150,
                                    sm: 170,
                                },
                                height: 38,
                                borderRadius: "8px",
                            }}
                        />

                        {/* TOTAL COLLECTED */}
                        <Skeleton
                            variant="text"
                            sx={{
                                width: 105,
                                height: 12,
                                mt: 0.55,
                                borderRadius: "5px",
                            }}
                        />

                        {/* TRANSACTIONS */}
                        <Skeleton
                            variant="rectangular"
                            sx={{
                                width: 125,
                                height: 27,
                                mt: 1.2,
                                borderRadius: "20px",
                            }}
                        />
                    </Box>

                    {/* DIVIDER */}
                    <Box
                        sx={{
                            height: "1px",
                            background: "#E8E8E3",
                        }}
                    />

                    {/* DETAILS */}
                    <Box
                        sx={{
                            pt: 2,
                            display: "flex",
                            flexDirection: "column",
                            gap: 1.5,
                        }}
                    >
                        {/* TODAY'S COLLECTION */}
                        <Box>
                            <Skeleton
                                variant="text"
                                sx={{
                                    width: 120,
                                    height: 12,
                                    borderRadius: "5px",
                                }}
                            />

                            <Skeleton
                                variant="text"
                                sx={{
                                    width: 95,
                                    height: 19,
                                    mt: 0.25,
                                    borderRadius: "6px",
                                }}
                            />
                        </Box>

                        {/* CASH COLLECTED */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <Box>
                                <Skeleton
                                    variant="text"
                                    sx={{
                                        width: 100,
                                        height: 12,
                                        borderRadius: "5px",
                                    }}
                                />

                                <Skeleton
                                    variant="text"
                                    sx={{
                                        width: 95,
                                        height: 19,
                                        mt: 0.25,
                                        borderRadius: "6px",
                                    }}
                                />
                            </Box>

                            {/* WALLET ICON */}
                            <Skeleton
                                variant="rectangular"
                                sx={{
                                    width: 38,
                                    height: 38,
                                    borderRadius: "12px",
                                }}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default memo(CashCollectionSummarySkeleton);
