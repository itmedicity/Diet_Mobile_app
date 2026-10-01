
import React, { memo } from "react";
import { Box, Skeleton } from "@mui/joy";

const PaymentHistorySkeleton = () => {
    return (
        <Box
            sx={{
                width: "100%",
                height: "100dvh",
                background: "#F7F7F5",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
            }}
        >
          
            {/* CONTENT */}
            <Box
                sx={{
                    width: "100%",
                    maxWidth: "480px",
                    mx: "auto",
                    px: { xs: 1.5, sm: 2.5 },
                    pt: 1.2,
                    pb: 1.5,
                    boxSizing: "border-box",
                    flex: 1,
                    minHeight: 0,
                    overflow: "hidden",
                }}
            >
                {[1, 2, 3, 4].map((item) => (
                    <Box
                        key={item}
                        sx={{
                            background: "#FFFFFF",
                            border: "1px solid #E3E3DE",
                            borderRadius: "17px",
                            px: 1.3,
                            py: 1.3,
                            mb: 0.9,
                        }}
                    >
                        {/* BILL HEADER */}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                gap: 1,
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                <Skeleton
                                    variant="rectangular"
                                    sx={{
                                        width: 38,
                                        height: 38,
                                        borderRadius: "11px",
                                        flexShrink: 0,
                                    }}
                                />

                                <Box>
                                    <Skeleton
                                        variant="text"
                                        sx={{
                                            width: 135,
                                            height: 14,
                                            borderRadius: "5px",
                                        }}
                                    />

                                    <Skeleton
                                        variant="text"
                                        sx={{
                                            width: 100,
                                            height: 11,
                                            mt: 0.3,
                                            borderRadius: "5px",
                                        }}
                                    />
                                </Box>
                            </Box>

                            <Box sx={{ textAlign: "right" }}>
                                <Skeleton
                                    variant="text"
                                    sx={{
                                        width: 28,
                                        height: 9,
                                        ml: "auto",
                                        borderRadius: "5px",
                                    }}
                                />

                                <Skeleton
                                    variant="text"
                                    sx={{
                                        width: 65,
                                        height: 15,
                                        mt: 0.2,
                                        ml: "auto",
                                        borderRadius: "5px",
                                    }}
                                />
                            </Box>
                        </Box>

                        {/* PATIENT DETAILS */}
                        <Box
                            sx={{
                                mt: 1,
                                display: "flex",
                                gap: 0.8,
                            }}
                        >
                            <Skeleton
                                variant="text"
                                sx={{
                                    width: 75,
                                    height: 10,
                                    borderRadius: "5px",
                                }}
                            />

                            <Skeleton
                                variant="text"
                                sx={{
                                    width: 120,
                                    height: 10,
                                    borderRadius: "5px",
                                }}
                            />

                            <Skeleton
                                variant="text"
                                sx={{
                                    width: 65,
                                    height: 10,
                                    borderRadius: "5px",
                                }}
                            />
                        </Box>

                        {/* PAYMENT SECTION */}
                        <Box
                            sx={{
                                mt: 1.1,
                                pt: 1,
                                borderTop: "1px solid #EEEEEA",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    mb: 0.6,
                                }}
                            >
                                <Skeleton
                                    variant="text"
                                    sx={{
                                        width: 95,
                                        height: 10,
                                        borderRadius: "5px",
                                    }}
                                />

                                <Skeleton
                                    variant="text"
                                    sx={{
                                        width: 55,
                                        height: 10,
                                        borderRadius: "5px",
                                    }}
                                />
                            </Box>

                            {/* PAYMENT 1 */}
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    py: 0.55,
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 0.8,
                                    }}
                                >
                                    <Skeleton
                                        variant="rectangular"
                                        sx={{
                                            width: 25,
                                            height: 25,
                                            borderRadius: "8px",
                                        }}
                                    />

                                    <Box>
                                        <Skeleton
                                            variant="text"
                                            sx={{
                                                width: 45,
                                                height: 10,
                                                borderRadius: "5px",
                                            }}
                                        />

                                        <Skeleton
                                            variant="text"
                                            sx={{
                                                width: 58,
                                                height: 8,
                                                mt: 0.1,
                                                borderRadius: "5px",
                                            }}
                                        />
                                    </Box>
                                </Box>

                                <Box sx={{ textAlign: "right" }}>
                                    <Skeleton
                                        variant="text"
                                        sx={{
                                            width: 65,
                                            height: 12,
                                            ml: "auto",
                                            borderRadius: "5px",
                                        }}
                                    />

                                    <Skeleton
                                        variant="text"
                                        sx={{
                                            width: 95,
                                            height: 8,
                                            mt: 0.15,
                                            ml: "auto",
                                            borderRadius: "5px",
                                        }}
                                    />
                                </Box>
                            </Box>

                            {/* PAYMENT 2 */}
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    py: 0.55,
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 0.8,
                                    }}
                                >
                                    <Skeleton
                                        variant="rectangular"
                                        sx={{
                                            width: 25,
                                            height: 25,
                                            borderRadius: "8px",
                                        }}
                                    />

                                    <Box>
                                        <Skeleton
                                            variant="text"
                                            sx={{
                                                width: 45,
                                                height: 10,
                                                borderRadius: "5px",
                                            }}
                                        />

                                        <Skeleton
                                            variant="text"
                                            sx={{
                                                width: 58,
                                                height: 8,
                                                mt: 0.1,
                                                borderRadius: "5px",
                                            }}
                                        />
                                    </Box>
                                </Box>

                                <Box sx={{ textAlign: "right" }}>
                                    <Skeleton
                                        variant="text"
                                        sx={{
                                            width: 65,
                                            height: 12,
                                            ml: "auto",
                                            borderRadius: "5px",
                                        }}
                                    />

                                    <Skeleton
                                        variant="text"
                                        sx={{
                                            width: 95,
                                            height: 8,
                                            mt: 0.15,
                                            ml: "auto",
                                            borderRadius: "5px",
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Box>

                        {/* FOOTER */}
                        <Box
                            sx={{
                                mt: 0.8,
                                pt: 0.8,
                                borderTop: "1px solid #EEEEEA",
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <Skeleton
                                variant="text"
                                sx={{
                                    width: 70,
                                    height: 10,
                                    borderRadius: "5px",
                                }}
                            />

                            <Skeleton
                                variant="text"
                                sx={{
                                    width: 65,
                                    height: 10,
                                    borderRadius: "5px",
                                }}
                            />
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default memo(PaymentHistorySkeleton);
