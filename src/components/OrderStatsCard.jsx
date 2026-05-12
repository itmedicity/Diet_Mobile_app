
import React, { memo, useMemo, useState } from "react";
import { Box, Typography, IconButton } from "@mui/joy";
import TextComponent from "./TextComponent";
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import { getBgColor, getItemType, groupPreviousOrder } from "../CommonData/Common";
import EmptyOrders from "../Views/NursingStation/Component/EmptyOrders";
import EditIcon from '@mui/icons-material/Edit';
import { EmpauthId, errorNofity, succesNofity, warningNofity } from "../Views/Constant/Constant";
import { axioslogin } from "../Axios/axios";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import EditOffIcon from '@mui/icons-material/EditOff';
import NoMealsIcon from '@mui/icons-material/NoMeals';
import DietButton from "./DietButton";
import ActionButton from "./ActionButton";
import RamenDiningIcon from '@mui/icons-material/RamenDining';
import { useQueryClient } from "@tanstack/react-query";
import { usePatientExtraOrders } from "../CommonData/UseQuery";
import OrderItemRow from "../Views/PatientOrderDetail/PatientOrderDetailComponents/OrderItemRow";
import EditToggleButton from "../Views/PatientOrderDetail/PatientOrderDetailComponents/EditToggleButton";


