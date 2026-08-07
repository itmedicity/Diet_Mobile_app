import { Box } from "@mui/joy";
import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import NursingStaionHeader from "../NursingStation/NursingStaionHeader";
import DeliveryFoodItemCard from "./DeliveryFoodItemCard";
import TextComponent from "../../components/TextComponent";
import { useAllAssignedItemStatus, useAllItemDeliveryStatus, useOrderItemDetail, usePatientExtraOrders } from "../../CommonData/UseQuery";
import PickupConfirmationModal from "./PickupConfirmationModal";
import { EmpauthId, infoNofity, succesNofity, warningNofity } from "../Constant/Constant";
import { axioslogin } from "../../Axios/axios";
import FloatingPickupButton from "./FloatingPickupButton";
import { useQueryClient } from "@tanstack/react-query";
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import MissingOrderItemCard from "./MissingOrderItemCard";
import ActionCardButton from "./DeliveryMarkingComponent/ActionCardButton";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";


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
        fb_ip_no,
        type_slno,
        type_desc,
        fb_bdc_no,
        assignment_id,
        ItemStatus
    } = patientData ?? {};



    const queryClient = useQueryClient();
    const [openPickupModal, setOpenPickupModal] = useState(false);
    const [loading, setLoading] = useState(false)
    const [billingdetail, setBillDetails] = useState([]);
    const [openbillingdialog, setOpenBillDialog] = useState(false);

    const hasShownModal = useRef(false);




    const {
        data: ItemDetailStatus = [],
        isLoading: isDetailLoading
    } = useAllAssignedItemStatus(id, assignment_id);

    const {
        data: ItemDeliveryStatus = [],
        isLoading: isStatusLoading
    } = useAllItemDeliveryStatus(canteen_order_id, type_slno);



    const CurrentOrderStatus = ItemDetailStatus?.find(
        i => i.type_slno === type_slno &&
            i.fb_ip_no === String(fb_ip_no));


    const deliveryStatus =
        CurrentOrderStatus?.ItemStatus || "PENDING";


    const dietPlanId =
        CurrentOrderStatus?.plan_id || null;


    const {
        data: OrderFoodDetails = [],
        refetch: FetchPatientFoodOrderDetails,
        isLoading: isOrderLoading
    } = useOrderItemDetail(canteen_order_id);

    const {
        data: PatientExtraOrders = [],
        refetch: FetcthPatienExtraOrders,
        isLoading: isExtraLoading
    } = usePatientExtraOrders(fb_ipad_slno, 'CONFIRMED');


    const isPageLoading =
        isOrderLoading ||
        isExtraLoading || isStatusLoading || isDetailLoading;

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


    const FinalFilteredData = useMemo(() => {

        const data = (items || []).map(item => {

            let source_type = "CANTEEN_ORDER";
            let source_id = item.canteen_order_item_id;

            // Patient with active diet plan
            if (Number(patientData?.party_type_id) === 2 && dietPlanId) {

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
                source_id
            };
        });

        return type_slno
            ? data.filter(val => Number(val.type_slno) === Number(type_slno))
            : data;

    }, [
        items,
        type_slno,
        dietPlanId,
        patientData?.party_type_id
    ]);



    // useEffect(() => {
    //     const hasItems = FinalFilteredData?.length > 0;

    //     if (isPageLoading) return;  // ← wait for data to fully load

    //     if (deliveryStatus === "PENDING" && hasItems && !hasShownModal.current) {
    //         hasShownModal.current = true;
    //         setOpenPickupModal(true);
    //     }
    // }, [deliveryStatus, FinalFilteredData, isPageLoading]);



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
            patient_diet_id: dietPlanId,
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


    const hasDeliveredItems = FinalFilteredData?.some(
        (food) => food?.delivery_status === "DELIVERED"
    );


    const DeliveredItemDetail = useMemo(() => {
        return FinalFilteredData?.filter((item) => item?.delivery_status === "DELIVERED")
    }, [FinalFilteredData]);

    const handleViewBill = useCallback(async () => {
        const payload = DeliveredItemDetail.map(item => ({
            delivery_id: item.delivery_id,
            patient_diet_id: item.patient_diet_id, // plan_id
            type_slno: item.type_slno,
            source_type: item.source_type
        }));

        try {
            setLoading(true)
            const response = await axioslogin.post(
                "/dietdelivery/get-bill-details",
                payload
            );
            const { data, success, message } = response?.data ?? {}
            if (success === 2) return infoNofity("No Billing Detail Fond");
            if (success !== 1) return warningNofity("Error in Getting Bill Details");
            setBillDetails(data);
            setOpenBillDialog(true);

        } catch (error) {
            console.error(error);
            warningNofity("Unable to fetch bill details");
        } finally {
            setLoading(false)
        }
    }, [DeliveredItemDetail]);

    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                // bgcolor: "#fff",
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

                        FinalFilteredData?.map((food) => (
                            <DeliveryFoodItemCard
                                key={`${food.item_id}-${food.type_slno}-${food.quantity}`}
                                item={food}
                                patientData={patientData}
                                deliveryStatus={deliveryStatus}
                                dietPlanId={dietPlanId}
                            />
                        ))

                    ) : (

                        <MissingOrderItemCard />

                    )
                }
            </Box>
            {hasDeliveredItems && (
                <ActionCardButton
                    loading={loading}
                    expand={openbillingdialog}
                    billdetail={billingdetail}
                    patientData={patientData}
                    floating
                    title="Bill Details"
                    subtitle="View charges for delivered items"
                    buttonText="View"
                    icon={ReceiptLongRoundedIcon}
                    onClick={handleViewBill}
                    setOpenBillDialog={setOpenBillDialog}
                />
            )}
        </Box>
    );
};

export default DeliveryMarkingContainer;