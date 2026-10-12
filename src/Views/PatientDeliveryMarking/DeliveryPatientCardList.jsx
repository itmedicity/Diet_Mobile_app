import React, { memo, useCallback, useMemo, useState } from "react";
import { Box } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import DeliveryStatusModal from "./DeliveryStatusModal";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import KingBedIcon from "@mui/icons-material/KingBed";
import GroupIcon from "@mui/icons-material/Group";
import { EmpauthId, errorNofity, infoNofity, succesNofity, warningNofity } from "../Constant/Constant";
import { axioslogin } from "../../Axios/axios";
import { useQueryClient } from "@tanstack/react-query";
import { useAllItemDeliveryStatus, useOrderItemDetail, usePatientExtraOrders } from "../../CommonData/UseQuery";
import InstantOrderItemList from "./DeliveryMarkingComponent/InstantOrderItemList";
import { COLORS, FONT, focusRing } from "../../Style/designTokens";
import { statusOf } from "../../CommonData/deliveryStatus";

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

        // a pending order has nothing to change yet
        if (!item?.ItemStatus || item.ItemStatus === "PENDING") return;

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
            console.error(error);
            errorNofity("Something went wrong");
        }
    };




    return (
        <>
            <Box component="ul" sx={{ listStyle: "none", m: 0, px: 2, py: 0, fontFamily: FONT }}>
                {filterdData?.map((item) => {
                    const status = statusOf(item?.ItemStatus);

                    const isSelected = selectedItems?.some(
                        x =>
                            x.canteen_order_id === item.canteen_order_id &&
                            x.type_slno === item.type_slno
                    );
                    const isBystander = item?.party_name?.toUpperCase() === "BYSTANDER";
                    const canPick = selectionMode && item.ItemStatus === "PENDING";
                    const isOpen = expandedOrderId === item?.assignment_detail_id;

                    return (
                        <Box
                            component="li"
                            key={`${item?.assignment_detail_id}-${item?.canteen_order_id}-${item?.type_slno}`}
                            sx={{
                                mb: 1.5, borderRadius: "16px", overflow: "hidden", bgcolor: COLORS.white,
                                border: `${isSelected ? 2 : 1}px solid ${isSelected ? COLORS.plum : COLORS.line}`,
                            }}
                        >
                            {/* who: tick box, name, station */}
                            <Box sx={{ display: "flex", alignItems: "stretch" }}>
                                {canPick && (
                                    <Box
                                        component="button"
                                        type="button"
                                        role="checkbox"
                                        aria-checked={!!isSelected}
                                        aria-label={`Select ${item?.fb_ptc_name}`}
                                        onClick={() => handleCardClick(item)}
                                        sx={{
                                            flexShrink: 0, width: 56, border: 0, bgcolor: "transparent", cursor: "pointer",
                                            display: "grid", placeItems: "center", ...focusRing,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 28, height: 28, borderRadius: "8px", display: "grid", placeItems: "center",
                                                bgcolor: isSelected ? COLORS.plum : COLORS.white,
                                                border: `2px solid ${COLORS.plum}`, color: COLORS.white,
                                            }}
                                        >
                                            {isSelected && <CheckRoundedIcon sx={{ fontSize: 20 }} />}
                                        </Box>
                                    </Box>
                                )}

                                <Box sx={{ flex: 1, minWidth: 0, py: 1.5, pl: canPick ? 0 : 2, pr: 1.5 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                                        {isBystander && <GroupIcon aria-label="Bystander" sx={{ fontSize: 18, color: COLORS.plum }} />}
                                        <Box sx={{ fontSize: 17, fontWeight: 700, color: COLORS.ink, lineHeight: 1.25, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                                            {item?.fb_ptc_name}
                                        </Box>
                                    </Box>
                                    <Box sx={{ mt: 0.25, fontSize: 14, color: COLORS.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {item?.fb_ns_name}
                                    </Box>
                                </Box>

                                <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 0.75, pr: 1.5 }}>
                                    {/* status: opens the change-status sheet (not for Pending) */}
                                    <Box
                                        component="button"
                                        type="button"
                                        onClick={(e) => handleStatusClick(e, item)}
                                        disabled={item?.ItemStatus === "PENDING" || !item?.ItemStatus}
                                        aria-label={`Status ${status.label}. Change status`}
                                        sx={{
                                            minHeight: 36, px: 1.5, borderRadius: "999px", fontFamily: FONT, fontSize: 14, fontWeight: 700,
                                            bgcolor: status.tint, color: status.color, border: `1.5px solid ${status.line}`,
                                            cursor: "pointer", "&:disabled": { cursor: "default" }, ...focusRing,
                                        }}
                                    >
                                        {status.label}
                                    </Box>

                                    {selectionMode && (
                                        <Box
                                            component="button"
                                            type="button"
                                            aria-label={`View details of ${item?.fb_ptc_name}`}
                                            onClick={(e) => handleViewClick(e, item)}
                                            sx={{
                                                width: 44, height: 44, border: 0, borderRadius: "50%", cursor: "pointer",
                                                display: "grid", placeItems: "center", bgcolor: COLORS.wash, color: COLORS.plum, ...focusRing,
                                            }}
                                        >
                                            <VisibilityIcon sx={{ fontSize: 22 }} />
                                        </Box>
                                    )}
                                </Box>
                            </Box>

                            {/* where and which meal; tap to show the items */}
                            <Box
                                component="button"
                                type="button"
                                aria-expanded={isOpen}
                                onClick={() => handleInstantItemView(item)}
                                sx={{
                                    width: "100%", minHeight: 52, px: 2, border: 0, borderTop: `1px solid ${COLORS.line}`,
                                    bgcolor: COLORS.surface, cursor: "pointer", fontFamily: FONT,
                                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1,
                                    "&:active": { bgcolor: COLORS.wash }, ...focusRing,
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, color: COLORS.ink }}>
                                    <KingBedIcon aria-hidden="true" sx={{ fontSize: 22, color: COLORS.plum }} />
                                    <Box component="span" sx={{ fontSize: 18, fontWeight: 700 }}>{item?.fb_bdc_no}</Box>
                                    <Box component="span" sx={{ fontSize: 15, color: COLORS.muted }}>{`·  ${item?.type_desc || ""}`}</Box>
                                </Box>
                                <ExpandMoreRoundedIcon
                                    aria-hidden="true"
                                    sx={{ color: COLORS.muted, transform: isOpen ? "rotate(180deg)" : "none" }}
                                />
                            </Box>

                            {isOpen && (
                                <Box sx={{ px: 1.5, pb: 1.5, borderTop: `1px solid ${COLORS.line}`, bgcolor: COLORS.surface }}>
                                    <Box sx={{ py: 1.25, fontSize: 15, fontWeight: 700, color: COLORS.muted }}>
                                        {`Order items (${FinalFilteredData?.length || 0})`}
                                    </Box>

                                    <InstantOrderItemList
                                        items={FinalFilteredData}
                                        orderId={selectedOrder?.canteen_order_id}
                                        AssignmentId={selectedOrder?.assignment_detail_id}
                                        TypeSlno={selectedOrder?.type_slno}
                                        PackageDetails={packagedetail}
                                        setExpandedOrderId={setExpandedOrderId}
                                        handlePrintDetails={handlePrintDetails}
                                    />
                                </Box>
                            )}

                        </Box>
                    );
                })}
            </Box>

            {/* STATUS SHEET */}
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
