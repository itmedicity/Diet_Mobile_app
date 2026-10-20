
import React, { memo } from "react";
import { Box, Skeleton } from "@mui/joy";

const FONT = "Bahnschrift";

const AssignedCashCardSkeleton = memo(() => {
    return (
        <Box
            sx={{
                border: "1px solid #E3E3DE",
                borderRadius: "17px",
                backgroundColor: "#FFFFFF",
                px: 1.3,
                py: 1.3,
                mb: 0.9,
                fontFamily: FONT,
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                    mb: 1.2,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        minWidth: 0,
                        flex: 1,
                    }}
                >
                    <Skeleton
                        variant="rectangular"
                        width={38}
                        height={38}
                        sx={{ borderRadius: "11px", flexShrink: 0 }}
                    />

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Skeleton
                            variant="text"
                            width="65%"
                            height={20}
                        />
                        <Skeleton
                            variant="text"
                            width="45%"
                            height={16}
                        />
                    </Box>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: 0.3,
                    }}
                >
                    <Skeleton
                        variant="rectangular"
                        width={68}
                        height={20}
                        sx={{ borderRadius: "6px" }}
                    />
                    <Skeleton
                        variant="text"
                        width={76}
                        height={23}
                    />
                </Box>
            </Box>

            {/* Patient details */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.8,
                    mb: 1.2,
                    flexWrap: "wrap",
                }}
            >
                <Skeleton variant="text" width={80} height={16} />
                <Skeleton variant="text" width={115} height={16} />
                <Skeleton variant="text" width={70} height={16} />
            </Box>

            {/* Amount summary */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                    border: "1px solid #EEEEEA",
                    borderRadius: "11px",
                    overflow: "hidden",
                    mb: 1.1,
                }}
            >
                {[1, 2, 3].map((item, index) => (
                    <Box
                        key={item}
                        sx={{
                            px: 1,
                            py: 0.9,
                            borderRight:
                                index < 2 ? "1px solid #EEEEEA" : "none",
                        }}
                    >
                        <Skeleton
                            variant="text"
                            width="75%"
                            height={14}
                            sx={{ mb: 0.4 }}
                        />
                        <Skeleton
                            variant="text"
                            width="85%"
                            height={21}
                        />
                    </Box>
                ))}
            </Box>

            {/* Assigned by / date */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                    mb: 1,
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
                    <Skeleton
                        variant="circular"
                        width={17}
                        height={17}
                    />
                    <Skeleton variant="text" width={105} height={17} />
                </Box>

                <Skeleton variant="text" width={95} height={17} />
            </Box>

            {/* Footer */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    pt: 0.9,
                    borderTop: "1px solid #EEEEEA",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
                    <Skeleton
                        variant="circular"
                        width={16}
                        height={16}
                    />
                    <Skeleton variant="text" width={85} height={16} />
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
                    <Skeleton variant="text" width={75} height={16} />
                    <Skeleton
                        variant="circular"
                        width={20}
                        height={20}
                    />
                </Box>
            </Box>
        </Box>
    );
});

AssignedCashCardSkeleton.displayName = "AssignedCashCardSkeleton";

export default AssignedCashCardSkeleton;
