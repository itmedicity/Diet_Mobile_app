import React from "react";
import { Box } from "@mui/joy";
import KeyboardDoubleArrowLeftRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowLeftRounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import TextComponent from "./TextComponent";

const SwipeUpOrderBar = ({
    hasItems,
    totalItems,
    totalAmount,
    onOpen,
    hasOrders
}) => {
    return (
        <Box
            onClick={() => hasItems && onOpen("list")}
            sx={{
                // flex: 1,
                 width:hasOrders?'60%':'100%',
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 1.5,
                cursor: hasItems ? "pointer" : "default",
                bgcolor: hasItems ? "#9d25b8" : "#f5f5f5",
                transition: "all .25s ease",

                "&:active": hasItems
                    ? {
                        transform: "scale(0.985)"
                    }
                    : {},

                // swipe animation overlay
                "&::before": hasItems
                    ? {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        right: "-40%",
                        width: "35%",
                        height: "100%",
                        background:
                            "linear-gradient(270deg, rgba(255,255,255,0.28), transparent)",
                        transform: "skewX(-20deg)",
                        animation: "swipeRightLeft 1.8s infinite"
                    }
                    : {}
            }}
        >
            {/* LEFT */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    zIndex: 2
                }}
            >
                <Box
                    sx={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: hasItems
                            ? "rgba(255,255,255,0.14)"
                            : "#e0e0e0"
                    }}
                >
                    <ShoppingBagRoundedIcon
                        sx={{
                            fontSize: 16,
                            color: hasItems ? "#fff" : "#777"
                        }}
                    />
                </Box>

                <Box>
                    <TextComponent
                        value={
                            hasItems
                                ? `${totalItems} Items Added`
                                : "No Items Selected"
                        }
                        size={10}
                        weight={700}
                        color={hasItems ? "#fff" : "#666"}
                    />

                    {hasItems && (
                        <TextComponent
                            value="click to review"
                            size={8}
                            weight={500}
                            color="rgba(255,255,255,0.7)"
                        />
                    )}
                </Box>
            </Box>

            {/* RIGHT */}
            {hasItems && (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        zIndex: 2
                    }}
                >
                    <TextComponent
                        value={`₹ ${totalAmount}`}
                        size={15}
                        weight={800}
                        color="#fff"
                    />

                    <KeyboardDoubleArrowLeftRoundedIcon
                        sx={{
                            color: "#fff",
                            fontSize: 22,
                            animation: "leftSwipe 1s infinite"
                        }}
                    />
                </Box>
            )}

            <style>
                {`
                    @keyframes leftSwipe {
                        0% {
                            transform: translateX(0px);
                            opacity: 0.5;
                        }
                        50% {
                            transform: translateX(-6px);
                            opacity: 1;
                        }
                        100% {
                            transform: translateX(0px);
                            opacity: 0.5;
                        }
                    }

                    @keyframes swipeRightLeft {
                        0% {
                            right: -40%;
                        }
                        100% {
                            right: 120%;
                        }
                    }
                `}
            </style>
        </Box>
    );
};

export default SwipeUpOrderBar;