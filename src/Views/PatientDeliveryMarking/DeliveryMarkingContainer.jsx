import { Box } from "@mui/joy";
import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import NursingStaionHeader from "../NursingStation/NursingStaionHeader";
import DeliveryFoodItemCard from "./DeliveryFoodItemCard";
import TextComponent from "../../components/TextComponent";
import { useAllAssignedItemStatus, useAllItemDeliveryStatus, useBystanderBillingDetails, useDeliveryBillDetails, useOrderItemDetail, usePatientExtraOrders } from "../../CommonData/UseQuery";
import PickupConfirmationModal from "./PickupConfirmationModal";
import { EmpauthId, infoNofity, succesNofity, warningNofity } from "../Constant/Constant";
import { axioslogin } from "../../Axios/axios";
import FloatingPickupButton from "./FloatingPickupButton";
import { useQueryClient } from "@tanstack/react-query";
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import MissingOrderItemCard from "./MissingOrderItemCard";
import ActionCardButton from "./DeliveryMarkingComponent/ActionCardButton";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import { format } from "date-fns";


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
        ItemStatus,
        assignment_detail_id
    } = patientData ?? {};




    const queryClient = useQueryClient();
    const [openPickupModal, setOpenPickupModal] = useState(false);
    const [loading, setLoading] = useState(false)
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


    // Getting Orginal Bystander Billing Details
    const {
        data: BystanderBillingDetails = {
            bills: [],
            bill_items: []
        },
        // isLoading: isBillingLoading,
        refetch: refetchBystanderBilling
    } = useBystanderBillingDetails(
        assignment_detail_id
    );

    //Bill and it Item Details
    const bills = BystanderBillingDetails?.bills || [];
    const billItems = BystanderBillingDetails?.bill_items || [];


    // complete page loading 
    const isPageLoading =
        isOrderLoading ||
        isExtraLoading || isStatusLoading || isDetailLoading;


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

    //Filtering Based on the Meal type for only corresponding food items
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


            /*
        ============================================
        CHECK WHETHER THIS ITEM IS ALREADY BILLED
        ============================================
        */

            const matchedBillItem = billItems?.find(
                (billItem) =>
                    Number(billItem?.delivery_id) === Number(item?.delivery_id)
            );

            const ItemBillStatus = matchedBillItem?.bill_item_status || null;

            const isBilled = !!matchedBillItem;



            return {
                ...item,
                source_type,
                source_id,
                // BILLING STATUS
                isBilled,
                ItemBillStatus
            };
        });

        return type_slno
            ? data.filter(val => Number(val.type_slno) === Number(type_slno))
            : data;

    }, [
        items,
        type_slno,
        dietPlanId,
        patientData?.party_type_id,
        billItems
    ]);

    //Getting only the Dlevierd Items
    const DeliveredItemDetail = useMemo(() => {
        return FinalFilteredData?.filter((item) => item?.delivery_status === "DELIVERED")
    }, [FinalFilteredData]);

    //Query to fetch the billing detail items fromt he ledger 
    const {
        data: FetchedBillDetail = [],
        isLoading: isBillingDetailLoading,
        refetch: refetchBillingDetails
    } = useDeliveryBillDetails(
        DeliveredItemDetail
    );

    //Pending not Billed item for generating New Bill if Needed
    const PendingBillDetails = useMemo(
        () =>
            Array.isArray(FetchedBillDetail)
                ? FetchedBillDetail?.filter(
                    item => item?.ledger_status === "PENDING"
                )
                : [],
        [FetchedBillDetail]);

    // Funciton genering the Pick Up sound
    const playPickupSound = () => {
        const audio = new Audio("/pickupnofication.mp3");
        audio.volume = 1;
        audio.play().catch((err) => {
            console.log("Audio play blocked:", err);
        });
    };


    // Picking up Function for the Manuial Inside Pickup modal
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

    // checking the Delivered Item Details
    const hasDeliveredItems = FinalFilteredData?.some(
        (food) => food?.delivery_status === "DELIVERED"
    );


    // Generating the Bill Details for the Order
    const HandleGenerateBill = useCallback(async () => {
        // If details could not be fetched, stop
        if (!Array.isArray(FetchedBillDetail)) {
            return;
        }
        if (FetchedBillDetail.length === 0) {
            return;
        }
        if (!FetchedBillDetail?.length) {
            return warningNofity(
                "Billing details are not available"
            );
        }
        /*
       ==================================================
       3. ONLY TAKE PENDING ITEMS
       ==================================================
       BILLED items belong to previous bills.
       They must NOT be included again.
       */
        if (PendingBillDetails?.length === 0) {
            infoNofity("All delivered items are already billed");
            return;
        }

        const totalAmount = FetchedBillDetail?.reduce(
            (sum, item) =>
                sum + Number(item?.net_amount || 0),
            0
        );
        const payload = {
            billing: {
                patient_id: patientData?.fb_pt_no,
                admission_id: patientData?.fb_ip_no,
                assignment_detail_id: assignment_detail_id,
                billing_party_type: 2, // BYSTANDER
                billing_date: format(new Date(), "yyyy-MM-dd"),
                bill_type: "DELIVERY_GENERATED",
                bill_generated_by: Number(id),
                bill_generated_location: "DELIVERY",
                total_amount: totalAmount,
                paid_amount: 0,
                balance_amount: totalAmount,
                billing_status: "OPEN",
                created_by: Number(id),
                updated_by: null
            },

            items: PendingBillDetails?.map(item => ({
                category_id: 3,
                description: item.item_name,
                item_id: item.item_id || null,
                quantity: Number(item.quantity || 0),
                rate: Number(item.unit_rate || 0),
                gst: Number(item.gst_rate || 0),
                gst_amount: Number(item.gst_amount || 0),
                discount: Number(item.discount || 0),
                amount: Number(item.net_amount || 0),
                reference_table: "diet_service_ledger",
                reference_id: item.ledger_id,
                service_date: format(new Date(), "yyyy-MM-dd") || null,
                bill_item_status: "OPEN"
            }))
        };

        try {
            setLoading(true);
            const response = await axioslogin.post("/dietdelivery/create-bystander-billing", payload);
            const { success, message, data } = response?.data || {};
            if (success !== 1) return warningNofity(message || "Failed to generate bill");
            succesNofity(message || "Bill generated successfully");
            refetchBystanderBilling()
            setOpenBillDialog(true);
        } catch (error) {
            console.error("Generate Bill Error:", error);
            warningNofity(error?.response?.data?.message || "Unable to generate bill")
        } finally {
            setLoading(false);
        }

    }, [
        assignment_detail_id,
        patientData,
        id,
        FetchedBillDetail,
        PendingBillDetails,
        refetchBystanderBilling
        // handleViewServiceLedger
    ]);

    console.log({
        PendingBillDetails
    });



    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
            }}>
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
                    billdetail={billItems}
                    patientData={patientData}
                    floating
                    title="Bill Details"
                    subtitle="View  delivered items"
                    buttonText="View"
                    icon={ReceiptLongRoundedIcon}
                    // onClick={handleViewServiceLedger}
                    isPending={PendingBillDetails?.length}
                    setOpenBillDialog={setOpenBillDialog}
                    OnGenerateBill={HandleGenerateBill}
                />
            )}
        </Box>
    );
};

export default DeliveryMarkingContainer;