import React, { memo } from "react";
import { Box, Skeleton } from "@mui/joy";

const PaymentModeSkeleton = () => {
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
                        {/* ICON */}
                        <Skeleton
                            variant="rectangular"
                            sx={{
                                width: 34,
                                height: 34,
                                borderRadius: "11px",
                                flexShrink: 0,
                            }}
                        />

                        {/* TITLE */}
                        <Box>
                            <Skeleton
                                variant="text"
                                sx={{
                                    width: 120,
                                    height: 17,
                                    borderRadius: "5px",
                                }}
                            />

                            <Skeleton
                                variant="text"
                                sx={{
                                    width: 165,
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
                {/* PAYMENT LIST SKELETON */}
                <Box
                    sx={{
                        background: "#FFFFFF",
                        border: "1px solid #E3E3DE",
                        borderRadius: "18px",
                        overflow: "hidden",
                        mt: 1,
                    }}
                >
                    {[1, 2, 3, 4].map((item, index) => (
                        <Box
                            key={item}
                            sx={{
                                minHeight: 72,
                                px: 1.5,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                borderBottom:
                                    index !== 3
                                        ? "1px solid #ECECE7"
                                        : "none",
                            }}
                        >
                            {/* LEFT */}
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.2,
                                }}
                            >
                                <Skeleton
                                    variant="rectangular"
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: "12px",
                                        flexShrink: 0,
                                    }}
                                />

                                <Box>
                                    <Skeleton
                                        variant="text"
                                        sx={{
                                            width: 65,
                                            height: 14,
                                            borderRadius: "5px",
                                        }}
                                    />

                                    <Skeleton
                                        variant="text"
                                        sx={{
                                            width: 90,
                                            height: 9,
                                            mt: 0.3,
                                            borderRadius: "5px",
                                        }}
                                    />
                                </Box>
                            </Box>

                            {/* RIGHT AMOUNT */}
                            <Skeleton
                                variant="text"
                                sx={{
                                    width: 78,
                                    height: 17,
                                    borderRadius: "6px",
                                }}
                            />
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default memo(PaymentModeSkeleton);
