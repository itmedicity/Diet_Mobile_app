import React, { memo, useMemo, useState } from "react";
import { Box, Button, Checkbox } from "@mui/joy";
import TextComponent from "./TextComponent";
import OrderSummaryContent from "./OrderSummaryContent";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import { EmpauthId, errorNofity, infoNofity, warningNofity } from "../Views/Constant/Constant";
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
import ChooseDietType from "../SelectComponents/ChooseDietType";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";

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
    showConfirmation,
    PreviousOrders,
    handleToggleUrgent
}) => {


    console.log({
        selected
    });



    const [showConfetti, setShowConfetti] = useState(false);
    const [loading, setLoading] = useState(false);
    const [type_slno, setDietType] = useState(0);
    const [typename, setTypeName] = useState("")
    const [remarks, setRemarks] = useState("");
    const queryClient = useQueryClient()
    const id = EmpauthId()
    const [isUrgent, setIsUrgent] = useState(false);


    const { data: DietOrders = [], refetch: RefetchDietOrders } =
        useAllPatientPreviousOrders(PatientDetail?.dietpt_slno);

    const { data: PatientDietOrderDetails = [], refetch: RefetchPreviousOrder } =
        useCustomerPreviousCanteenOrder(PatientDetail?.ip_no, selected?.party_type_id);


    const getPatientDietId = () => {

        if (selected?.party_name !== "PATIENT")
            return null;

        const food = Object.values(assignedFoods || {})
            .flatMap(time => time.foods || [])
            .find(food => food?.patient_schedule?.patient_diet_id);

        return food?.patient_schedule?.patient_diet_id || null;
    };


    // checking if all item in the order is Urgent ? 
    const allItemsUrgent = useMemo(() => {
        const foods = Object.values(assignedFoods || {})
            .flatMap((time) => time?.foods || [])
            .filter((food) => Number(food?.qty) > 0);

        return foods.length > 0 && foods.every((food) => Boolean(food.is_urgent));
    }, [assignedFoods]);



    const updateAllFoodsUrgent = (urgent) => {
        setIsUrgent(urgent);

        setAssignedFoods((prev) => {
            const updated = {};

            Object.entries(prev || {}).forEach(([timeId, time]) => {
                updated[timeId] = {
                    ...time,
                    foods: (time?.foods || []).map((food) => ({
                        ...food,
                        is_urgent: urgent,
                    })),
                };
            });

            return updated;
        });
    };

    const handleToggleAllUrgent = (event) => {
        updateAllFoodsUrgent(event.target.checked);
    };

    const handleDietTypeChange = (value) => {
        setDietType(value);

        console.log(
            typename
        );

        if (typename?.trim().toUpperCase() === "AD HOC") {
            updateAllFoodsUrgent(true);
        } else {
            updateAllFoodsUrgent(false);
        }
    };





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
        const urgentItems = [];
        let hasInvalidItem = false;

        Object.values(assignedFoods || {}).forEach((time) => {
            (time?.foods || []).forEach((food) => {
                if (!food || !food.qty || Number(food.qty) <= 0) return;

                console.log({
                    food
                });


                const isBystander =
                    selected?.party_name === "BYSTANDER";

                // Use stored state key for bystander
                const finalTimeId = isBystander
                    ? type_slno
                    : food.time_id;

                if (!food.item_id || !finalTimeId) {
                    hasInvalidItem = true;
                    return;
                }

                const priceObj = food.prices?.find(
                    (p) =>
                        p.party_name?.toUpperCase() ===
                        selected?.party_name?.toUpperCase()
                );

                const itemIsUrgent = food?.is_urgent === true ||
                    Number(food?.is_urgent) === 1 ||
                    food?.is_urgent === "true";



                const quantity = Number(food.qty);
                const patientDietId =
                    food?.patient_schedule?.patient_diet_id || null;

                orderDetails.push({
                    diet_type_id: finalTimeId,
                    item_id: food.item_id,
                    quantity,
                    unit_id: food.unit_id,
                    patient_diet_id: patientDietId,
                    is_substitute: false,
                    is_urgent: itemIsUrgent,
                });

                canteenDetails.push({
                    item_id: food.item_id,
                    qty: quantity,
                    price: priceObj?.price,
                    gst: priceObj?.gst_rate,
                    type_slno: finalTimeId,
                    patient_diet_id: patientDietId,
                    gst_amount:
                        (Number(priceObj?.price || 0) *
                            quantity *
                            Number(priceObj?.gst_rate || 0)) /
                        100,
                    is_urgent: itemIsUrgent,
                });

                // Keep only urgent items for separate urgency-table insertion
                if (itemIsUrgent) {
                    urgentItems.push({
                        item_id: food.item_id,
                        quantity,
                        diet_type_id: finalTimeId,
                        patient_diet_id: patientDietId,
                        type_slno: finalTimeId,
                        is_item_urgent: true,
                    });
                }
            });
        });

        const hasItems = orderDetails.length > 0;

        // Order is urgent only when every selected item is urgent
        const allItemsUrgent =
            hasItems && orderDetails.every((item) => item.is_urgent);

        return {
            orderDetails,
            canteenDetails,
            urgentItems,
            allItemsUrgent,
            hasInvalidItem,
        };
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

        const { orderDetails, canteenDetails, hasInvalidItem, allItemsUrgent, urgentItems } = buildOrderData();



        // Check duplicate food in the same meal/type
        const duplicateFood = canteenDetails.find((food) =>
            PreviousOrders?.some(
                (order) =>
                    Number(order?.type_slno) === Number(food?.type_slno) &&
                    Number(order?.item_id) === Number(food?.item_id) &&
                    order?.order_status === "PENDING"
            )
        );

        if (duplicateFood) {

            const duplicateFoodName =
                Object.values(assignedFoods || {})
                    .flatMap((time) => time?.foods || [])
                    .find(
                        (food) =>
                            Number(food?.item_id) ===
                            Number(duplicateFood?.item_id)
                    )?.item_name || "This food";

            return infoNofity(
                `${duplicateFoodName} is already added to this meal.`
            );
        }

        const isPatient = selected?.party_name === 'PATIENT';

        if (!isPatient && type_slno === 0) return infoNofity("Please select Meal Type!");

        if (hasInvalidItem)
            return warningNofity("Some items are invalid");

        if (!orderDetails.length)
            return warningNofity("No valid food items");




        const canteenPayload = {
            admission_id: ip_no,
            party_type_id: selected?.party_type_id,
            nursing_station_id: fb_nurse_stn_slno,
            room_id: fb_bed_slno,
            order_status: "PENDING",
            created_by: id,
            patient_diet_id: getPatientDietId(),
            remarks: remarks.trim() || null,
            is_urgent: allItemsUrgent,
            urgentItems
        };

        const dietPayload = {
            patient_id: dietpt_slno,
            plan_id,
            order_date: format(new Date(), "yyyy-MM-dd"),
            nursing_station_id: fb_nurse_stn_slno,
            room_id: fb_bed_slno,
            order_status: "PENDING",
            collected_by: id,
            remarks: remarks.trim() || null,
            is_urgent: allItemsUrgent,
            urgentItems
        };

        try {


            setLoading(true)
            //  NON-PATIENT FLOW
            if (!isPatient) {
                if (existingCanteenOrderId) {
                    await safeApiCall(addCanteenItems, {
                        itemDetail: canteenDetails,
                        canteen_order_id: existingCanteenOrderId,
                        isExtra: false,
                        patient_id: dietpt_slno,
                        patient_diet_id: getPatientDietId(),
                        created_by: id,
                        order_status: 'PENDING',
                        remarks: remarks.trim() || null,
                        is_urgent: allItemsUrgent,
                        urgentItems

                    });

                } else {
                    await safeApiCall(createCanteenOrder, {
                        order: canteenPayload,
                        items: canteenDetails,
                    });

                }

                setShowConfirmation(true);
                setShowConfetti(true);
                setAssignedFoods({});
                queryClient.invalidateQueries(['patientOrder', dietpt_slno]);
                setRemarks("")
                setTimeout(() => setShowConfetti(false), 3000);
                return;
            }

            //  PATIENT FLOW
            if (existingDietOrderId) {

                await safeApiCall(addDietItems, {
                    order_id: existingDietOrderId,
                    details: orderDetails,
                    remarks: remarks.trim() || null,
                    is_urgent: allItemsUrgent,
                    urgentItems
                });


                if (existingCanteenOrderId) {
                    await safeApiCall(addCanteenItems, {
                        itemDetail: canteenDetails,
                        canteen_order_id: existingCanteenOrderId,
                        isExtra: false,
                        patient_id: dietpt_slno,
                        patient_diet_id: getPatientDietId(),
                        created_by: id,
                        order_status: 'PENDING',
                        is_urgent: allItemsUrgent,
                        urgentItems,
                    });

                }

            } else {
                await safeApiCall(createDietOrder, {
                    order: dietPayload,
                    details: orderDetails,
                    canteenorder: canteenPayload,
                    canteenorderdetail: canteenDetails,
                    isPending: existingCanteenOrderId ? true : false,
                    urgentItems
                });

            }

            // SUCCESS UI
            setShowConfirmation(true);
            setShowConfetti(true);
            setAssignedFoods({});
            queryClient.invalidateQueries(['patientOrder', dietpt_slno]);
            setRemarks("")
            setTimeout(() => setShowConfetti(false), 3000);


        } catch (err) {
            if (handleAuthError(err)) return;
            errorNofity(err?.response?.data?.message || "Error placing order");
        } finally {
            setLoading(false)
            setRemarks("")
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
                zIndex: 99999,
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
                    <>
                        {
                            selected?.party_name !== 'PATIENT' &&
                            <ChooseDietType
                                value={type_slno}
                                setValue={handleDietTypeChange}
                                setName={(name) => {
                                    setTypeName(name);
                                    updateAllFoodsUrgent(name?.trim().toUpperCase() === "AD HOC");
                                }}
                            />
                        }
                        <OrderSummaryContent
                            assignedFoods={assignedFoods}
                            selected={selected?.party_name}
                            handleToggleUrgent={handleToggleUrgent}
                            typename={typename}
                        />
                    </>
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
                        flexDirection: "column",
                        gap: 1.2,
                    }}
                >
                    <Checkbox
                        checked={allItemsUrgent}
                        onChange={handleToggleAllUrgent}
                        disabled={typename?.trim().toUpperCase() === "AD HOC" || loading}
                        label="Mark entire order as urgent"
                        color="danger"
                        size="sm"
                        sx={{
                            fontFamily: "Bahnschrift",
                            fontSize: 12,
                            fontWeight: 600,
                            "--Checkbox-size": "17px",
                        }}
                    />
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            border: "1px solid #e2d5e8",
                            borderRadius: "8px",
                            px: 1.2,
                            py: 0.7,
                            bgcolor: "#fdfbfe",
                            transition: "border-color 0.2s",
                            "&:focus-within": {
                                borderColor: "#9d25b8",
                                boxShadow: "0 0 0 2px rgba(157,37,184,0.08)",
                            },
                        }}
                    >
                        <Box
                            component="input"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            placeholder="Add order remarks..."
                            disabled={loading}
                            sx={{
                                flex: 1,
                                minWidth: 0,
                                height: 50,
                                border: "none",
                                outline: "none",
                                bgcolor: "transparent",
                                fontSize: 12,
                                fontFamily: "Bahnschrift",
                                color: "#222",
                                "&::placeholder": {
                                    color: "#aaa",
                                },
                            }}
                        />
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Box>
                            <TextComponent
                                value="Total"
                                size={12}
                                weight={500}
                                color="#777"
                            />
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
                </Box>

            }
        </Box>

    );
};

export default memo(BottomFloatingPanel);



