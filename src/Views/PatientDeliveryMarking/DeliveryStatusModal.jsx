import React from "react";
import {
    Modal,
    ModalDialog,
    Box
} from "@mui/joy";

import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import DeliveryDiningRoundedIcon from "@mui/icons-material/DeliveryDiningRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";

import TextComponent from "../../components/TextComponent";

const statuses = [
    {
        label: "Delivered",
        value: "DELIVERED",
        color: "#4caf50",
        icon: <DoneAllRoundedIcon />
    },
    {
        label: "Undelivered",
        value: "UNDELIVERED",
        color: "#03a9f4",
        icon: <DeliveryDiningRoundedIcon />
    },
    {
        label: "Returned",
        value: "RETURNED",
        color: "#ff5722",
        icon: <ReplayRoundedIcon />
    },
    {
        label: "Cancelled",
        value: "CANCELLED",
        color: "#f44336",
        icon: <CancelRoundedIcon />
    }
];

const DeliveryStatusModal = ({
    open,
    onClose,
    selectedItem,
    handleStatusUpdate
}) => {
    return (
        <Modal open={open} onClose={onClose}>
            <ModalDialog
                layout="center"
                sx={{
                    width: "95%",
                    maxWidth: 420,
                    borderRadius: "24px",
                    p: 2
                }}
            >
                <Box sx={{ mb: 2 }}>
                    <TextComponent
                        value={selectedItem?.fb_ptc_name}
                        size={16}
                        weight={800}
                        color="#222"
                    />

                    <TextComponent
                        value={`${selectedItem?.fb_ns_name} • ${selectedItem?.type_desc}`}
                        size={11}
                        weight={600}
                        color="#777"
                    />
                </Box>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 1.2
                    }}
                >
                    {statuses.map((s) => (
                        <Box
                            key={s.value}
                            onClick={() => handleStatusUpdate(s.value)}
                            sx={{
                                p: 1.5,
                                borderRadius: "16px",
                                cursor: "pointer",
                                textAlign: "center",
                                border: `1px solid ${s.color}30`,
                                bgcolor: `${s.color}10`,
                                transition: "0.2s",
                                "&:hover": {
                                    transform: "translateY(-2px)"
                                }
                            }}
                        >
                            <Box sx={{ color: s.color }}>
                                {s.icon}
                            </Box>

                            <TextComponent
                                value={s.label}
                                size={10}
                                weight={800}
                                color={s.color}
                            />
                        </Box>
                    ))}
                </Box>
            </ModalDialog>
        </Modal>
    );
};

export default DeliveryStatusModal;