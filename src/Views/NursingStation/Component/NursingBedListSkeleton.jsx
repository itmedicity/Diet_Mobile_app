import React from "react";
import { Box, Skeleton } from "@mui/joy";

const NursingBedListSkeleton = ({ count = 6 }) => {
    return (
        <Box
            sx={{
                width: "95%",
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, minmax(0, 1fr))",
                    lg: "repeat(2, minmax(0, 1fr))",
                    xl: "repeat(3, minmax(0, 1fr))"
                },
                gap: 1.5,
                pb: 2
            }}
        >
            {Array.from({ length: count }).map((_, index) => (
                <Box
                    key={index}
                    sx={{
                        p: 1.8,
                        borderRadius: "16px",
                        bgcolor: "#ffffff",
                        border: "1px solid #e9dfee",
                        boxShadow: "0 2px 8px rgba(40,20,50,0.045)",
                        minWidth: 0
                    }}
                >
                    {/* Patient Header */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 1
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.2,
                                flex: 1,
                                minWidth: 0
                            }}
                        >
                            <Skeleton
                                variant="rectangular"
                                width={39}
                                height={39}
                                sx={{ borderRadius: "12px", flexShrink: 0 }}
                            />

                            <Box sx={{ flex: 1 }}>
                                <Skeleton
                                    variant="text"
                                    width="75%"
                                    height={20}
                                />
                                <Skeleton
                                    variant="text"
                                    width="45%"
                                    height={15}
                                />
                            </Box>
                        </Box>

                        <Skeleton
                            variant="rectangular"
                            width={48}
                            height={23}
                            sx={{ borderRadius: "7px" }}
                        />
                    </Box>

                    {/* Divider */}
                    <Box
                        sx={{
                            height: "1px",
                            bgcolor: "#f0ebf2",
                            my: 1.5
                        }}
                    />

                    {/* Diet and Bed */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 1
                        }}
                    >
                        <Box sx={{ flex: 1 }}>
                            <Skeleton
                                variant="text"
                                width={85}
                                height={13}
                            />

                            <Skeleton
                                variant="text"
                                width="65%"
                                height={21}
                                sx={{ mt: 0.5 }}
                            />
                        </Box>

                        <Skeleton
                            variant="rectangular"
                            width={75}
                            height={38}
                            sx={{ borderRadius: "10px" }}
                        />
                    </Box>
                </Box>
            ))}
        </Box>
    );
};

export default NursingBedListSkeleton;