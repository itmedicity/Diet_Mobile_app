import React, { memo, useMemo, useState } from "react";
import { Box, Button } from "@mui/joy";
import TextComponent from "./TextComponent";
import OrderSummaryContent from "./OrderSummaryContent";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import { EmpauthId, errorNofity, warningNofity } from "../Views/Constant/Constant";
import OrderStatsCard from "./OrderStatsCard";
import OrderConfirmationPage from "./OrderConfirmationPage";
import { format } from "date-fns";
import { axioslogin } from "../Axios/axios";
import { handleAuthError } from "../CommonData/Common";
import { useQueryClient } from "@tanstack/react-query";
import {
    useAllPatientPreviousOrders,
    useCustomerPreviousCanteenOrder
} from "../CommonData/UseQuery";
import PizzaLoader from "./PizzaLoader";


const HEADER_HEIGHT = 60;
const BOTTOM_NAV_HEIGHT = 60;
const PANEL_MARGIN = 20;

const BottomFloatingPanel = ({
    activeTab,
    assignedFoods,
    selected,
    PatientDetail,
    onClose,
    setAssignedFoods,
    setActiveTab,
    setShowConfirmation,
    showConfirmation
}) => {


    const [showConfetti, setShowConfetti] = useState(false);
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient()
    const id = EmpauthId()


    const { data: DietOrders = [], refetch: RefetchDietOrders } =
        useAllPatientPreviousOrders(PatientDetail?.dietpt_slno);

    const { data: PatientDietOrderDetails = [], refetch: RefetchPreviousOrder } =
        useCustomerPreviousCanteenOrder(PatientDetail?.ip_no, selected?.party_type_id);


    // TotalAmount for the List of Detail

    const totalAmount = useMemo(() => {
        return Object.values(assignedFoods || {}).reduce((timeTotal, time) => {
            const foodsTotal = time.foods.reduce((sum, food) => {
                //  pick correct price based on selected type
                const selectedPriceObj = food.prices?.find(
                    p => p.party_name?.toUpperCase() === selected?.party_name?.toUpperCase()
                );


                const price = selectedPriceObj?.price || 0;
                return sum + price * food.qty;
            }, 0);
            return timeTotal + foodsTotal;
        }, 0);
    }, [assignedFoods, selected]);


    const validateOrder = () => {
        if (!assignedFoods || Object.keys(assignedFoods).length === 0)
            return "No food items selected";

        if (totalAmount === 0)
            return "Order List is Empty";

        if (!PatientDetail)
            return "Patient details missing";

        const {
            dietpt_slno,
            plan_id,
            fb_nurse_stn_slno,
            fb_bed_slno
        } = PatientDetail;

        if (!dietpt_slno) return "Invalid Patient ID";
        if (!plan_id) return "Diet plan not assigned";
        if (!fb_nurse_stn_slno) return "Nursing station missing";
        if (!fb_bed_slno) return "Room/Bed not assigned";
        if (!id) return "User not identified";

        return null;
    };

    const buildOrderData = () => {
        const orderDetails = [];
        const canteenDetails = [];
        let hasInvalidItem = false;

        Object.values(assignedFoods).forEach(time => {
            (time?.foods || []).forEach(food => {
                if (!food || !food.qty || food.qty <= 0) return;

                if (!food.food_id || !food.time_id || !food.unit_id) {
                    hasInvalidItem = true;
                    return;
                }

                const priceObj = food.prices?.find(
                    p => p.party_name?.toUpperCase() === selected?.party_name?.toUpperCase()
                );

                orderDetails.push({
                    diet_type_id: food.time_id,
                    item_id: food.food_id,
                    quantity: Number(food.qty),
                    unit_id: food.unit_id,
                    is_substitute: false
                });

                canteenDetails.push({
                    item_id: food.food_id,
                    qty: Number(food.qty),
                    price: priceObj?.price,
                    gst: priceObj?.gst_rate,
                    type_slno: food.time_id,
                    gst_amount:
                        (Number(priceObj?.price) *
                            Number(food.qty) *
                            priceObj?.gst_rate) / 100,
                });
            });
        });

        return { orderDetails, canteenDetails, hasInvalidItem };
    };


    const addCanteenItems = (payload) =>
        axioslogin.post("/canteenorder/add/items", payload);

    const createCanteenOrder = (payload) =>
        axioslogin.post("/canteenorder/create", payload);

    const addDietItems = (payload) =>
        axioslogin.post("/fooddietorder/add/dietitem", payload);

    const createDietOrder = (payload) =>
        axioslogin.post("/fooddietorder/insert", payload);



    const safeApiCall = async (apiFn, payload) => {
        try {
            const res = await apiFn(payload);
            if (res?.data?.success === 0) {
                warningNofity(res?.data?.message || "Operation failed");
            }
            return res.data;
        } catch (err) {
            if (handleAuthError(err)) throw err;
            errorNofity(
                err?.response?.data?.message ||
                err.message ||
                "Something went wrong"
            );
        }
    };


    const handleConfirmOrder = async () => {
        setLoading(true)
        const error = validateOrder();
        if (error) return warningNofity(error);

        const {
            dietpt_slno,
            plan_id,
            fb_nurse_stn_slno,
            fb_bed_slno,
            ip_no
        } = PatientDetail;

        const existingDietOrderId = DietOrders?.find(i => i.order_status === "PENDING")?.order_id;

        const existingCanteenOrderId = PatientDietOrderDetails?.find(i => i.order_status === "PENDING")?.canteen_order_id;

        const { orderDetails, canteenDetails, hasInvalidItem } = buildOrderData();

        if (hasInvalidItem)
            return warningNofity("Some items are invalid");

        if (!orderDetails.length)
            return warningNofity("No valid food items");

        const isPatient = selected?.party_name === 'PATIENT';

        const canteenPayload = {
            admission_id: ip_no,
            party_type_id: selected?.party_type_id,
            nursing_station_id: fb_nurse_stn_slno,
            room_id: fb_bed_slno,
            order_status: "PENDING",
            created_by: id
        };

        const dietPayload = {
            patient_id: dietpt_slno,
            plan_id,
            order_date: format(new Date(), "yyyy-MM-dd"),
            nursing_station_id: fb_nurse_stn_slno,
            room_id: fb_bed_slno,
            order_status: "PENDING",
            collected_by: id
        };

        try {



            //  NON-PATIENT FLOW
            if (!isPatient) {
                if (existingCanteenOrderId) {
                    await safeApiCall(addCanteenItems, {
                        itemDetail: canteenDetails,
                        canteen_order_id: existingCanteenOrderId,
                        isExtra: false,
                        patient_id: dietpt_slno,
                        created_by: id,
                        order_status: 'PENDING'
                    });

                } else {
                    await safeApiCall(createCanteenOrder, {
                        order: canteenPayload,
                        items: canteenDetails
                    });

                }

                setShowConfirmation(true);
                setShowConfetti(true);
                setAssignedFoods({});
                queryClient.invalidateQueries(['patientOrder', dietpt_slno]);
                setTimeout(() => setShowConfetti(false), 3000);
                return;
            }

            //  PATIENT FLOW
            if (existingDietOrderId) {

                console.log("order id working");


                await safeApiCall(addDietItems, {
                    order_id: existingDietOrderId,
                    details: orderDetails
                });


                if (existingCanteenOrderId) {
                    await safeApiCall(addCanteenItems, {
                        itemDetail: canteenDetails,
                        canteen_order_id: existingCanteenOrderId,
                        isExtra: false,
                        patient_id: dietpt_slno,
                        created_by: id,
                        order_status: 'PENDING'
                    });

                }

            } else {
                await safeApiCall(createDietOrder, {
                    order: dietPayload,
                    details: orderDetails,
                    canteenorder: canteenPayload,
                    canteenorderdetail: canteenDetails,
                    isPending: existingCanteenOrderId ? true : false
                });

            }

            // SUCCESS UI
            setShowConfirmation(true);
            setShowConfetti(true);
            setAssignedFoods({});
            queryClient.invalidateQueries(['patientOrder', dietpt_slno]);

            setTimeout(() => setShowConfetti(false), 3000);


        } catch (err) {
            if (handleAuthError(err)) return;
            errorNofity(err?.response?.data?.message || "Error placing order");
        } finally {
            setLoading(false)
        }
    };


    if (!activeTab) return null;

    return (
        <Box
            sx={{
                position: "fixed",
                top: HEADER_HEIGHT + 10,
                left: "50%",
                transform: "translateX(-50%)",
                width: "90%",
                height: `calc(90vh - ${HEADER_HEIGHT + BOTTOM_NAV_HEIGHT + PANEL_MARGIN}px)`,
                bgcolor: "#fff",
                borderRadius: 16,
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 20px 45px rgba(0,0,0,0.18)",
                border: "1px solid #9d25b8",
                zIndex: 1800,
                boxSizing: 'border-box'
            }}
        >

            <Box
                sx={{
                    px: 2,
                    py: 1.2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid #f3f3f3",
                }}
            >
                <Box>
                    <TextComponent
                        value={selected?.party_name === 'PATIENT' ? PatientDetail?.ptc_ptname : "Bystander"}
                        size={13}
                        weight={700}
                        color="#000"
                    />
                    <TextComponent
                        value="Order Summary"
                        size={11}
                        weight={500}
                        color="#777"
                    />
                </Box>

                <Button
                    size="sm"
                    variant="soft"
                    onClick={onClose}
                    sx={{
                        minHeight: 28,
                        px: 1.5,
                        fontSize: 11,
                        borderRadius: 20,
                        fontWeight: 600,
                    }}
                >
                    Close
                </Button>
            </Box>
            {loading && <PizzaLoader />}
            {
                showConfirmation ? (
                    <OrderConfirmationPage
                        showCelebration={showConfetti}
                        onBack={() => {
                            setShowConfirmation(false)
                            setActiveTab("view")
                        }}
                    />
                ) : activeTab === "list" ? (
                    <OrderSummaryContent
                        assignedFoods={assignedFoods}
                        selected={selected?.party_name}
                    />
                ) : (
                    <OrderStatsCard
                        PreviousOrders={PatientDietOrderDetails}
                        DietOrders={DietOrders}
                        selected={selected}
                        PatientDetail={PatientDetail}
                    />
                )
            }

            {
                (activeTab === "list" && !showConfirmation) &&

                <Box
                    sx={{
                        px: 2,
                        py: 1.5,
                        borderTop: "1px solid #f0f0f0",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Box>
                        <TextComponent value="Total" size={12} weight={500} color="#777" />
                        <TextComponent
                            value={`₹${totalAmount}`}
                            size={18}
                            weight={800}
                            color="#070707"
                        />
                    </Box>

                    <Button
                        onClick={handleConfirmOrder}
                        size="sm"
                        startDecorator={
                            <ConfirmationNumberIcon sx={{ fontSize: 16 }} />
                        }
                        disabled={totalAmount === 0 || loading}
                        sx={{
                            px: 2,
                            height: 34,
                            borderRadius: 20,
                            fontSize: 12,
                            fontWeight: 600,
                            bgcolor: "#9d25b8",
                            "&:hover": { bgcolor: "#7b1fa2" },
                        }}
                    >
                        Confirm Order
                    </Button>
                </Box>
            }
        </Box>

    );
};

export default memo(BottomFloatingPanel);