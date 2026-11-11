
import React, { memo } from "react";
import { Box, Typography } from "@mui/joy";
import { useNavigate } from "react-router-dom";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import CircleRoundedIcon from "@mui/icons-material/CircleRounded";

import LoginEmployeeHeader from "../../components/LoginEmployeeHeader";

const ParentComponent = () => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <Box
            sx={{
                minHeight: "100dvh",
                width: "100%",
                background: "#F7F7F5",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                boxSizing: "border-box",
            }}
        >
            <LoginEmployeeHeader />

            <Box
                sx={{
                    flex: 1,
                    width: "100%",
                    maxWidth: "480px",
                    mx: "auto",
                    px: {
                        xs: 2,
                        sm: 2.5,
                    },
                    py: {
                        xs: 1.5,
                        sm: 2,
                    },
                    display: "flex",
                    flexDirection: "column",
                    boxSizing: "border-box",
                    minHeight: 0,
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        mb: {
                            xs: 1,
                            sm: 1.5,
                        },
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                mt: 0.4,
                                fontSize: {
                                    xs: "0.72rem",
                                    sm: "0.78rem",
                                },
                                fontWeight: 600,
                                color: "#8A8A8A",
                                letterSpacing: "0.01em",
                            }}
                        >
                            Kitchen Operations
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.7,
                            pt: 0.5,
                        }}
                    >
                        <CircleRoundedIcon
                            sx={{
                                fontSize: 9,
                                color: "#28A745",
                            }}
                        />

                        <Typography
                            sx={{
                                fontSize: "0.65rem",
                                fontWeight: 700,
                                color: "#777",
                            }}
                        >
                            ONLINE
                        </Typography>
                    </Box>
                </Box>

                {/* Quick Action */}
                <Box
                    sx={{
                        flex: 1,
                        minHeight: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        py: {
                            xs: 1,
                            sm: 2,
                        },
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: "0.65rem",
                            fontWeight: 800,
                            letterSpacing: "0.16em",
                            color: "#A0A0A0",
                            mb: {
                                xs: 1.5,
                                sm: 2,
                            },
                        }}
                    >
                        QUICK ACTION
                    </Typography>

                    <Box
                        onClick={() => handleNavigation("/Home")}
                        sx={{
                            position: "relative",
                            width: {
                                xs: 96,
                                sm: 110,
                            },
                            height: {
                                xs: 96,
                                sm: 110,
                            },
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",

                            "&:hover .outer-ring": {
                                transform: "rotate(45deg)",
                            },

                            "&:active": {
                                transform: "scale(0.96)",
                            },

                            transition: "transform 0.15s ease",
                        }}
                    >
                        <Box
                            className="outer-ring"
                            sx={{
                                position: "absolute",
                                inset: 8,
                                border: "2px solid #9b1ea9",
                                borderRadius: "24px",
                                transform: "rotate(45deg)",
                                transition: "transform 0.3s ease",
                            }}
                        />

                        <Box
                            sx={{
                                width: {
                                    xs: 66,
                                    sm: 76,
                                },
                                height: {
                                    xs: 66,
                                    sm: 76,
                                },
                                borderRadius: "20px",
                                background: "#9b1ea9",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                position: "relative",
                                zIndex: 2,
                                boxShadow: "0 10px 25px rgba(0,0,0,0.14)",
                            }}
                        >
                            <AddRoundedIcon
                                sx={{
                                    color: "#fff",
                                    fontSize: {
                                        xs: 38,
                                        sm: 44,
                                    },
                                }}
                            />
                        </Box>
                    </Box>

                    <Typography
                        onClick={() => handleNavigation("/Home")}
                        sx={{
                            mt: {
                                xs: 1.5,
                                sm: 2,
                            },
                            fontSize: {
                                xs: "0.85rem",
                                sm: "0.9rem",
                            },
                            fontWeight: 900,
                            letterSpacing: "0.08em",
                            color: "#101010",
                            cursor: "pointer",
                        }}
                    >
                        NEW ORDER
                    </Typography>
                </Box>

                {/* Navigation */}
                <Box
                    sx={{
                        borderTop: "1px solid #DEDEDC",
                        borderBottom: "1px solid #DEDEDC",
                    }}
                >
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                        }}
                    >
                        {/* Delivery */}
                        <Box
                            onClick={() => handleNavigation("/delivery")}
                            sx={{
                                minHeight: {
                                    xs: 76,
                                    sm: 84,
                                },
                                px: {
                                    xs: 0.5,
                                    sm: 1,
                                },
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: {
                                    xs: 0.6,
                                    sm: 1,
                                },
                                cursor: "pointer",
                                borderRight: "1px solid #DEDEDC",

                                "&:active": {
                                    background: "#EEEEEC",
                                },
                            }}
                        >
                            <LocalShippingRoundedIcon
                                sx={{
                                    fontSize: {
                                        xs: 21,
                                        sm: 25,
                                    },
                                    color: "#9b1ea9",
                                }}
                            />

                            <Box>
                                <Typography
                                    sx={{
                                        fontSize: {
                                            xs: "0.65rem",
                                            sm: "0.75rem",
                                        },
                                        fontWeight: 900,
                                        color: "#202020",
                                        fontFamily: "Bahnschrift",
                                    }}
                                >
                                    DELIVERY
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: "0.55rem",
                                        color: "#999",
                                        mt: 0.2,
                                        fontFamily: "Bahnschrift",
                                    }}
                                >
                                    Mark orders
                                </Typography>
                            </Box>
                        </Box>

                        {/* Collection */}
                        <Box
                            onClick={() => handleNavigation("/cash-collection")}
                            sx={{
                                minHeight: {
                                    xs: 76,
                                    sm: 84,
                                },
                                px: {
                                    xs: 0.5,
                                    sm: 1,
                                },
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: {
                                    xs: 0.6,
                                    sm: 1,
                                },
                                cursor: "pointer",
                                borderRight: "1px solid #DEDEDC",

                                "&:active": {
                                    background: "#EEEEEC",
                                },
                            }}
                        >
                            <PaymentsRoundedIcon
                                sx={{
                                    fontSize: {
                                        xs: 21,
                                        sm: 25,
                                    },
                                    color: "#9b1ea9",
                                }}
                            />

                            <Box>
                                <Typography
                                    sx={{
                                        fontSize: {
                                            xs: "0.65rem",
                                            sm: "0.75rem",
                                        },
                                        fontWeight: 900,
                                        color: "#202020",
                                        fontFamily: "Bahnschrift",
                                    }}
                                >
                                    COLLECTION
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: "0.55rem",
                                        color: "#999",
                                        mt: 0.2,
                                        fontFamily: "Bahnschrift",
                                    }}
                                >
                                    Cash collection
                                </Typography>
                            </Box>
                        </Box>

                        {/* Batch */}
                        <Box
                            onClick={() => handleNavigation("/batch")}
                            sx={{
                                minHeight: {
                                    xs: 76,
                                    sm: 84,
                                },
                                px: {
                                    xs: 0.5,
                                    sm: 1,
                                },
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: {
                                    xs: 0.6,
                                    sm: 1,
                                },
                                cursor: "pointer",

                                "&:active": {
                                    background: "#EEEEEC",
                                },
                            }}
                        >
                            <Inventory2RoundedIcon
                                sx={{
                                    fontSize: {
                                        xs: 21,
                                        sm: 25,
                                    },
                                    color: "#9b1ea9",
                                }}
                            />

                            <Box>
                                <Typography
                                    sx={{
                                        fontSize: {
                                            xs: "0.65rem",
                                            sm: "0.75rem",
                                        },
                                        fontWeight: 900,
                                        color: "#202020",
                                        fontFamily: "Bahnschrift",
                                        
                                    }}
                                >
                                    BATCH
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: "0.55rem",
                                        color: "#999",
                                        mt: 0.2,
                                        fontFamily: "Bahnschrift",
                                    }}
                                >
                                    Production
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* Footer */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 0.7,
                        pt: {
                            xs: 1.2,
                            sm: 1.5,
                        },
                    }}
                >
                    <CircleRoundedIcon
                        sx={{
                            fontSize: 7,
                            color: "#28A745",
                        }}
                    />

                    <Typography
                        sx={{
                            fontSize: {
                                xs: "0.58rem",
                                sm: "0.62rem",
                            },
                            fontWeight: 800,
                            color: "#999",
                            letterSpacing: "0.12em",
                        }}
                    >
                        SYSTEM ONLINE
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default memo(ParentComponent);
