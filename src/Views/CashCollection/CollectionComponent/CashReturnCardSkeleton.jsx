
import React, { memo } from "react";
import { Box, Skeleton } from "@mui/joy";

const CashReturnCardSkeleton = () => {
    return (
        <Box
            sx={{
                background: "#FFFFFF",
                border: "1px solid #E3E3DE",
                borderRadius: "17px",
                px: 1.3,
                py: 1.3,
                mb: 0.9,
                boxSizing: "border-box",
            }}
        >
            {/* HEADER */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 1,
                }}
            >
                {/* BILL + PATIENT */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        minWidth: 0,
                    }}
                >
                    {/* ICON */}
                    <Skeleton
                        variant="rectangular"
                        sx={{
                            width: 38,
                            height: 38,
                            borderRadius: "11px",
                            flexShrink: 0,
                        }}
                    />

                    {/* BILL + PATIENT */}
                    <Box
                        sx={{
                            minWidth: 0,
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.5,
                        }}
                    >
                        <Skeleton
                            variant="text"
                            sx={{
                                width: 75,
                                height: 14,
                                borderRadius: 1,
                            }}
                        />

                        <Skeleton
                            variant="text"
                            sx={{
                                width: 115,
                                height: 12,
                                borderRadius: 1,
                            }}
                        />
                    </Box>
                </Box>

                {/* RETURN AMOUNT */}
                <Box
                    sx={{
                        textAlign: "right",
                        flexShrink: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                    }}
                >
                    <Skeleton
                        variant="text"
                        sx={{
                            width: 40,
                            height: 10,
                            borderRadius: 1,
                        }}
                    />

                    <Skeleton
                        variant="text"
                        sx={{
                            width: 70,
                            height: 18,
                            borderRadius: 1,
                            mt: 0.1,
                        }}
                    />
                </Box>
            </Box>

            {/* PATIENT DETAILS */}
            <Box
                sx={{
                    mt: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.8,
                    flexWrap: "wrap",
                }}
            >
                <Skeleton
                    variant="text"
                    sx={{
                        width: 70,
                        height: 11,
                        borderRadius: 1,
                    }}
                />

                <Skeleton
                    variant="text"
                    sx={{
                        width: 4,
                        height: 11,
                    }}
                />

                <Skeleton
                    variant="text"
                    sx={{
                        width: 115,
                        height: 11,
                        borderRadius: 1,
                    }}
                />

                <Skeleton
                    variant="text"
                    sx={{
                        width: 4,
                        height: 11,
                    }}
                />

                <Skeleton
                    variant="text"
                    sx={{
                        width: 65,
                        height: 11,
                        borderRadius: 1,
                    }}
                />
            </Box>

            {/* PAYMENT DETAILS */}
            <Box
                sx={{
                    mt: 1.1,
                    pt: 1,
                    borderTop: "1px solid #EEEEEA",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 0.8,
                }}
            >
                {/* BILL AMOUNT */}
                <Box>
                    <Skeleton
                        variant="text"
                        sx={{
                            width: 65,
                            height: 9,
                            borderRadius: 1,
                        }}
                    />

                    <Skeleton
                        variant="text"
                        sx={{
                            width: 65,
                            height: 14,
                            borderRadius: 1,
                            mt: 0.2,
                        }}
                    />
                </Box>

                {/* CASH RECEIVED */}
                <Box>
                    <Skeleton
                        variant="text"
                        sx={{
                            width: 80,
                            height: 9,
                            borderRadius: 1,
                        }}
                    />

                    <Skeleton
                        variant="text"
                        sx={{
                            width: 65,
                            height: 14,
                            borderRadius: 1,
                            mt: 0.2,
                        }}
                    />
                </Box>

                {/* RETURN */}
                <Box>
                    <Skeleton
                        variant="text"
                        sx={{
                            width: 45,
                            height: 9,
                            borderRadius: 1,
                        }}
                    />

                    <Skeleton
                        variant="text"
                        sx={{
                            width: 65,
                            height: 14,
                            borderRadius: 1,
                            mt: 0.2,
                        }}
                    />
                </Box>
            </Box>

            {/* FOOTER */}
            <Box
                sx={{
                    mt: 0.9,
                    pt: 0.8,
                    borderTop: "1px solid #EEEEEA",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                    }}
                >
                    <Skeleton
                        variant="circular"
                        sx={{
                            width: 13,
                            height: 13,
                        }}
                    />

                    <Skeleton
                        variant="text"
                        sx={{
                            width: 35,
                            height: 10,
                            borderRadius: 1,
                        }}
                    />

                    <Skeleton
                        variant="text"
                        sx={{
                            width: 4,
                            height: 10,
                        }}
                    />

                    <Skeleton
                        variant="circular"
                        sx={{
                            width: 11,
                            height: 11,
                        }}
                    />

                    <Skeleton
                        variant="text"
                        sx={{
                            width: 105,
                            height: 10,
                            borderRadius: 1,
                        }}
                    />
                </Box>

                <Skeleton
                    variant="circular"
                    sx={{
                        width: 18,
                        height: 18,
                    }}
                />
            </Box>
        </Box>
    );
};

export default memo(CashReturnCardSkeleton);

