import React, { memo } from "react";
import { Fab, Badge, Box } from "@mui/material";
import DeliveryDiningRoundedIcon from "@mui/icons-material/DeliveryDiningRounded";
import RestaurantMenuRoundedIcon from "@mui/icons-material/RestaurantMenuRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";

const FloatingPickupButton = ({
    count = 0,
    onClick
}) => {

    return (
        <Box
            sx={{
                position: "fixed",
                bottom: 150,
                right: 20,
                zIndex: 99
            }}
        >
            <Badge
                badgeContent={count}
                color="error"
                overlap="circular"
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right"
                }}
                sx={{
                    "& .MuiBadge-badge": {
                        fontWeight: 800,
                        fontSize: 11,
                        minWidth: 22,
                        height: 22,
                        borderRadius: "50%",
                        border: "2px solid #fff"
                    }
                }}
            >
                <Fab
                    onClick={onClick}
                    sx={{
                        width: 72,
                        height: 72,
                        background:
                            "linear-gradient(135deg, #9c42f0 0%, #6610f2 100%)",
                        color: "#fff",
                        boxShadow:
                            "0px 10px 25px rgba(102,16,242,0.4)",
                        position: "relative",
                        overflow: "hidden",

                        "&:hover": {
                            background:
                                "linear-gradient(135deg, #8a35e6 0%, #5a0ddd 100%)",
                            transform: "translateY(-4px) scale(1.03)"
                        },

                        transition: "all 0.25s ease"
                    }}
                >

                    {/* GLOW EFFECT */}
                    <Box
                        sx={{
                            position: "absolute",
                            width: 80,
                            height: 80,
                            bgcolor: "rgba(255,255,255,0.15)",
                            borderRadius: "50%",
                            top: -25,
                            right: -20
                        }}
                    />

                    {/* ICON STACK */}
                    <Box
                        sx={{
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <RestaurantMenuRoundedIcon
                            sx={{
                                position: "absolute",
                                fontSize: 18,
                                top: -12,
                                left: -14,
                                opacity: 0.9
                            }}
                        />

                        <DeliveryDiningRoundedIcon
                            sx={{
                                fontSize: 34
                            }}
                        />

                        <LocalShippingRoundedIcon
                            sx={{
                                position: "absolute",
                                fontSize: 16,
                                bottom: -10,
                                right: -14,
                                opacity: 0.9
                            }}
                        />
                    </Box>

                </Fab>
            </Badge>
        </Box>
    );
};

export default memo(FloatingPickupButton);