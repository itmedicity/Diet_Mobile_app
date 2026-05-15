import React, { memo } from "react";
import { Box } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import TextComponent from "../../components/TextComponent";

import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import PendingRoundedIcon from "@mui/icons-material/PendingRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import DeliveryDiningRoundedIcon from "@mui/icons-material/DeliveryDiningRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";

const statusStyles = {

    PENDING: {
        label: "Pending",
        color: "#9c42f0",
        bg: "rgba(156,66,240,0.12)",
        border: "rgba(156,66,240,0.35)",
        icon: <PendingRoundedIcon sx={{ fontSize: 14 }} />
    },

    PICKEDUP: {
        label: "Picked Up",
        color: "#ff9800",
        bg: "rgba(255,152,0,0.12)",
        border: "rgba(255,152,0,0.35)",
        icon: <LocalShippingRoundedIcon sx={{ fontSize: 14 }} />
    },

    DELIVERED: {
        label: "Delivered",
        color: "#4caf50",
        bg: "rgba(76,175,80,0.12)",
        border: "rgba(76,175,80,0.35)",
        icon: <DoneAllRoundedIcon sx={{ fontSize: 14 }} />
    },

    UNDELIVERED: {
        label: "Undelivered",
        color: "#03a9f4",
        bg: "rgba(3,169,244,0.12)",
        border: "rgba(3,169,244,0.35)",
        icon: <DeliveryDiningRoundedIcon sx={{ fontSize: 14 }} />
    },

    RETURNED: {
        label: "Returned",
        color: "#ff5722",
        bg: "rgba(255,87,34,0.12)",
        border: "rgba(255,87,34,0.35)",
        icon: <ReplayRoundedIcon sx={{ fontSize: 14 }} />
    },

    CANCELLED: {
        label: "Cancelled",
        color: "#f44336",
        bg: "rgba(244,67,54,0.12)",
        border: "rgba(244,67,54,0.35)",
        icon: <CancelRoundedIcon sx={{ fontSize: 14 }} />
    }
};

const DeliveryPatientCardList = ({ filterdData = [] }) => {

    const navigate = useNavigate();

    const handlebedDetail = (item) => {
        navigate("/deliverydetail", {
            state: {
                patientData: item,
            },
        });
    };

    return (
        <Box sx={{ width: '92%' }}>
            {
                filterdData?.map((item, index) => {
                    const status =
                        statusStyles[item?.ItemStatus] ||
                        statusStyles.PENDING;
                    return (
                        <Box
                            key={index}
                            onClick={() => handlebedDetail(item)}
                            sx={{
                                width: '100%',
                                position: "relative",
                                overflow: "hidden",
                                borderRadius: 5,
                                mb: 1.5,
                                cursor: "pointer",
                                background:
                                    "linear-gradient(135deg,#ffffff,#faf7ff)",
                                border:
                                    `1px solid ${status.border}`,
                                boxShadow:
                                    "0 10px 25px rgba(0,0,0,0.06)",
                                transition: "0.25s",
                                "&:hover": {
                                    transform: "translateY(-2px)"
                                }
                            }}>
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: 6,
                                    height: "100%",
                                    bgcolor: status.color
                                }}
                            />
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    p: 1.5
                                }}
                            >

                                {/* LEFT */}
                                <Box
                                    sx={{
                                        width: "28%"
                                    }}
                                >

                                    <TextComponent
                                        color="#111"
                                        value={item?.fb_bdc_no}
                                        size={15}
                                        weight={800}
                                    />

                                    <TextComponent
                                        color="#777"
                                        value={item?.fb_ns_name}
                                        size={9}
                                        weight={600}
                                    />

                                </Box>

                                {/* CENTER */}
                                <Box
                                    sx={{
                                        width: "34%",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: 0.6
                                    }}
                                >

                                    <TextComponent
                                        color="#222"
                                        value={item?.type_desc || 'TIME'}
                                        size={11}
                                        weight={700}
                                    />

                                    {/* STATUS BADGE */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 0.6,

                                            px: 1.3,
                                            py: 0.5,

                                            borderRadius: "30px",

                                            bgcolor: status.bg,

                                            border:
                                                `1px solid ${status.border}`,

                                            color: status.color,

                                            backdropFilter: "blur(8px)"
                                        }}
                                    >

                                        {status.icon}

                                        <TextComponent
                                            color={status.color}
                                            value={status.label}
                                            size={8}
                                            weight={800}
                                        />

                                    </Box>

                                </Box>

                                {/* RIGHT */}
                                <Box
                                    sx={{
                                        width: "38%",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "flex-end",
                                        overflow: "hidden"
                                    }}
                                >

                                    <TextComponent
                                        color="#111"
                                        value={item?.fb_ptc_name}
                                        size={11}
                                        weight={700}
                                    />

                                    <TextComponent
                                        color="#888"
                                        value={item?.fb_pt_no}
                                        size={9}
                                        weight={500}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    );
                })
            }

        </Box>
    );
};

export default memo(DeliveryPatientCardList);