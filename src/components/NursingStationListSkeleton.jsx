
import React from "react";
import { Box, Skeleton } from "@mui/joy";

const NursingStationListSkeleton = ({ count = 6 }) => {
    return (
        <Box
            sx={{
                width: "95%",
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, minmax(0, 1fr))",
                    lg: "repeat(3, minmax(0, 1fr))",
                },
                gap: 1.5,
                pb: 2,
            }}
        >
            {Array.from({ length: count }).map((_, index) => (
                <Box
                    key={index}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        minWidth: 0,
                        bgcolor: "#fff",
                        border: "1px solid #eee7f0",
                        borderRadius: "13px",
                        overflow: "hidden",
                    }}
                >
                    {/* Left Accent */}
                    <Box
                        sx={{
                            width: 5,
                            alignSelf: "stretch",
                            bgcolor: "#ead9ee",
                            flexShrink: 0,
                        }}
                    />

                    {/* Station Icon */}
                    <Skeleton
                        variant="rectangular"
                        width={39}
                        height={39}
                        sx={{
                            ml: 1.5,
                            borderRadius: "11px",
                            flexShrink: 0,
                        }}
                    />

                    {/* Station Details */}
                    <Box
                        sx={{
                            flex: 1,
                            minWidth: 0,
                            py: 1.6,
                            px: 1.2,
                        }}
                    >
                        <Skeleton
                            variant="text"
                            width={75}
                            height={13}
                        />

                        <Skeleton
                            variant="text"
                            width="75%"
                            height={20}
                            sx={{ mt: 0.3 }}
                        />
                    </Box>

                    {/* Arrow */}
                    <Skeleton
                        variant="circular"
                        width={29}
                        height={29}
                        sx={{
                            mr: 1.3,
                            flexShrink: 0,
                        }}
                    />
                </Box>
            ))}
        </Box>
    );
};

export default NursingStationListSkeleton;
