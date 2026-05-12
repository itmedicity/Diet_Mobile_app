import { Box, Button } from "@mui/joy";
import React, { memo, useState, useCallback } from "react";
import TextComponent from "../../components/TextComponent";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CancelIcon from "@mui/icons-material/Cancel";
import ReplayIcon from "@mui/icons-material/Replay";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import BlockIcon from "@mui/icons-material/Block";
import InventoryIcon from "@mui/icons-material/Inventory";
import { axioslogin } from "../../Axios/axios";
import { EmpauthId, succesNofity, warningNofity } from "../Constant/Constant";

/* STATUS CONFIG */
const statusConfig = {
    PENDING: { label: "Pending", color: "#f0ad4e", bg: "#fff4e5", icon: AccessTimeIcon },
    PREPARED: { label: "Prepared", color: "#0dcaf0", bg: "#e7f9fc", icon: InventoryIcon },
    DELIVERED: { label: "Delivered", color: "#198754", bg: "#f0faf4", icon: DoneAllIcon },
    SKIPPED: { label: "Skipped", color: "#6c757d", bg: "#f1f3f5", icon: BlockIcon },
    CANCELLED: { label: "Cancelled", color: "#dc3545", bg: "#fdf1f0", icon: CancelIcon },
    PICKEDUP: { label: "Picked Up", color: "#6610f2", bg: "#f3f0ff", icon: LocalShippingIcon },
    RETURNED: { label: "Returned", color: "#fd7e14", bg: "#fff4e6", icon: ReplayIcon },
    UNDELIVERED: { label: "Undelivered", color: "#adb5bd", bg: "#f8f9fa", icon: CancelIcon },
};

const allStatuses = Object.keys(statusConfig);

const DeliveryFoodItemCard = ({ item, patientData }) => {

    const id = EmpauthId();
    const { patient_id,diet_plan_id } = patientData ?? {};


 

    const { item_name, description, quantity, unit_code, item_id } = item ?? {};

    const [expanded, setExpanded] = useState(false);
    const [status, setStatus] = useState("PENDING");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [remarks, setRemarks] = useState("");

    /* TOGGLE SELECT */
    const handleToggle = (st) => {
        setSelectedStatus(prev => (prev === st ? "" : st));
    };

    const confirmAction = useCallback(async () => {
        if (!selectedStatus) return warningNofity("Select Status Befor Updating");
        if (!remarks) return warningNofity("Please Enter Remark ")

        const payload = {
            patient_diet_id: diet_plan_id,
            item_id: item_id,
            delivered_qty: quantity,
            delivery_status: selectedStatus,
            delivery_remarks: remarks,
            develivered_by: id
        };

        try {
            const response = await axioslogin.post("/fooddietorder/diet-delivery-log", payload);
            const { success, message } = response.data ?? {};
            if (success === 0) return warningNofity(message);
            succesNofity(message)
            setStatus(selectedStatus);
            setExpanded(false);
            setSelectedStatus("");
            setRemarks("");
        } catch (err) {
            console.error(err);
        }
    }, [selectedStatus, remarks, item, patientData, id]);

    const currentStatus = statusConfig[status];

    return (
        <Box
            sx={{
                width: "96%",
                borderRadius: 4,
                bgcolor: currentStatus.bg,
                p: 1.5,
                mt: 1,
                border: `1px solid ${currentStatus.color}`,
                boxShadow: "sm"
            }}
        >
            {/* HEADER */}
            <Box
                onClick={() => setExpanded(prev => !prev)}
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer"
                }}
            >
                <Box sx={{ width: "40%" }}>
                    <TextComponent value={item_name} size={13} weight={600} />
                    <TextComponent value={description} size={9} color="#666" />
                </Box>

                <Box sx={{ textAlign: "right" }}>
                    <TextComponent
                        value={`Qty: ${quantity}${unit_code}`}
                        size={11}
                        weight={700}
                    />
                    <Box
                        sx={{
                            mt: 0.5,
                            px: 1.2,
                            py: 0.3,
                            borderRadius: 20,
                            bgcolor: "#fff",
                            color: currentStatus.color,
                            fontSize: 10,
                            fontWeight: 700
                        }}
                    >
                        {currentStatus.label}
                    </Box>
                </Box>

                <ExpandMoreRoundedIcon
                    sx={{
                        transform: expanded ? "rotate(180deg)" : "rotate(0deg)"
                    }}
                />
            </Box>

            {/* EXPANDED */}
            <Box
                sx={{
                    maxHeight: expanded ? 600 : 0,
                    overflow: "hidden",
                    transition: "0.3s"
                }}
            >
                <Box sx={{ mt: 1.5 }}>

                    {/* TOGGLE STATUS CARDS */}
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(2, 1fr)",
                            gap: 1.2
                        }}
                    >
                        {allStatuses.map((st) => {
                            const Icon = statusConfig[st].icon;
                            const isActive = selectedStatus === st;

                            return (
                                <Box
                                    key={st}
                                    onClick={() => handleToggle(st)}
                                    sx={{
                                        p: 1.2,
                                        borderRadius: 3,
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        border: isActive
                                            ? `2px solid ${statusConfig[st].color}`
                                            : "1px solid #ddd",
                                        bgcolor: isActive
                                            ? statusConfig[st].bg
                                            : "#fff",
                                        transition: "0.2s"
                                    }}
                                >
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <Icon sx={{ fontSize: 18, color: statusConfig[st].color }} />
                                        <TextComponent value={statusConfig[st].label} size={11} weight={600} />
                                    </Box>

                                    {/* ACTIVE DOT */}
                                    {isActive && (
                                        <Box
                                            sx={{
                                                width: 8,
                                                height: 8,
                                                borderRadius: "50%",
                                                bgcolor: statusConfig[st].color
                                            }}
                                        />
                                    )}
                                </Box>
                            );
                        })}
                    </Box>

                    {/* REMARKS */}
                    <textarea
                        rows={3}
                        placeholder="Add remarks"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        style={{
                            width: "98%",
                            marginTop: 10,
                            padding: 2,
                            borderRadius: 6,
                            border: "1px solid #ccc"
                        }}
                    />

                    {/* CONFIRM */}
                    <Button
                        fullWidth
                        sx={{ mt: 1.5 }}
                        disabled={!selectedStatus}
                        onClick={confirmAction}
                    >
                        Apply Status
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default memo(DeliveryFoodItemCard);