const PatientOrdersDashboard = ({
    selected,
    PreviousOrders,
    DietOrders,
    PatientDetail,

}) => {


    const queryClient = useQueryClient()


    const [selectedStatus, setSelectedStatus] = useState(null);
    const [editingOrder, setEditingOrder] = useState(null);
    const id = EmpauthId()



    const {
        data: PatientExtraOrders = [],
    } = usePatientExtraOrders(PatientDetail?.dietpt_slno, 'PENDING');

    //  ADDED: update quantity
    const updateQuantity = (itemId, type) => {
        setEditingOrder(prev => ({
            ...prev,
            items: prev.items.map(item =>
                item.item_id === itemId
                    ? {
                        ...item,
                        quantity:
                            type === "inc"
                                ? item.quantity + 1
                                : item.quantity > 1
                                    ? item.quantity - 1
                                    : 1
                    }
                    : item
            )
        }));
    };

    // Handle Order Updates
    const handleSaveExtraQuantityChanges = async () => {
        try {
            if (!editingOrder?.items?.length) {
                return warningNofity("No items to update");
            }

            const items = editingOrder.items || [];

            const canteen = items
                .filter(item => item.canteen_order_item_id != null)
                .map(item => ({
                    canteen_order_item_id: Number(item.canteen_order_item_id),
                    quantity: Number(item.quantity)
                }));

            const diet = items
                .filter(item => item.order_detail_id != null)
                .map(item => ({
                    order_detail_id: Number(item.order_detail_id),
                    quantity: Number(item.quantity)
                }));

            const extra = items
                .filter(item => item.extra_order_id != null)
                .map(item => ({
                    extra_order_id: Number(item.extra_order_id),
                    quantity: Number(item.quantity),
                    updated_by: Number(id)
                }));

            if (!canteen.length && !diet.length && !extra.length) {
                return warningNofity("No valid items to update");
            }

            const res = await axioslogin.patch(
                "/canteenorder/update/quantity",
                { canteen, diet, extra }
            );

            if (res?.data?.success !== 1) {
                return warningNofity(
                    res?.data?.message || "Update failed"
                );
            }

            succesNofity("Quantity updated successfully");
            await invalidateQueries();
            setEditingOrder(null);

        } catch (err) {
            console.error("Update Error:", err);

            errorNofity(
                err?.response?.data?.message || "Failed to update quantity"
            );
        }
    };


    const orders = useMemo(() => {
        return groupPreviousOrder(
            PreviousOrders,     // canteen
            DietOrders,         // diet
            PatientExtraOrders  // extra
        );
    }, [PreviousOrders, DietOrders, PatientExtraOrders]);


    //  Status count updated
    const statusCounts = useMemo(() => {
        return orders.reduce(
            (acc, order) => {
                if (order.order_status === "PENDING") acc.PENDING += 1;
                else if (order.order_status === "CONFIRMED") acc.CONFIRMED += 1;
                else if (order.order_status === "CANCELLED") acc.CANCELLED += 1;
                return acc;
            },
            { PENDING: 0, CONFIRMED: 0, CANCELLED: 0 }
        );
    }, [orders]);

    const filteredOrders = useMemo(() => {
        if (!orders?.length) return [];

        if (selectedStatus) {
            return orders?.filter(o => o?.order_status === selectedStatus);
        }
        const priorityStatus =
            statusCounts.PENDING > 0
                ? "PENDING"
                : statusCounts.CONFIRMED > 0
                    ? "CONFIRMED"
                    : "CANCELLED";

        return orders?.filter(o => o?.order_status === priorityStatus);
    }, [orders, statusCounts, selectedStatus]);

    const displayOrders = editingOrder ? [editingOrder] : filteredOrders;


    const invalidateQueries = async () => {
        await Promise.all([
            queryClient.invalidateQueries({
                queryKey: ['ptextraorder', PatientDetail?.dietpt_slno, 'PENDING']
            }),
            queryClient.invalidateQueries({
                queryKey: ['patientOrder', PatientDetail?.dietpt_slno]
            }),
            queryClient.invalidateQueries({
                queryKey: ['customerorder', PatientDetail?.ip_no, selected?.party_type_id]
            })
        ]);
    };


    const handleCancelItem = async (order, item) => {
        try {
            // BASIC VALIDATION
            if (!item) return warningNofity("Invalid item data");

            const isExtra = item?.extra_order_id != null;
            // EXTRA ORDER FLOW
            if (isExtra) {
                if (!item.extra_order_id) {
                    return warningNofity("Extra order id missing");
                }
                const payload = {
                    FoodName: item.item_name,
                    extra_order_id: item.extra_order_id,
                    updated_by: id,
                    canteen_order_item_id: item.canteen_order_item_id,
                    is_active: 0
                };

                const { data } = await axioslogin.patch(
                    '/patientExtraOrder/cancel',
                    payload
                );

                if (data?.success !== 1) {
                    return warningNofity(data?.message || "Failed to cancel extra item");
                }

                succesNofity(data?.message || "Extra item cancelled successfully");

                await invalidateQueries();
                return;
            }

            // NORMAL ORDER VALIDATION
            if (!item?.canteen_order_item_id)
                return warningNofity("Canteen order item id missing");

            if (!order?.canteen_order_id)
                return warningNofity("Order id missing");

            if (!item?.item_id)
                return warningNofity("Item id missing");

            // API PAYLOADS
            const canteenPayload = {
                FoodName: item.item_name,
                canteen_order_item_id: item.canteen_order_item_id,
                is_active: 0
            };

            const dietPayload = {
                FoodName: item.item_name,
                order_id: item.order_id,
                item_id: item.item_id,
                is_active: 0
            };

            // API CALLS (PARALLEL)
            const [canteenRes, dietRes] = await Promise.all([
                axioslogin.patch('/canteenorder/order/cancel', canteenPayload),
                axioslogin.patch('/fooddietorder/cancel-food', dietPayload)
            ]);
            const canteenSuccess = canteenRes?.data?.success === 1;
            const dietSuccess = dietRes?.data?.success === 1;

            // RESULT HANDLING
            if (canteenSuccess && dietSuccess) {
                succesNofity(canteenRes?.data?.message);
                await invalidateQueries();
                setEditingOrder(null);
                return;
            }
            if (canteenSuccess || dietSuccess) {
                return warningNofity("Partially cancelled. Please refresh");
            }
            return warningNofity("Cancel failed in both APIs");
        } catch (err) {
            console.error("Cancel Error:", err);

            warningNofity(
                err?.response?.data?.message || "Something went wrong. Try again."
            );
        }
    };


    // Funciton to cancel the Total Order 
    const handleCancelFullOrder = async (order) => {

        const PendingOrderItem = order?.items ?? [];

        const ExtraOrder = PendingOrderItem
            ?.filter(item => item.extra_order_id != null)
            ?.map(i => ({ extra_order_id: i.extra_order_id }));

        const order_id = PendingOrderItem?.find(item => item.order_id != null)?.order_id

        const canteen_order_id = order?.canteen_order_id;


        console.log({
            ExtraOrder,
            order_id,
            canteen_order_id
        });



        if (!canteen_order_id) {
            return warningNofity("Order Id is Missing Kindly Refresh!");
        }

        try {
            const canteenPayload = {
                status: 'CANCELLED',
                canteen_order_id: canteen_order_id,
                updated_by: id
            };


            const dietStatus = {
                order_status: 'CANCELLED',
                order_id: order_id,
                updated_by: id
            };


            const extraPayload = {
                status: 'CANCELLED',
                ExtraOrder,
                updated_by: id
            };


            // Step 1: update main order
            const mainRes = await axioslogin.patch("/canteenorder/status", canteenPayload);

            if (mainRes?.data?.success === 0) {
                return warningNofity(mainRes?.data?.message);
            }

            //  Step 2: parallel secondary updates
            const requests = [];

            if (selected?.party_name === 'PATIENT' && order_id != null) {
                requests.push(
                    axioslogin.patch("/fooddietorder/update-diet-status", dietStatus)
                );
            }

            if (selected?.party_name === 'PATIENT' && ExtraOrder.length > 0) {
                requests.push(
                    axioslogin.patch("/patientExtraOrder/status", extraPayload)
                );
            }

            const responses = await Promise.all(requests);

            for (const res of responses) {
                if (!res || res?.data?.success !== 1) {
                    errorNofity(res?.data?.message || "Update failed");
                }
            }
            succesNofity("Order Cancelled Successfully");
            await invalidateQueries();
            setEditingOrder(null);

        } catch (error) {
            console.error(error);
            errorNofity("Something went wrong while confirming order");
        }
    };

    return (
        <Box
            sx={{
                flex: 1,
                overflow: "hidden",
                px: 2,
                py: 2,
                bgcolor: "#f9f9fb",
                borderTopRightRadius: 16,
                borderTopLeftRadius: 16,
                position: "relative",
                borderBottomRightRadius: 16,
                borderBottomLeftRadius: 16,
                pb: 15
            }}
        >

            <Box
                sx={{
                    borderRadius: 16,
                    p: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 1,
                    borderRadius: 10
                }}>

                <StatBlock label="PENDING" value={statusCounts.PENDING} onClick={setSelectedStatus} />
                <StatBlock label="CONFIRMED" value={statusCounts.CONFIRMED} onClick={setSelectedStatus} />
                <StatBlock label="CANCELLED" value={statusCounts.CANCELLED} onClick={setSelectedStatus} />
            </Box>

            <Box
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    height: "100%",
                    "&::-webkit-scrollbar": {
                        display: "none",
                    },
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    mt: 1
                }} >

                {filteredOrders?.length === 0 ? (
                    <EmptyOrders
                        message="No Orders Found"
                        subMessage="There are no orders for this status"
                    />
                ) : (
                    displayOrders?.map((order) => (
                        <Box
                            key={order.canteen_order_id}
                            sx={{
                                bgcolor: "#ffffff",
                                borderRadius: 14,
                                p: 1.5,
                                mb: 2,
                                boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
                            }}
                        >

                            {/*  Order Header */}
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    mb: 1
                                }}
                            >
                                <Box>
                                    <TextComponent
                                        value={`Order ID: ${order?.canteen_order_id}`}
                                        size={12}
                                        weight={800}
                                    />
                                    <TextComponent
                                        value={`${order?.order_time}`}
                                        size={11}
                                        weight={500}
                                        color="#666"
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', gap: 0.5, cursor: "pointer" }}>
                                    <Typography
                                        level="body-sm"
                                        sx={{
                                            px: 1.5,
                                            py: 0.5,
                                            borderRadius: 20,
                                            fontWeight: 600,
                                            fontSize: 10,
                                            color:
                                                order.order_status === "PENDING"
                                                    ? "#ff9800"
                                                    : order.order_status === "CONFIRMED"
                                                        ? "#2196f3"
                                                        : "#100e0f",
                                            backgroundColor:
                                                order.order_status === "PENDING"
                                                    ? "#fff3e0"
                                                    : order.order_status === "CONFIRMED"
                                                        ? "#e3f2fd"
                                                        : "#ff9292",
                                        }}>
                                        {order?.order_status}
                                    </Typography>

                                    <EditToggleButton
                                        visible={order?.order_status === "PENDING"}
                                        isEditing={editingOrder === order}
                                        onEdit={() => setEditingOrder(order)}
                                        onCancel={() => setEditingOrder(null)}
                                    />
                                </Box>

                            </Box>

                            {/*  Foods */}

                            {(order?.items ?? [])?.map((item, index) => (
                                <OrderItemRow
                                    key={item?.item_id}
                                    item={item}
                                    index={index}
                                    selected={selected?.party_name}
                                    editingOrder={editingOrder}
                                    updateQuantity={updateQuantity}
                                    handleCancelItem={handleCancelItem}
                                    order={order}
                                    selectedStatus={selectedStatus}
                                />
                            ))}

                            {/*  ACTION BUTTONS */}
                            {editingOrder && (
                                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                                    <ActionButton
                                        icon={<NoMealsIcon sx={{ fontSize: 14 }} />}
                                        label="Cancel full Order"
                                        onClick={() => handleCancelFullOrder(order)}
                                    />

                                    <ActionButton
                                        icon={<RamenDiningIcon sx={{ fontSize: 14 }} />}
                                        label="Save Changes"
                                        onClick={handleSaveExtraQuantityChanges}
                                    />

                                </Box>
                            )}

                        </Box>
                    ))
                )}
            </Box>
        </Box >
    );
};

