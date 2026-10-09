import React, { memo, useCallback, useMemo, useState } from "react";
import { Box } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import TextComponent from "../../components/TextComponent";
import DeliveryStatusModal from "./DeliveryStatusModal";
import VisibilityIcon from '@mui/icons-material/Visibility';
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import PendingRoundedIcon from "@mui/icons-material/PendingRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import DeliveryDiningRoundedIcon from "@mui/icons-material/DeliveryDiningRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import { EmpauthId, errorNofity, infoNofity, succesNofity, warningNofity } from "../Constant/Constant";
import { axioslogin } from "../../Axios/axios";
import { useQueryClient } from "@tanstack/react-query";
import { Checkbox } from "@mui/material";
import KingBedIcon from '@mui/icons-material/KingBed';
import GroupIcon from "@mui/icons-material/Group";
import { useAllItemDeliveryStatus, useOrderItemDetail, usePatientExtraOrders } from "../../CommonData/UseQuery";
import InstantOrderItemList from "./DeliveryMarkingComponent/InstantOrderItemList";

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

const DeliveryPatientCardList = ({ filterdData = [],
    selectionMode,
    selectedItems,
    onToggleSelect,
}) => {


    const navigate = useNavigate();
    const id = EmpauthId();
    const queryClient = useQueryClient();
    const [openStatusModal, setOpenStatusModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [selectedOrder, setSelectedOrders] = useState({});
    const [packagedetail, setPackageDetails] = useState([])


    const handleCardClick = (item) => {


        if (selectionMode) {
            onToggleSelect(item);
            return;
        }

        navigate("/deliverydetail", {
            state: { patientData: item }
        });
    };



    // Handle Print Details

    const handlePrintDetails = useCallback(
        async (packets = []) => {

            if (!Array.isArray(packets) || packets.length === 0) {
                return;
            };

            const printData = packets.map(packet => ({
                packing_id: packet?.packing_id,
                packet_uid: packet?.packet_uid,

                meal_type: selectedOrder?.type_desc,
                order_id: selectedOrder?.canteen_order_id,
                admission_id: selectedOrder?.fb_ip_no,
                patient_no: selectedOrder?.fb_pt_no,
                patient_name: selectedOrder?.fb_ptc_name,

                bed_code: selectedOrder?.fb_bdc_no,
                nursing_station: selectedOrder?.fb_ns_name,
                party_name: selectedOrder?.party_name
            }));

            try {

                const { data } = await axioslogin.post(
                    "/dietdelivery/print-queue/create",
                    printData
                );

                if (data?.success === 1) {
                    succesNofity("Print queue created");
                    return;
                };

                warningNofity(data?.message || "Failed to create print queue");

            } catch (error) {
                console.error("Print queue API error:", error);
                errorNofity("Print queue API error:",);

                /*
                 * Duplicate packet UID
                 */
                if (error?.response?.status === 409) {
                    const duplicatePacketUids =
                        error?.response?.data
                            ?.duplicatePacketUids || [];
                    if (duplicatePacketUids.length > 0) {
                        const duplicateMessage =
                            duplicatePacketUids.join(", ");
                        infoNofity(`Print UID already exists: ${duplicateMessage}`)
                        return;
                    }
                };

                /*
                 * Other backend errors
                 */
                const message =
                    error?.response?.data?.message ||
                    error?.message ||
                    "Failed to create print queue";
                console.error(message)
            }
        },
        [selectedOrder]
    );



    const {
        data: OrderFoodDetails = [],
        // isLoading: isOrderLoading
    } = useOrderItemDetail(selectedOrder?.canteen_order_id);

    const {
        data: PatientExtraOrders = [],
        // isLoading: isExtraLoading
    } = usePatientExtraOrders(selectedOrder?.fb_ipad_slno, 'CONFIRMED');




    const {
        data: ItemDeliveryStatus = [],
        // isLoading: isStatusLoading
    } = useAllItemDeliveryStatus(selectedOrder?.canteen_order_id, selectedOrder?.type_slno);



    // correctly formating the extra order for the patient along with the diet and others
    const formattedExtraOrders = useMemo(() => {
        return (PatientExtraOrders || []).map(item => ({
            item_id: item.item_id,
            item_name: item.item_name,
            qty: Number(item.quantity ?? 0),
            price: Number(item.price ?? 0),
            description: item.description ?? "",
            gst: Number(item.gst ?? 0),
            gst_amount: Number(item.gst_amount ?? 0),

            isExtra: true,          // IDENTIFIER
            order_status: item.order_status,
            extra_order_id: item.extra_order_id
        }));
    }, [PatientExtraOrders]);

    // final ready to go Item Details
    const items = useMemo(() => {
        if (!selectedOrder?.canteen_order_id) return [];
        const canteenItems = (OrderFoodDetails || []).map(item => ({
            ...item,
            isExtra: false
        }));
        return canteenItems.map(canteenItem => {
            // EXTRA ORDER MATCH
            const matchedExtra = formattedExtraOrders.find(extra =>
                Number(extra.item_id) === Number(canteenItem.item_id) &&
                Number(extra.qty) === Number(canteenItem.quantity)
            );

            // DELIVERY STATUS MATCH
            const matchedDelivery = (ItemDeliveryStatus || []).find(delivery =>
                Number(delivery.item_id) === Number(canteenItem.item_id)
            );

            return {
                ...canteenItem,
                // EXTRA ORDER DATA
                isExtra: !!matchedExtra,
                extra_order_id:
                    matchedExtra?.extra_order_id || null,
                extra_order_status:
                    matchedExtra?.order_status || null,
                // DELIVERY DATA
                delivery_id:
                    matchedDelivery?.delivery_id || null,
                delivery_status:
                    matchedDelivery?.delivery_status || "PENDING",
                delivered_qty:
                    matchedDelivery?.delivered_qty || 0,
                delivered_time:
                    matchedDelivery?.delivered_time || null,
                delivery_remarks:
                    matchedDelivery?.delivery_remarks || null,
                updated_by:
                    matchedDelivery?.updated_by || null,
                updated_at:
                    matchedDelivery?.updated_at || null,
                updated_remarks:
                    matchedDelivery?.updated_remarks || null,
                develivered_by:
                    matchedDelivery?.develivered_by || null,
                UpdatedByEmployee:
                    matchedDelivery?.UpdatedByEmployee || null,


            };
        });

    }, [
        selectedOrder?.canteen_order_id,
        OrderFoodDetails,
        formattedExtraOrders,
        ItemDeliveryStatus
    ]);

    //Filtering Based on the Meal type for only corresponding food items
    const FinalFilteredData = useMemo(() => {
        const data = (items || [])?.map(item => {

            let source_type = "CANTEEN_ORDER";
            let source_id = item.canteen_order_item_id;

            // Patient with active diet plan
            if (Number(selectedOrder?.party_type_id) === 2 && selectedOrder?.dietPlanId) {

                if (item.isExtra) {
                    source_type = "PATIENT_EXTRA_ORDER";
                    source_id = item.extra_order_id;
                } else {
                    source_type = "DIET_ORDER";
                    source_id = null;
                }
            }

            return {
                ...item,
                source_type,
                source_id,

            };
        });

        return selectedOrder?.type_slno
            ? data.filter(val => Number(val.type_slno) === Number(selectedOrder?.type_slno))
            : data;

    }, [
        items,
        selectedOrder?.type_slno,
        selectedOrder?.dietPlanId,
        selectedOrder?.party_type_id,
    ]);


    const getOrderPackingByAssignment = async (assignment_detail_id) => {
        const { data } = await axioslogin.post(
            "/dietdelivery/package/get-by-assignment",
            {
                assignment_detail_id
            }
        );

        return data;
    };


    const handleInstantItemView = useCallback(async (item) => {

        const assignmentDetailId = item?.assignment_detail_id;

        if (!assignmentDetailId) {
            return;
        }
        // Close if already expanded
        if (expandedOrderId === assignmentDetailId) {
            setExpandedOrderId(null);
            setSelectedOrders({});
            return;
        }
        try {
            const response = await getOrderPackingByAssignment(
                assignmentDetailId
            );

            const { success, message, data } = response ?? {};
            if (success === 0) return warningNofity(message)
            if (success === 1) {
                setExpandedOrderId(assignmentDetailId);
                setSelectedOrders(item)
                setPackageDetails(data)
            } else {
                setExpandedOrderId(assignmentDetailId);
                setSelectedOrders(item)
                setPackageDetails([])
            }

        } catch (error) {
            console.error("Error fetching packing details:", error);
            errorNofity(error?.message || "Error in Fetching Packing Details!")
            setExpandedOrderId(assignmentDetailId);
            setSelectedOrders(item)
            setPackageDetails([])
        }
    }, [expandedOrderId]);

    const handleViewClick = (e, item) => {
        e.stopPropagation();
        navigate("/deliverydetail", {
            state: {
                patientData: item
            }
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
            assignment_detail_id: selectedItem?.assignment_detail_id,
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

                    const isSelected = selectedItems?.some(
                        x =>
                            x.canteen_order_id === item.canteen_order_id &&
                            x.type_slno === item.type_slno
                    );
                    const isBystander = item?.party_name?.toUpperCase() === "BYSTANDER";


                    return (
                        <Box
                            key={index}

                            sx={{
                                position: "relative",
                                width: "100%",
                                mb: 1.5,
                                cursor: "pointer",
                                borderRadius: "18px",
                                overflow: "hidden",
                                bgcolor: isSelected ? "#f3ecfe" : "#fff",
                                border: isSelected
                                    ? "1px solid #7933ea"
                                    : `1px solid ${status.border}`,
                                boxShadow: isSelected
                                    ? "0 0 0 3px rgba(25,118,210,.12)"
                                    : "0 6px 20px rgba(0,0,0,.06)",
                                transition: "all .25s ease",
                                // "&:hover": {
                                //     transform: "translateY(-3px)"
                                // }
                            }}
                        >
                            {selectionMode && item.ItemStatus === "PENDING" && (
                                <Box
                                    onClick={() => handleCardClick(item)}
                                    sx={{
                                        position: "absolute",
                                        top: 12,
                                        left: 12,
                                        width: 16,
                                        height: 16,
                                        borderRadius: "50%",
                                        bgcolor: isSelected ? "#7933ead4" : "#fff",
                                        border: "2px solid #7933ea",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#fff",
                                        fontSize: 13,
                                        fontWeight: 800,
                                        zIndex: 20
                                    }}
                                >
                                    {isSelected && "✓"}
                                </Box>
                            )}

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    p: 1.5,
                                    pl: selectionMode ? 5 : 0,
                                    borderBottom: "1px solid #f3f3f3"
                                }}
                            >
                                <Box sx={{ display: "flex", gap: 1 }}>
                                    <Box>
                                        <Box sx={{
                                            display: 'flex',
                                            gap: 1
                                        }}>
                                            {
                                                isBystander &&

                                                <GroupIcon sx={{
                                                    fontSize: 16,
                                                    color: '#300d7c'
                                                }} />
                                            }
                                            <TextComponent
                                                value={item?.fb_ptc_name}
                                                size={14}
                                                weight={800}
                                            />


                                        </Box>
                                        <TextComponent
                                            value={item?.fb_ns_name}
                                            size={8}
                                            weight={700}
                                            color="#444"
                                        />
                                    </Box>
                                </Box>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}>

                                    <Box
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleStatusClick(e, item);
                                        }}
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
                                            cursor: "pointer",
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
                                    {
                                        selectionMode &&
                                        <Box
                                            onClick={(e) => handleViewClick(e, item)}
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
                                                cursor: "pointer",
                                            }}
                                        >
                                            <VisibilityIcon sx={{
                                                fontSize: 14
                                            }} />
                                            <TextComponent
                                                value={"View"}
                                                size={8}
                                                weight={800}
                                                color={status.color}
                                            />
                                        </Box>
                                    }
                                </Box>
                            </Box>

                            <Box
                                onClick={() => handleInstantItemView(item)}
                                sx={{
                                    p: 1.5,
                                    display: "flex",
                                    justifyContent: "space-between"
                                }}
                            >
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5
                                }}>
                                    <KingBedIcon sx={{
                                        color: status.color,
                                        fontSize: 19
                                    }} />
                                    <TextComponent
                                        value={item?.fb_bdc_no}
                                        size={14}
                                        weight={900}
                                        color={status.color}
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

                            {expandedOrderId === item?.assignment_detail_id && (
                                <Box
                                    sx={{
                                        px: 1.5,
                                        pb: 1.5,
                                        borderTop: "1px solid #f0f0f0",
                                        bgcolor: "#fafafa",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            py: 1,
                                        }}
                                    >
                                        <TextComponent
                                            value="ORDER ITEMS"
                                            size={9}
                                            weight={900}
                                            color="#666"
                                        />

                                        <TextComponent
                                            value={`${FinalFilteredData?.length || 0} Items`}
                                            size={8}
                                            weight={700}
                                            color="#888"
                                        />
                                    </Box>

                                    <InstantOrderItemList
                                        items={FinalFilteredData}
                                        orderId={selectedOrder?.canteen_order_id}
                                        AssignmentId={selectedOrder?.assignment_detail_id}
                                        TypeSlno={selectedOrder?.type_slno}
                                        PackageDetails={packagedetail}
                                        setExpandedOrderId={setExpandedOrderId}
                                        handlePrintDetails={handlePrintDetails}
                                        onPacketsChange={(packets) => {
                                            console.log("PACKETS:", packets);
                                        }}
                                    />
                                </Box>
                            )}

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