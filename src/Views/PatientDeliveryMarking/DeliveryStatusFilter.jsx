import React, { useState } from "react";
import {
    Box,
    Typography,
    Avatar,
    Badge,
    IconButton
} from "@mui/joy";

import PendingRoundedIcon from "@mui/icons-material/PendingRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import DeliveryDiningRoundedIcon from "@mui/icons-material/DeliveryDiningRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const STATUS_LIST = [
    {
        key: "",
        label: "All",
        color: "#6366f1",
        icon: <TuneRoundedIcon sx={{ fontSize: 15 }} />
    },

    {
        key: "PENDING",
        label: "Pending",
        color: "#9c42f0",
        icon: <PendingRoundedIcon sx={{ fontSize: 15 }} />
    },

    {
        key: "PICKEDUP",
        label: "Picked",
        color: "#ff9800",
        icon: <LocalShippingRoundedIcon sx={{ fontSize: 15 }} />
    },

    {
        key: "DELIVERED",
        label: "Delivered",
        color: "#4caf50",
        icon: <DoneAllRoundedIcon sx={{ fontSize: 15 }} />
    },

    {
        key: "UNDELIVERED",
        label: "Missed",
        color: "#03a9f4",
        icon: <DeliveryDiningRoundedIcon sx={{ fontSize: 15 }} />
    },

    {
        key: "RETURNED",
        label: "Returned",
        color: "#ff5722",
        icon: <ReplayRoundedIcon sx={{ fontSize: 15 }} />
    },

    {
        key: "CANCELLED",
        label: "Cancelled",
        color: "#f44336",
        icon: <CancelRoundedIcon sx={{ fontSize: 15 }} />
    }
];

const DeliveryStatusFilter = ({
    value,
    onChange
}) => {

    const [open, setOpen] = useState(false);

    return (
        <Box
            sx={{
                position: "fixed",
                top: 78,
                right: 14,
                zIndex: 9999,

                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",

                gap: 1
            }}
        >

            {/* Floating Toggle Button */}
            <IconButton
                onClick={() => setOpen(prev => !prev)}

                sx={{

                    width: 52,
                    height: 52,

                    borderRadius: "50%",

                    bgcolor: open
                        ? "#111827"
                        : "#fff",

                    color: open
                        ? "#fff"
                        : "#111827",

                    border: "1px solid #e5e7eb",

                    boxShadow:
                        "0 10px 25px rgba(0,0,0,0.15)",

                    backdropFilter: "blur(14px)",

                    transition: "all 0.22s ease",

                    "&:hover": {
                        transform: "translateY(-2px)"
                    },

                    "&:active": {
                        transform: "scale(0.92)"
                    }
                }}
            >

                {
                    open
                        ? <CloseRoundedIcon />
                        : <TuneRoundedIcon />
                }

            </IconButton>

            {/* Floating Filter Panel */}
            {
                open &&
                <Box
                    sx={{

                        width: 290,

                        display: "grid",

                        gridTemplateColumns:
                            "repeat(4,1fr)",

                        gap: 1,

                        p: 1,

                        borderRadius: "24px",

                        bgcolor:
                            "rgba(255,255,255,0.72)",

                        backdropFilter: "blur(16px)",

                        border:
                            "1px solid rgba(255,255,255,0.45)",

                        boxShadow:
                            "0 16px 40px rgba(0,0,0,0.12)",

                        animation:
                            "fadeIn 0.22s ease"
                    }}
                >

                    {
                        STATUS_LIST?.map((item) => {
                            const active =
                                value === item.key;

                            return (
                                <Box
                                    key={item.key}

                                    onClick={() =>{
                                        onChange(item.key)
                                        setOpen(false)
                                    }
                                        
                                    }

                                    sx={{

                                        position: "relative",

                                        height: 66,

                                        borderRadius: "18px",

                                        display: "flex",

                                        flexDirection: "column",

                                        alignItems: "center",

                                        justifyContent: "center",

                                        gap: 0.5,

                                        cursor: "pointer",

                                        overflow: "hidden",

                                        transition:
                                            "all 0.2s ease",

                                        bgcolor: active
                                            ? item.color
                                            : "#fff",

                                        border: active
                                            ? `1.5px solid ${item.color}`
                                            : "1px solid #eef2f7",

                                        boxShadow: active
                                            ? `0 8px 20px ${item.color}30`
                                            : "0 2px 8px rgba(0,0,0,0.05)",

                                        transform: active
                                            ? "translateY(-1px)"
                                            : "scale(1)",

                                        "&:active": {
                                            transform:
                                                "scale(0.95)"
                                        }
                                    }}
                                >

                                    {/* Glow */}
                                    {
                                        active &&
                                        <Box
                                            sx={{
                                                position: "absolute",
                                                inset: 0,

                                                background:
                                                    `linear-gradient(
                                                180deg,
                                                rgba(255,255,255,0.15),
                                                transparent
                                            )`
                                            }}
                                        />
                                    }

                                    {/* Icon */}
                                    <Avatar
                                        size="sm"

                                        sx={{
                                            width: 28,
                                            height: 28,

                                            bgcolor: active
                                                ? "rgba(255,255,255,0.20)"
                                                : `${item.color}15`,

                                            color: active
                                                ? "#fff"
                                                : item.color,

                                            border: active
                                                ? "1px solid rgba(255,255,255,0.25)"
                                                : "none"
                                        }}
                                    >
                                        {item.icon}
                                    </Avatar>

                                    {/* Label */}
                                    <Typography
                                        level="body-xs"

                                        sx={{
                                            fontSize: 10,

                                            fontWeight: 800,

                                            letterSpacing: 0.2,

                                            color: active
                                                ? "#fff"
                                                : "#111827",

                                            textAlign: "center"
                                        }}
                                    >
                                        {item.label}
                                    </Typography>

                                    {/* Active Dot */}
                                    {
                                        active &&
                                        <Badge
                                            size="sm"

                                            sx={{
                                                position: "absolute",
                                                top: 6,
                                                right: 6
                                            }}
                                        />
                                    }

                                </Box>
                            );
                        })
                    }

                </Box>
            }

        </Box>
    );
};

export default React.memo(DeliveryStatusFilter);