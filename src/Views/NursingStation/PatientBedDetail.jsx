import { Box, Divider } from "@mui/joy";
import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import NursingStaionHeader from "./NursingStaionHeader";
import PatientBystanderToggle from "../../components/PatientBystanderToogle";
import PatientInfoCard from "../../components/PatientInfoCard";
import TextComponent from "../../components/TextComponent";
import FoodItemAddCard from "../../components/FoodItemAddCard";
import SpecialMealSelectScollBox from "../../components/SpecialMealSelectScollBox";
import { buildBystanderCategories, filterFoodsByType, infoNofity, warningNofity } from "../Constant/Constant";
import BottomFloatingPanel from "../../components/BottomFloatingPanel";
import ActiveTabOverlay from "../../components/ActiveTabOverlay";
import BottomListTab from "../../components/BottomListTab";
import { useAllPateinetFoodDetail, useAllPatientPreviousOrders, useCustomerPreviousCanteenOrder, usePatientPlanFoodDetails } from "../../CommonData/UseQuery";
import { groupMeals } from "../../CommonData/Common";
import FloatingOrderTaking from "../../components/FloatingOrderTaking";
import OrderTakingPanel from "./Component/OrderTakingPanel";

const PatientBedDetail = () => {

  const location = useLocation();
  const { BedName, stationname, template_id, fullDetail } = location.state || {};
  const [selected, setSelected] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [activeTab, setActiveTab] = useState(null);
  const [openOrderPanel, setOpenOrderPanel] = useState(false);



  //  FIXED: separate states
  const [patientFoods, setPatientFoods] = useState({});
  const [bystanderFoods, setBystanderFoods] = useState({});

  //  FIXED: dynamic state selection
  const assignedFoods = selected?.party_name === "PATIENT" ? patientFoods : bystanderFoods;
  const setAssignedFoods = selected?.party_name === "PATIENT" ? setPatientFoods : setBystanderFoods;

  const [showConfirmation, setShowConfirmation] = useState(false);

  const { data: FetchPlanFoodDetail = [] } = usePatientPlanFoodDetails(fullDetail?.plan_id);

  const { data: PreviousOrders = [], refetch: RefetchPreviousOrder } =
    useCustomerPreviousCanteenOrder(fullDetail?.ip_no, selected?.party_type_id);

  const typeIds = useMemo(() => {
    if (!FetchPlanFoodDetail?.length) return [];

    return FetchPlanFoodDetail?.map(item => item.type_id);
  }, [FetchPlanFoodDetail]);

  const { data: FetchAllTemplateId = [] } = useAllPateinetFoodDetail(template_id, typeIds);

  const FinalMappingTemplateFood = useMemo(() => {
    return groupMeals(FetchAllTemplateId);
  }, [FetchAllTemplateId]);

  const handleOpen = (value) => {
    setActiveTab(value);
  };

  const handleClose = () => {
    setShowConfirmation(false);
    setActiveTab(null);
  };

  const handleToggleFood = (food) => {

    const IsItemInPendingList = PreviousOrders?.some(
      (item) =>
        item.item_id === food.food_id &&
        item?.order_status === 'PENDING'
    );

    if (IsItemInPendingList) return infoNofity("Item Already In the Pending Order!")

    const timeKey = food.time_id;

    if (!timeKey) return warningNofity("Missing time_id in food", food);

    setAssignedFoods((prev) => {
      const existingTime = prev[timeKey];

      if (!existingTime) {
        return {
          ...prev,
          [timeKey]: {
            time_name: food.time_name,
            foods: [{ ...food, qty: 1 }],
          },
        };
      }

      const isAlreadyAssigned = existingTime?.foods.find(
        (f) => f.food_id === food.food_id
      );

      if (isAlreadyAssigned) {
        const updatedFoods = existingTime.foods.filter(
          (f) => f.food_id !== food.food_id
        );

        if (updatedFoods.length === 0) {
          const { [timeKey]: removedTime, ...remaining } = prev;
          return remaining;
        }

        return {
          ...prev,
          [timeKey]: {
            ...existingTime,
            foods: updatedFoods,
          },
        };
      }

      return {
        ...prev,
        [timeKey]: {
          ...existingTime,
          foods: [...existingTime.foods, { ...food, qty: 1 }],
        },
      };
    });
  };

  const handleIncrement = (timeId, foodId) => {
    setAssignedFoods((prev) => ({
      ...prev,
      [timeId]: {
        ...prev[timeId],
        foods: prev[timeId].foods.map((f) =>
          f.food_id === foodId ? { ...f, qty: f.qty + 1 } : f
        ),
      },
    }));
  };

  const handleDecrement = (timeId, foodId) => {
    setAssignedFoods((prev) => ({
      ...prev,
      [timeId]: {
        ...prev[timeId],
        foods: prev[timeId].foods.map((f) =>
          f.food_id === foodId && f.qty > 1
            ? { ...f, qty: f.qty - 1 }
            : f
        ),
      },
    }));
  };

  const allFoods = useMemo(() => {
    if (!FinalMappingTemplateFood?.length) return [];

    return FinalMappingTemplateFood?.flatMap((time) =>
      time.foods.map((food) => ({
        ...food,
        time_id: food?.time_id,       // already exists
        time_name: food?.time_name,   // already exists
      }))
    );
  }, [FinalMappingTemplateFood]);


  const filteredFoods = useMemo(() => {
    return filterFoodsByType(allFoods, selectedFilter);
  }, [allFoods, selectedFilter]);


  const categorizedFoods = useMemo(() => {
    if (selected?.party_name !== "BYSTANDER") return null;
    return buildBystanderCategories(filteredFoods);
  }, [selected, filteredFoods]);



  //  Check localStorage for previous orders
  const hasOrders = useMemo(() => {
    return PreviousOrders && PreviousOrders?.length > 0;
  }, [PreviousOrders]);






  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", bgcolor: "#fff" }}>

      <NursingStaionHeader stationname={stationname} bed={BedName} />

      <Box sx={{ flex: 1, px: 2, overflowY: "auto", pb: "120px", transition: "0.3s ease", filter: activeTab ? "blur(4px) brightness(0.95)" : "none" }}>
        <Box sx={{ position: "sticky", top: 0, zIndex: 10, bgcolor: "#ffffff", pt: 2, pb: 2 }}>
          <PatientBystanderToggle selected={selected} setSelected={setSelected} />
          {
            selected?.party_name === "PATIENT" ? (
              <PatientInfoCard PatientDetail={fullDetail} />
            ) : (
              <SpecialMealSelectScollBox selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} />
            )}
        </Box>

        <Box sx={{ mt: 2 }}>

          {selected?.party_name === "PATIENT" &&
            FinalMappingTemplateFood?.map((time) => (
              <Box key={time.type} sx={{ mb: 3 }}>
                <TextComponent color="#0b0b0b" value={time?.type} size={16} weight={800} />
                <Divider sx={{ my: 1 }} />

                {time.foods.map((food) => {
                  const assignedTime = assignedFoods[food.time_id];
                  const assignedFood = assignedTime?.foods?.find(
                    (f) => f.food_id === food.food_id
                  );

                  return (
                    <FoodItemAddCard
                      key={food.food_id}
                      foodDetail={food}
                      assignedFood={assignedFood}
                      onClick={() => handleToggleFood(food)}
                      onIncrement={() => handleIncrement(food.time_id, food.food_id)}
                      onDecrement={() => handleDecrement(food.time_id, food.food_id)}
                    />
                  );
                })}
              </Box>
            ))}

          {selected?.party_name === "BYSTANDER" &&
            categorizedFoods &&
            Object.entries(categorizedFoods)?.map(([category, foods]) => {
              if (!foods.length) return null;

              return (
                <Box key={category} sx={{ mb: 3 }}>
                  <TextComponent value={category} size={15} weight={800} color="#111" />
                  <Divider sx={{ my: 1 }} />

                  {foods?.map((food) => {

                    const assignedTime = assignedFoods[food.time_id];
                    const assignedFood = assignedTime?.foods?.find((f) => f.food_id === food.food_id);

                    return (
                      <FoodItemAddCard
                        key={food.food_id}
                        foodDetail={food}
                        assignedFood={assignedFood}
                        onClick={() => handleToggleFood(food)}
                        onIncrement={() => handleIncrement(food.time_id, food.food_id)}
                        onDecrement={() => handleDecrement(food.time_id, food.food_id)}
                      />
                    );
                  })}
                </Box>
              );
            })}
        </Box>

      </Box>

      <ActiveTabOverlay activeTab={activeTab} onClose={handleClose} />

      <BottomFloatingPanel
        setActiveTab={setActiveTab}
        selected={selected}
        PatientDetail={fullDetail}
        assignedFoods={assignedFoods}
        activeTab={activeTab}
        onClose={handleClose}
        setAssignedFoods={setAssignedFoods}
        showConfirmation={showConfirmation}
        setShowConfirmation={setShowConfirmation}
      />

      <FloatingOrderTaking onOpen={() => setOpenOrderPanel(true)} />

      {/* Order Taking Panel */}
      <OrderTakingPanel
        persontype={selected?.party_type_id}
        open={openOrderPanel}
        onClose={() => setOpenOrderPanel(false)}
        fullDetail={fullDetail}

      />
      {
        !openOrderPanel &&
        <BottomListTab
          setShowConfirmation={setShowConfirmation}
          assignedFoods={assignedFoods}
          onOpen={handleOpen}
          selected={selected}
          hasOrders={hasOrders}
        />
      }
    </Box>
  );
};

export default PatientBedDetail;