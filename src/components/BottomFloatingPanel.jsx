import React, { memo, useMemo, useState } from "react";
import { Box } from "@mui/joy";
import OrderSummaryContent from "./OrderSummaryContent";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { COLORS, FONT, focusRing } from "../Style/designTokens";
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
    PreviousOrders
}) => {



    const [showConfetti, setShowConfetti] = useState(false);
    const [loading, setLoading] = useState(false);
    const [type_slno, setDietType] = useState(0);
    const [, setTypeName] = useState("")
    const queryClient = useQueryClient()
    const id = EmpauthId()



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

                const isBystander =
                    selected?.party_name === "BYSTANDER";

                // use stored state key for bystander
                const finalTimeId = isBystander
                    ? type_slno
                    : food.time_id;


                if (!food.item_id || !finalTimeId) {
                    hasInvalidItem = true;
                    return;
                }

                const priceObj = food.prices?.find(
                    p => p.party_name?.toUpperCase() === selected?.party_name?.toUpperCase()
                );

                // an item without a price for this party type used to be sent with price
                // undefined and gst_amount NaN as long as the total of the other items was > 0
                if (priceObj?.price === undefined || priceObj?.price === null || Number.isNaN(Number(priceObj.price))) {
                    hasInvalidItem = true;
                    return;
                }

                orderDetails.push({
                    diet_type_id: finalTimeId,
                    item_id: food.item_id,
                    quantity: Number(food.qty),
                    unit_id: food.unit_id,
                    patient_diet_id: food?.patient_schedule?.patient_diet_id || null,
                    is_substitute: false
                });

                canteenDetails.push({
                    item_id: food.item_id,
                    qty: Number(food.qty),
                    price: priceObj?.price,
                    gst: priceObj?.gst_rate,
                    type_slno: finalTimeId,
                    // diet reference
                    patient_diet_id:
                        food?.patient_schedule?.patient_diet_id || null,
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



    // Returns { ok, data }. The caller MUST check `ok`: this used to return nothing on a failed
    // request and the screen then showed "order placed" and emptied the cart anyway.
    const safeApiCall = async (apiFn, payload) => {
        try {
            const res = await apiFn(payload);
            if (res?.data?.success !== 1) {
                warningNofity(res?.data?.message || "Operation failed");
                return { ok: false, data: res?.data };
            }
            return { ok: true, data: res.data };
        } catch (err) {
            if (handleAuthError(err)) throw err;
            errorNofity(
                err?.response?.data?.message ||
                err.message ||
                "Something went wrong"
            );
            return { ok: false };
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

        const { orderDetails, canteenDetails, hasInvalidItem } = buildOrderData();

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
            return warningNofity("Some items are invalid or have no price for this order type");

        if (!orderDetails.length)
            return warningNofity("No valid food items");




        const canteenPayload = {
            admission_id: ip_no,
            party_type_id: selected?.party_type_id,
            nursing_station_id: fb_nurse_stn_slno,
            room_id: fb_bed_slno,
            order_status: "PENDING",
            created_by: id,
            patient_diet_id: getPatientDietId()
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

        // ignore extra taps while an order is being placed
        if (loading) return;

        try {


            setLoading(true)
            //  NON-PATIENT FLOW
            if (!isPatient) {
                let canteenResult;

                if (existingCanteenOrderId) {
                    canteenResult = await safeApiCall(addCanteenItems, {
                        itemDetail: canteenDetails,
                        canteen_order_id: existingCanteenOrderId,
                        isExtra: false,
                        patient_id: dietpt_slno,
                        patient_diet_id: getPatientDietId(),
                        created_by: id,
                        order_status: 'PENDING'
                    });

                } else {
                    canteenResult = await safeApiCall(createCanteenOrder, {
                        order: canteenPayload,
                        items: canteenDetails
                    });

                }

                // failed: keep the cart so the nurse can retry (the reason was already shown)
                if (!canteenResult.ok) return;

                setShowConfirmation(true);
                setShowConfetti(true);
                setAssignedFoods({});
                queryClient.invalidateQueries(['patientOrder', dietpt_slno]);
                setTimeout(() => setShowConfetti(false), 3000);
                return;
            }

            //  PATIENT FLOW
            if (existingDietOrderId) {

                const dietResult = await safeApiCall(addDietItems, {
                    order_id: existingDietOrderId,
                    details: orderDetails
                });

                // nothing was saved: keep the cart
                if (!dietResult.ok) return;

                if (existingCanteenOrderId) {
                    const canteenResult = await safeApiCall(addCanteenItems, {
                        itemDetail: canteenDetails,
                        canteen_order_id: existingCanteenOrderId,
                        isExtra: false,
                        patient_id: dietpt_slno,
                        patient_diet_id: getPatientDietId(),
                        created_by: id,
                        order_status: 'PENDING'
                    });

                    if (!canteenResult.ok) {
                        // the diet part is already saved and cannot be undone from here;
                        // refresh the lists so the nurse sees what exists, and do not re-send it
                        errorNofity(
                            "Diet items were saved but the billing items failed. Please do not order again - inform the supervisor"
                        );
                        RefetchDietOrders();
                        RefetchPreviousOrder();
                        return;
                    }

                }

            } else {
                const createResult = await safeApiCall(createDietOrder, {
                    order: dietPayload,
                    details: orderDetails,
                    canteenorder: canteenPayload,
                    canteenorderdetail: canteenDetails,
                    isPending: existingCanteenOrderId ? true : false
                });

                if (!createResult.ok) return;

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
        // bottom sheet: the order being placed (list) or the orders already placed (view)
        <Box
            role="dialog"
            aria-modal="true"
            aria-label={activeTab === "list" ? "Order summary" : "Previous orders"}
            sx={{
                position: "fixed",
                left: 0,
                right: 0,
                bottom: 0,
                mx: "auto",
                width: "100%",
                maxWidth: 560,
                height: "88dvh",
                bgcolor: COLORS.white,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 -12px 32px rgba(42,16,56,0.22)",
                zIndex: 1800,
                boxSizing: 'border-box',
                fontFamily: FONT,
                overflow: "hidden"
            }}
        >

            <Box
                sx={{
                    pl: 2.5,
                    pr: 1,
                    py: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: `1px solid ${COLORS.line}`,
                }}
            >
                <Box sx={{ minWidth: 0 }}>
                    <Box sx={{ fontSize: 18, fontWeight: 700, color: COLORS.ink, lineHeight: 1.25, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {selected?.party_name === 'PATIENT' ? PatientDetail?.ptc_ptname : "Bystander"}
                    </Box>
                    <Box sx={{ fontSize: 14, color: COLORS.muted }}>
                        {activeTab === "list" ? "Order summary" : "Orders placed"}
                    </Box>
                </Box>

                <Box
                    component="button"
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    sx={{
                        flexShrink: 0, width: 48, height: 48, border: 0, borderRadius: "50%", cursor: "pointer",
                        bgcolor: "transparent", color: COLORS.ink, display: "grid", placeItems: "center",
                        "&:active": { bgcolor: COLORS.wash },
                        ...focusRing,
                    }}
                >
                    <CloseRoundedIcon />
                </Box>
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
                            <Box sx={{ px: 2.5, pt: 2 }}>
                                <ChooseDietType value={type_slno} setValue={setDietType} setName={setTypeName} />
                            </Box>
                        }
                        <OrderSummaryContent
                            assignedFoods={assignedFoods}
                            selected={selected?.party_name}
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
                        px: 2.5,
                        pt: 1.5,
                        pb: "calc(12px + env(safe-area-inset-bottom))",
                        borderTop: `1px solid ${COLORS.line}`,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                    }}
                >
                    <Box>
                        <Box sx={{ fontSize: 14, color: COLORS.muted }}>Total</Box>
                        <Box sx={{ fontSize: 24, fontWeight: 700, color: COLORS.ink, lineHeight: 1.1 }}>
                            {`₹${totalAmount}`}
                        </Box>
                    </Box>

                    <Box
                        component="button"
                        type="button"
                        onClick={handleConfirmOrder}
                        disabled={totalAmount === 0 || loading}
                        sx={{
                            flex: 1, maxWidth: 240, height: 52, border: 0, borderRadius: "14px", cursor: "pointer",
                            bgcolor: COLORS.plum, color: COLORS.white, fontFamily: FONT, fontSize: 17, fontWeight: 700,
                            "&:active": { bgcolor: COLORS.plumDark },
                            "&:disabled": { bgcolor: COLORS.orchid, color: COLORS.muted, cursor: "not-allowed" },
                            ...focusRing,
                        }}
                    >
                        {loading ? "Placing order…" : "Place order"}
                    </Box>
                </Box>
            }
        </Box>

    );
};

export default memo(BottomFloatingPanel);



