import React, { memo } from "react";
import { Box } from "@mui/joy";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import TextComponent from "../../components/TextComponent";

const MissingOrderItemCard = ({
    title = "Order Item Missing",
    message = "Items for this particular order are missing.",
    subMessage = "Please contact the canteen immediately to avoid delivery delay.",
    buttonText = "CONTACT CANTEEN"
}) => {

    return (
        <Box
            sx={{
                mt: 8,
                // mx: 2,
                width: "95%",
                maxWidth: 420,
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                border: "1px solid #ffd6d6",
                bgcolor: "#fff"
            }}
        >

            {/* HEADER */}
            <Box
                sx={{
                    bgcolor: "#ffebee",
                    px: 2,
                    py: 1.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 1
                }}
            >
                <Box
                    sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: "#d32f2f"
                    }}
                />

                <TextComponent
                    value={title}
                    size={18}
                    weight={700}
                    color="#b71c1c"
                />
            </Box>

            {/* BODY */}
            <Box
                sx={{
                    px: 3,
                    py: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    gap: 2
                }}
            >

                {/* ICON WITH AURA */}
                <Box
                    sx={{
                        position: "relative",
                        width: 80,
                        height: 80,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >

                    {/* AURA */}
                    <Box
                        sx={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                            bgcolor: "rgba(255, 82, 82, 0.18)",
                            animation: "pulseAura 2s infinite",
                            filter: "blur(2px)",

                            "@keyframes pulseAura": {
                                "0%": {
                                    transform: "scale(1)",
                                    opacity: 0.7
                                },
                                "50%": {
                                    transform: "scale(1.25)",
                                    opacity: 0.25
                                },
                                "100%": {
                                    transform: "scale(1)",
                                    opacity: 0.7
                                }
                            }
                        }}
                    />

                    {/* ICON */}
                    <Box
                        sx={{
                            width: 70,
                            height: 70,
                            borderRadius: "50%",
                            bgcolor: "#fff5f5",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "2px solid #ffcdd2",
                            boxShadow: `
                                0 0 10px rgba(255,82,82,0.35),
                                0 0 25px rgba(255,82,82,0.18)
                            `,
                            zIndex: 2
                        }}
                    >
                        <ReportProblemIcon
                            sx={{
                                color: "#d32f2f",
                                fontSize: 38
                            }}
                        />
                    </Box>
                </Box>

                {/* MAIN MESSAGE */}
                <TextComponent
                    value={message}
                    size={17}
                    weight={700}
                    color="#222"
                    wrap
                    textAlign="center"
                />

                {/* SUB MESSAGE */}
                <TextComponent
                    value={subMessage}
                    size={15}
                    color="#666"
                    wrap
                    textAlign="center"
                />

                {/* BUTTON */}
                <Box
                    sx={{
                        mt: 1,
                        px: 3,
                        py: 1.2,
                        borderRadius: "12px",
                        bgcolor: "#d32f2f",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 14,
                        letterSpacing: 0.5,
                        boxShadow: "0 4px 12px rgba(211,47,47,0.25)"
                    }}
                >
                    {buttonText}
                </Box>
            </Box>
        </Box>
    );
};

export default memo(MissingOrderItemCard);