import { Box } from "@mui/joy";
import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import NursingStaionHeader from "../NursingStation/NursingStaionHeader";
import DeliveryFoodItemCard from "./DeliveryFoodItemCard";
import TextComponent from "../../components/TextComponent";

const DeliveryMarkingContainer = () => {
    const location = useLocation();
    const { patientData } = location.state || {};

    const {
        // diet_name,
        // ip_no,
        // mrd_no,
        nurse_station_name,
        orders,
        // patient_id,
        // patient_name,
        room_no, } = patientData ?? {};

    console.log({
        patientData
    });


    /* STEP 1: Flatten Data Only Once (Optimized)*/
    const finalMealData = useMemo(() => {
        if (!orders?.length) return [];

        return orders?.flatMap(order =>
            order.foods.flatMap(diet =>
                diet.items.map(item => ({
                    ...item,
                    mealTime: diet.diet_type_name
                }))
            )
        );
    }, [patientData]);

    /* 
       STEP 2: Group Data Smartly
       - Patient → group by mealTime
       - Bystander → flat array
  */
    const groupedData = useMemo(() => {
        const patientMeals = {};

        finalMealData.forEach(food => {
            if (!patientMeals[food.mealTime]) {
                patientMeals[food.mealTime] = [];
            }
            patientMeals[food.mealTime].push(food);
        });

        return { patientMeals, bystanderFoods: [] };
    }, [finalMealData]);


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
                stationname={nurse_station_name}
                bed={room_no}
            />

            <Box
                sx={{
                    flex: 1,
                    px: 2,
                    overflowY: "auto",
                    pb: "120px",
                }}
            >
                {/* ================== PATIENT SECTION ================== */}
                {Object.entries(groupedData.patientMeals)?.map(
                    ([mealTime, foods]) => (
                        <Box key={mealTime} sx={{ mt: 2 }}>
                            <TextComponent
                                value={mealTime?.toUpperCase()}
                                size={15}
                                weight={700}
                            />

                            {foods.map((food) => (
                                <DeliveryFoodItemCard
                                    key={`patient-${food.id}`}
                                    item={food}
                                    patientData={patientData}
                                />
                            ))}
                        </Box>
                    )
                )}

                {/* ================== BYSTANDER SECTION ================== */}
                {groupedData.bystanderFoods.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                        <TextComponent
                            value="BYSTANDER"
                            size={16}
                            weight={800}
                        />

                        {groupedData.bystanderFoods.map((food) => (
                            <DeliveryFoodItemCard
                                key={`bystander-${food.id}`}
                                item={food}
                            />
                        ))}
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default DeliveryMarkingContainer;