export default memo(PatientOrdersDashboard);

const StatBlock = ({ label, value, onClick }) => {
    // Updated gradient mapping for new statuses
    const bgColors = {
        PENDING: "linear-gradient(135deg, #FFD54F 0%, #FFB74D 100%)",
        CONFIRMED: "linear-gradient(135deg, #64B5F6 0%, #42A5F5 100%)",
        CANCELLED: "linear-gradient(135deg, #fc6868 0%, #9a1414 100%)",
    };

    const textColors = {
        PENDING: "#5D4037",
        CONFIRMED: "#0D47A1",
        CANCELLED: "#ffffff",
    };

    return (
        <Box
            onClick={() => onClick(label)}
            sx={{
                flex: 1,
                textAlign: "center",
                p: 1,
                borderRadius: 10,
                boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
                background: bgColors[label] || "#eee",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                transition: "transform 0.2s ease",
                "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                },
                cursor: 'pointer'

            }}
        >
            <TextComponent
                value={label}
                size={10}
                weight={700}
                color={textColors[label] || "#111"}
                style={{ marginBottom: 6 }}
            />
            <Box
                sx={{
                    px: 2,
                    py: 0.5,
                    borderRadius: 20,
                    backgroundColor: "rgba(255,255,255,0.7)",
                }}
            >
                <TextComponent value={value} size={18} weight={800} color="#000" />
            </Box>
        </Box>
    );
};



