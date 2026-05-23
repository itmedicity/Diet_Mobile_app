import { Box } from "@mui/joy";
import React, { useEffect, useMemo, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import NursingStaionHeader from "../NursingStation/NursingStaionHeader";
import DeliveryFoodItemCard from "./DeliveryFoodItemCard";
import TextComponent from "../../components/TextComponent";
import { useAllAssignedItemStatus, useAllItemDeliveryStatus, useOrderItemDetail, usePatientExtraOrders } from "../../CommonData/UseQuery";
import PickupConfirmationModal from "./PickupConfirmationModal";
import { EmpauthId, succesNofity, warningNofity } from "../Constant/Constant";
import { axioslogin } from "../../Axios/axios";
import FloatingPickupButton from "./FloatingPickupButton";
import { useQueryClient } from "@tanstack/react-query";
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import MissingOrderItemCard from "./MissingOrderItemCard";

const DeliveryMarkingContainer = () => {

    const location = useLocation();

    const { patientData } = location.state || {};

    const id = EmpauthId();

    const {
        fb_ns_name,
        nurse_station_name,
        orders,
        canteen_order_id,
        fb_ipad_slno,
        type_slno,
        type_desc,
        fb_bdc_no,
        assignment_id,
        ItemStatus
    } = patientData ?? {};



    const [openPickupModal, setOpenPickupModal] = useState(false);

    const {
        data: ItemDetailStatus = [],
    } = useAllAssignedItemStatus(id, assignment_id);

    const {
        data: ItemDeliveryStatus = [],
    } = useAllItemDeliveryStatus(canteen_order_id, type_slno);

    const CurrentOrderStatus = ItemDetailStatus?.find(i => i.type_slno === type_slno)

    const deliveryStatus =
        CurrentOrderStatus?.ItemStatus || "PENDING";

    const queryClient = useQueryClient();

    const {
        data: OrderFoodDetails = [],
        refetch: FetchPatientFoodOrderDetails,
        isLoading: isOrderLoading
    } = useOrderItemDetail(canteen_order_id);

    const {
        data: PatientExtraOrders = [],
        refetch: FetcthPatienExtraOrders,
        isLoading: isExtraLoading
    } = usePatientExtraOrders(fb_ipad_slno, 'COMPLETED');

    const isPageLoading =
        isOrderLoading ||
        isExtraLoading;

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


    const items = useMemo(() => {
        if (!canteen_order_id) return [];
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
                    matchedDelivery?.UpdatedByEmployee || null
            };
        });

    }, [
        canteen_order_id,
        OrderFoodDetails,
        formattedExtraOrders,
        ItemDeliveryStatus
    ]);

    const FinalFilteredData = items &&
        type_slno ? (items || [])?.filter(val => Number(val.type_slno) === Number(type_slno))
        : items;


    useEffect(() => {
        const hasItems =
            FinalFilteredData?.length > 0;
        if (
            deliveryStatus === "PENDING" &&
            hasItems
        ) {
            setOpenPickupModal(true);
        }
    }, []);

    const playPickupSound = () => {
        const audio = new Audio("/pickupnofication.mp3");
        audio.volume = 1;
        audio.play().catch((err) => {
            console.log("Audio play blocked:", err);
        });
    };


    const handleConfirmPickup = async () => {
        const payload = {
            assignment_id: patientData?.assignment_id,
            canteen_order_id: patientData?.canteen_order_id,
            type_slno: type_slno,
            delivery_status: "PICKEDUP",
            remarks: "Order picked up from kitchen",
            updated_by: Number(id),
            item: FinalFilteredData,
            item_name: canteen_order_id,
            meal: type_desc,
        };
        try {
            const result = await axioslogin.post(
                "/dietdelivery/update-delivery-status",
                payload
            );
            const { success, message } = result.data || {};
            if (success === 0) {
                return warningNofity(message);
            }
            succesNofity(message);
            FetchPatientFoodOrderDetails()
            FetcthPatienExtraOrders()
            playPickupSound();
            await queryClient.invalidateQueries([
                "assigneditem",
                id
            ]);
            setOpenPickupModal(false);
            // setDeliveryStatus("PICKEDUP");
        } catch (error) {
            console.log(error);
            warningNofity("Something went wrong");
        }
    };

    const handleCloseModal = () => {
        setOpenPickupModal(false);
    };

    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                bgcolor: "#fff",
            }}
        >
            <NursingStaionHeader
                stationname={fb_ns_name}
                bed={fb_bdc_no}
            />

            {
                deliveryStatus === "PENDING" && FinalFilteredData?.length > 0 && (
                    <FloatingPickupButton
                        count={FinalFilteredData?.length || 0}
                        onClick={() => setOpenPickupModal(true)}
                    />
                )
            }

            <PickupConfirmationModal
                open={openPickupModal}
                onClose={handleCloseModal}
                onConfirm={handleConfirmPickup}
                patientData={patientData}
            />
            <Box
                sx={{
                    flex: 1,
                    px: 2,
                    overflowY: "auto",
                    pb: "120px",
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column'
                }}
            >

                {
                    isPageLoading ? (

                        <Box
                            sx={{
                                flex: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "100%"
                            }}
                        >
                            <TextComponent
                                value="Loading items..."
                                size={18}
                                weight={600}
                                color="#666"
                            />
                        </Box>

                    ) : FinalFilteredData?.length > 0 ? (

                        FinalFilteredData.map((food) => (
                            <DeliveryFoodItemCard
                                key={`${food.item_id}-${food.type_slno}-${food.quantity}`}
                                item={food}
                                patientData={patientData}
                                deliveryStatus={deliveryStatus}
                            />
                        ))

                    ) : (

                        <MissingOrderItemCard />

                    )
                }
            </Box>
        </Box>
    );
};

export default DeliveryMarkingContainer;