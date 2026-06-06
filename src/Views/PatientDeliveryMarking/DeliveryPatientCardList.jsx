import React, { memo, useState } from "react";
import { Box } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import TextComponent from "../../components/TextComponent";
import DeliveryStatusModal from "./DeliveryStatusModal";

import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import PendingRoundedIcon from "@mui/icons-material/PendingRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import DeliveryDiningRoundedIcon from "@mui/icons-material/DeliveryDiningRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import { EmpauthId, errorNofity, succesNofity, warningNofity } from "../Constant/Constant";
import { axioslogin } from "../../Axios/axios";
import { useQueryClient } from "@tanstack/react-query";

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
    const id = EmpauthId();
    const queryClient = useQueryClient();
    const [openStatusModal, setOpenStatusModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleCardClick = (item) => {
        navigate("/deliverydetail", {
            state: { patientData: item }
        });
    };

    const handleStatusClick = (e, item) => {
        e.stopPropagation();
        const status = statusStyles[item?.ItemStatus];
        if (status?.label === "Pending") return;

        setSelectedItem(item);
        setOpenStatusModal(true);
    };

    const handleStatusUpdate = async (status) => {

        const payload = {
            assignment_id: selectedItem?.assignment_id,
            canteen_order_id: selectedItem?.canteen_order_id,
            delivery_status: status,
            type_slno: selectedItem?.type_slno,
            remarks: `Order ${status}`,
            updated_by: Number(id),
            item_name: selectedItem?.canteen_order_id,
            meal: selectedItem?.type_desc,
        };

        try {
            const result = await axioslogin.post("/dietdelivery/update-order-status", payload);
            const { success, message } = result.data || {};
            if (success === 0) return warningNofity(message);

            succesNofity(message);
            await queryClient.invalidateQueries(["assigneditem", id]);
            await queryClient.invalidateQueries(["canteenorders", selectedItem?.canteen_order_id]);
            await queryClient.invalidateQueries(["ptextraorder", selectedItem?.fb_ipad_slno, 'COMPLETED']);
            setOpenStatusModal(false);
        } catch (error) {
            console.log(error);
            errorNofity("Something went wrong");
        }




    };

    return (
        <>
            <Box sx={{ width: "92%" }}>
                {filterdData?.map((item, index) => {
                    const status =
                        statusStyles[item?.ItemStatus] ||
                        statusStyles.PENDING;

                    return (
                        <Box
                            key={index}
                            onClick={() => handleCardClick(item)}
                            sx={{
                                width: "100%",
                                mb: 1.5,
                                cursor: "pointer",
                                borderRadius: "18px",
                                overflow: "hidden",
                                bgcolor: "#fff",
                                border: `1px solid ${status.border}`,
                                boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                                transition: "all .25s ease",
                                "&:hover": {
                                    transform: "translateY(-3px)"
                                }
                            }}
                        >

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    p: 1.5,
                                    borderBottom: "1px solid #f3f3f3"
                                }}
                            >
                                <Box sx={{ display: "flex", gap: 1 }}>
                                    <Box
                                        sx={{
                                            width: 42,
                                            height: 42,
                                            borderRadius: "50%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            bgcolor: status.bg,
                                            border: `1px solid ${status.border}`
                                        }}
                                    >
                                        <TextComponent
                                            value={item?.fb_bdc_no}
                                            size={10}
                                            weight={800}
                                            color={status.color}
                                        />
                                    </Box>

                                    <Box>
                                        <TextComponent
                                            value={item?.fb_ptc_name}
                                            size={13}
                                            weight={800}
                                        />
                                        <TextComponent
                                            value={item?.fb_pt_no}
                                            size={9}
                                            color="#888"
                                        />
                                    </Box>
                                </Box>

                                <Box
                                    onClick={(e) =>
                                        handleStatusClick(e, item)
                                    }
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        height: 30,
                                        gap: 0.5,
                                        px: 1.2,
                                        borderRadius: "20px",
                                        bgcolor: status.bg,
                                        border: `1px solid ${status.border}`,
                                        color: status.color,
                                        cursor: "pointer"
                                    }}
                                >
                                    {status.icon}
                                    <TextComponent
                                        value={status.label}
                                        size={8}
                                        weight={800}
                                        color={status.color}
                                    />
                                </Box>
                            </Box>

                            {/* BOTTOM */}
                            <Box
                                sx={{
                                    p: 1.5,
                                    display: "flex",
                                    justifyContent: "space-between"
                                }}
                            >
                                <Box>
                                    <TextComponent
                                        value={item?.fb_ns_name}
                                        size={10}
                                        weight={700}
                                        color="#444"
                                    />
                                </Box>

                                <Box
                                    sx={{
                                        px: 1.5,
                                        py: 0.6,
                                        borderRadius: "12px",
                                        bgcolor: "#f7f7f7"
                                    }}
                                >
                                    <TextComponent
                                        value={item?.type_desc}
                                        size={10}
                                        weight={800}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    );
                })}
            </Box>

            {/* MODAL */}
            <DeliveryStatusModal
                open={openStatusModal}
                onClose={() => setOpenStatusModal(false)}
                selectedItem={selectedItem}
                handleStatusUpdate={handleStatusUpdate}
            />
        </>
    );
};

export default memo(DeliveryPatientCardList);