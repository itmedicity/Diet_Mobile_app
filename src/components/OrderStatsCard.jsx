import React, { memo, useMemo, useState } from "react";
import { Box } from "@mui/joy";
import { groupPreviousOrder } from "../CommonData/Common";
import EmptyOrders from "../Views/NursingStation/Component/EmptyOrders";
import { EmpauthId, errorNofity, succesNofity, warningNofity } from "../Views/Constant/Constant";
import { axioslogin } from "../Axios/axios";
import ActionButton from "./ActionButton";
import { useQueryClient } from "@tanstack/react-query";
import { usePatientExtraOrders } from "../CommonData/UseQuery";
import OrderItemRow from "../Views/PatientOrderDetail/PatientOrderDetailComponents/OrderItemRow";
import EditToggleButton from "../Views/PatientOrderDetail/PatientOrderDetailComponents/EditToggleButton";
import { COLORS, FONT, focusRing } from "../Style/designTokens";

// status -> label shown on the tab and the order badge
const STATUS_LABEL = { PENDING: "Pending", CONFIRMED: "Confirmed", CANCELLED: "Cancelled" };

const STATUS_BADGE = {
    PENDING: { bg: "#FFF3D6", fg: "#7A4B00" },
    CONFIRMED: { bg: "#DDF0E4", fg: "#1F5E3A" },
    CANCELLED: { bg: "#F7DEDA", fg: "#8E1F16" },
};

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

    // the status being shown: the tapped tab, else pending, else confirmed, else cancelled
    const activeStatus = selectedStatus || (
        statusCounts.PENDING > 0
            ? "PENDING"
            : statusCounts.CONFIRMED > 0
                ? "CONFIRMED"
                : "CANCELLED"
    );

    const filteredOrders = useMemo(() => {
        if (!orders?.length) return [];
        return orders?.filter(o => o?.order_status === activeStatus);
    }, [orders, activeStatus]);

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

            // removing an item cannot be undone from the app
            if (!window.confirm(`Remove ${item.item_name || "this item"} from the order?`)) return;

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
                succesNofity(canteenRes?.data?.message || "cancelled SuccessFully");
                await invalidateQueries();
                setEditingOrder(null);
                return
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



        if (!canteen_order_id) {
            return warningNofity("Order Id is Missing Kindly Refresh!");
        }

        // cancelling a whole order cannot be undone from the app
        if (!window.confirm(`Cancel the whole order ${canteen_order_id}?`)) return;

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

            if (mainRes?.data?.success !== 1) {
                return warningNofity(mainRes?.data?.message || "Unable to cancel the order");
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

            // allSettled: one failing request must not hide the result of the others
            const settled = await Promise.allSettled(requests);

            let failed = 0;
            for (const result of settled) {
                const res = result.status === "fulfilled" ? result.value : null;
                if (!res || res?.data?.success !== 1) {
                    failed += 1;
                    errorNofity(
                        res?.data?.message ||
                        result?.reason?.response?.data?.message ||
                        "Update failed"
                    );
                }
            }

            // The main order is already cancelled at this point, so always refresh the lists.
            // Only claim success when every part was cancelled (it used to say "Cancelled
            // Successfully" right after reporting a failure).
            if (failed === 0) {
                succesNofity("Order Cancelled Successfully");
            } else {
                warningNofity(
                    "The order was cancelled, but part of it could not be updated. Please inform the supervisor"
                );
            }
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
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
                fontFamily: FONT,
            }}
        >

            {/* Which status to show */}
            <Box
                role="tablist"
                aria-label="Order status"
                sx={{ display: "flex", gap: 0.75, px: 2.5, pt: 2, pb: 1.5 }}
            >
                {Object.keys(STATUS_LABEL).map((status) => (
                    <StatusTab
                        key={status}
                        label={STATUS_LABEL[status]}
                        count={statusCounts[status]}
                        active={status === activeStatus}
                        onClick={() => {
                            setEditingOrder(null);
                            setSelectedStatus(status);
                        }}
                    />
                ))}
            </Box>

            <Box
                sx={{
                    flex: 1,
                    minHeight: 0,
                    overflowY: "auto",
                    px: 2.5,
                    pb: "calc(24px + env(safe-area-inset-bottom))",
                    "&::-webkit-scrollbar": { display: "none" },
                    scrollbarWidth: "none",
                }} >

                {filteredOrders?.length === 0 ? (
                    <EmptyOrders
                        message="No orders here"
                        subMessage={`There are no ${STATUS_LABEL[activeStatus].toLowerCase()} orders for this patient.`}
                    />
                ) : (
                    displayOrders?.map((order) => (
                        <Box
                            key={order.canteen_order_id}
                            sx={{
                                p: 1.5,
                                mb: 2,
                                borderRadius: "16px",
                                bgcolor: COLORS.surface,
                                border: `1px solid ${COLORS.line}`,
                            }}
                        >

                            {/*  Order Header */}
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    gap: 1,
                                    mb: 1
                                }}
                            >
                                <Box sx={{ minWidth: 0 }}>
                                    <Box sx={{ fontSize: 16, fontWeight: 700, color: COLORS.ink }}>
                                        {`Order ${order?.canteen_order_id}`}
                                    </Box>
                                    <Box sx={{ fontSize: 14, color: COLORS.muted }}>
                                        {order?.order_time}
                                    </Box>
                                    <Box
                                        component="span"
                                        sx={{
                                            display: "inline-block", mt: 0.75, px: 1, py: 0.25, borderRadius: "8px",
                                            fontSize: 13, fontWeight: 700,
                                            bgcolor: STATUS_BADGE[order.order_status]?.bg || COLORS.wash,
                                            color: STATUS_BADGE[order.order_status]?.fg || COLORS.ink,
                                        }}
                                    >
                                        {STATUS_LABEL[order.order_status] || order?.order_status}
                                    </Box>
                                </Box>

                                <EditToggleButton
                                    visible={order?.order_status === "PENDING"}
                                    isEditing={editingOrder === order}
                                    onEdit={() => setEditingOrder(order)}
                                    onCancel={() => setEditingOrder(null)}
                                />
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
                                <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                                    <ActionButton
                                        danger
                                        label="Cancel order"
                                        onClick={() => handleCancelFullOrder(order)}
                                    />

                                    <ActionButton
                                        primary
                                        label="Save changes"
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

const StatusTab = ({ label, count, active, onClick }) => (
    <Box
        component="button"
        type="button"
        role="tab"
        aria-selected={active}
        onClick={onClick}
        sx={{
            flex: 1, minHeight: 56, px: 0.5, borderRadius: "12px", cursor: "pointer", fontFamily: FONT,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            border: `1.5px solid ${active ? COLORS.plum : COLORS.line}`,
            bgcolor: active ? COLORS.plum : COLORS.white,
            color: active ? COLORS.white : COLORS.ink,
            ...focusRing,
        }}
    >
        <Box sx={{ fontSize: 20, fontWeight: 700, lineHeight: 1.1 }}>{count}</Box>
        <Box sx={{ fontSize: 13, fontWeight: 600 }}>{label}</Box>
    </Box>
);
