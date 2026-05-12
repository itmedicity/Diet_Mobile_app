import React, { useMemo, useState, useCallback } from "react";
import { Box, Input, Button } from "@mui/joy";
import TextComponent from "../../../components/TextComponent";
import { useAllPatientPreviousOrders, useItemFullDetials, usePatientExtraOrders } from "../../../CommonData/UseQuery";
import FoodSuggestionItem from "./FoodSuggestionItem";
import { getFoodPrice } from "../../Constant/Common";
import { infoNofity, warningNofity } from "../../Constant/Constant";
import { groupPreviousOrder } from "../../../CommonData/Common";
import ChooseDietType from "../../../SelectComponents/ChooseDietType";

const MobileFoodOrder = ({
    personType,
    setItems,
    fullDetail,
    setSelectedFood,
    selectedFood,
    PreviousOrders
}) => {



    const [query, setQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(-1);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [qty, setQty] = useState(1);
    const [type_slno, setDietType] = useState(0);
    const [typename, setTypeName] = useState("")

    const { data: ExistFoodDetail = [] } = useItemFullDetials(query.length > 0);


    const { data: DietOrders = [],
        // refetch: RefetchDietOrders 
    } =
        useAllPatientPreviousOrders(fullDetail?.dietpt_slno);


    const {
        data: PatientExtraOrders = [],
        // refetch: refetchExtra
    } = usePatientExtraOrders(fullDetail?.dietpt_slno, 'PENDING');



    const orders = useMemo(() => {
        return groupPreviousOrder(
            PreviousOrders,     // canteen
            DietOrders,         // diet
            PatientExtraOrders  // extra
        );
    }, [PreviousOrders, DietOrders, PatientExtraOrders]);

    const PendingOrderItems = orders?.find((item) => item?.order_status === "PENDING")?.items;




    /* FILTER */
    const filteredSuggestions = useMemo(() => {
        if (!query.trim()) return [];

        const q = query.toLowerCase();

        return ExistFoodDetail
            .filter(item =>
                item?.item_name?.toLowerCase().includes(q) ||
                item?.item_code?.toLowerCase().includes(q)
            )
            .slice(0, 8);

    }, [query, ExistFoodDetail]);

    /* SELECT ONLY (NO ADD) */
    const handleSelectFood = useCallback((food) => {

        const pricing = getFoodPrice(food, personType);

        setSelectedFood({
            ...food,
            ...pricing
        });

        setQuery("");
        setShowSuggestions(false);
        setQty(1);

    }, [personType, setSelectedFood]);

    /* ADD FUNCTION (SEPARATE) */
    const handleAddToCart = useCallback(() => {

        if (!selectedFood?.item_id) return;
        if (!type_slno) return warningNofity("Please Select Meal !")

        const IsAlreadyItemInPending = PendingOrderItems?.some(item => item.item_id === selectedFood.item_id);


        if (IsAlreadyItemInPending) {
            infoNofity("Item Already in Pending List!")
            setSelectedFood({})
            return
        }
        const { price, gst } = getFoodPrice(selectedFood, personType);

        setItems(prev => {

            const exists = (prev ?? []).some(i => i.item_id === selectedFood.item_id);

            if (exists) {
                infoNofity("Item already added");
                return prev;
            }

            return [
                ...prev,
                {
                    item_id: selectedFood.item_id,
                    item_name: selectedFood.item_name,
                    qty,
                    price,
                    gst,
                    type_slno,
                    gst_amount: (price * qty * gst) / 100
                }
            ];
        });

        setQty(1);
        setSelectedFood({})

    }, [selectedFood, qty, personType, setItems]);


    return (
        <Box>

            <TextComponent
                value={`Search Food Here`}
                size={13}
                weight={600}
            // color={ }
            />
            <ChooseDietType value={type_slno} setValue={setDietType} setName={setTypeName} />
            <Box
                sx={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    p: 1,
                    borderRadius: 30,
                    bgcolor: "#fff",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                    border: "1px solid #eee"
                }}
            >
                {/*  SEARCH SECTION */}


                <Box sx={{ flex: 1 }}>

                    <input
                        placeholder="Search food or code..."
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        className="qty-input"
                        style={{
                            width: "95%",
                            border: "none",
                            outline: "none",
                            fontSize: "14px",
                            padding: "8px 12px",
                            borderRadius: "20px",
                            background: "#f7f7f9"
                        }}
                    />

                    {/*  SUGGESTIONS DROPDOWN */}
                    {showSuggestions && (
                        <Box
                            sx={{
                                position: "absolute",
                                top: "110%",
                                left: 0,
                                right: 0,
                                zIndex: 9999,

                            }}
                        >
                            <FoodSuggestionItem
                                suggestions={filteredSuggestions}
                                onSelect={handleSelectFood}
                                activeIndex={activeIndex}
                                personType={personType}
                            />
                        </Box>
                    )}
                </Box>

                {/*  ADD BUTTON */}
                {(selectedFood && Object.keys(selectedFood).length > 0) && (
                    <Button
                        onClick={handleAddToCart}
                        sx={{
                            borderRadius: 25,
                            px: 2,
                            height: 36,
                            fontSize: 13,
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                            bgcolor: "#9d25b8",
                            boxShadow: "0 4px 12px rgba(157,37,184,0.25)",
                            transition: "0.2s",

                            "&:hover": {
                                bgcolor: "#7b1fa2",
                                transform: "translateY(-1px)",
                                boxShadow: "0 6px 16px rgba(157,37,184,0.35)"
                            }
                        }}
                    >
                        Add • ₹{selectedFood?.price || 0}
                    </Button>
                )}

            </Box>
        </Box>
    );
};

export default MobileFoodOrder;