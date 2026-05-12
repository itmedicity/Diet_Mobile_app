import React from "react";
import { Box, Button } from "@mui/joy";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import TextComponent from "./TextComponent";
import Pride from "react-canvas-confetti/dist/presets/pride";
import randomInRange from "react-canvas-confetti/dist/helpers/randomInRange";

const OrderConfirmationPage = ({
    orderId,
    message = "Your order has been placed successfully.",
    onBack,
    showCelebration
}) => {

    const decorateOptions = (defaultOptions) => ({
        ...defaultOptions,
        colors: ["#FF69B4", "#00FF00", "#FFA500"],
        scalar: randomInRange(0.6, 1.2),
        particleCount: randomInRange(2, 8),
    });

    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "#f4f6fb",
                px: 3,
                textAlign: "center",
                position: "relative",
                borderBottomLeftRadius: 16,
                borderBottomRightRadius: 16
            }}
        >
            {/* Confetti */}
            {showCelebration && (
                <Pride
                    autorun={{ speed: 20 }}
                    decorateOptions={decorateOptions}
                    style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        pointerEvents: "none",
                        borderTopRightRadius: 16,
                        borderTopLeftRadius: 16,
                    }}
                />
            )}
            {/* Animated Tick */}
            <Box
                sx={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    bgcolor: "#feeef9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                    animation: "pop 0.4s ease",
                    "@keyframes pop": {
                        "0%": { transform: "scale(0.5)", opacity: 0 },
                        "100%": { transform: "scale(1)", opacity: 1 },
                    },
                }}
            >
                <CheckCircleRoundedIcon
                    sx={{
                        fontSize: 70,
                        color: "#b52683",
                    }}
                />
            </Box>

            {/* Title */}
            <TextComponent
                value="Order Confirmed!"
                size={22}
                weight={800}
                color="#b52683"
            />

            {/* Description */}
            <Box sx={{ mt: 1, mb: 2 }}>
                <TextComponent
                    value={message}
                    size={14}
                    weight={500}
                    color="#555"
                />
            </Box>

            {/* Order ID */}
            {orderId && (
                <Box
                    sx={{
                        px: 2,
                        py: 1,
                        borderRadius: 20,
                        bgcolor: "#ffffff",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                        mb: 3,
                    }}
                >
                    <TextComponent
                        value={`Order ID: ${orderId}`}
                        size={13}
                        weight={700}
                        color="#000"
                    />
                </Box>
            )}

            {/* Button */}
            <Button
                onClick={onBack}
                sx={{
                    px: 4,
                    py: 1.2,
                    borderRadius: 30,
                    fontWeight: 600,
                    background: "linear-gradient(135deg, #c22ea4, #d331ba)",
                    boxShadow: "0 4px 12px rgba(185, 34, 183, 0.4)",
                    "&:hover": {
                        background: "linear-gradient(135deg, #c22ea4, #d331ba)",
                    },
                }}
            >
                Back to View List
            </Button>
        </Box>
    );
};

export default OrderConfirmationPage;