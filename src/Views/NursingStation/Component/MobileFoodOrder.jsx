import React, { useMemo, useState, useCallback } from "react";
import { Box } from "@mui/joy";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import {
    useAllFoodAndBeverage,
    useAllPatientPreviousOrders,
    usePatientExtraOrders
} from "../../../CommonData/UseQuery";
import FoodSuggestionItem from "./FoodSuggestionItem";
import { getFoodPrice } from "../../Constant/Common";
import { infoNofity, warningNofity } from "../../Constant/Constant";
import { groupPreviousOrder } from "../../../CommonData/Common";
import ChooseDietType from "../../../SelectComponents/ChooseDietType";
import { COLORS, FONT, focusRing } from "../../../Style/designTokens";

const MobileFoodOrder = ({
    personType,
    setItems,
    fullDetail,
    setSelectedFood,
    selectedFood,
    PreviousOrders
}) => {



    const [query, setQuery] = useState("");
    const [activeIndex] = useState(-1);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [qty, setQty] = useState(1);
    const [type_slno, setDietType] = useState(0);
    const [, setTypeName] = useState("")

    const { data: ExistFoodDetail = [] } = useAllFoodAndBeverage(query.length > 0);


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

        if (!type_slno) {
            setSelectedFood({})
            return warningNofity("Please Select Meal !");

        }
        if (!selectedFood?.item_id) return;

        const IsAlreadyItemInPending = PendingOrderItems?.some(
            item => item.item_id === selectedFood.item_id &&
                Number(item?.type_slno) === Number(type_slno)
        );

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

    // type_slno and PendingOrderItems are used above, so they must be dependencies - otherwise
    // choosing the meal AFTER the food kept the old meal (0) and cleared the selected food
    }, [selectedFood, qty, personType, setItems, setSelectedFood, type_slno, PendingOrderItems]);

    const hasSelection = selectedFood && Object.keys(selectedFood).length > 0;

    return (
        <Box sx={{ fontFamily: FONT }}>

            <ChooseDietType value={type_slno} setValue={setDietType} setName={setTypeName} />

            <Box component="label" htmlFor="extra-food-search"
                sx={{ display: "block", mt: 2, mb: 0.75, fontSize: 15, fontWeight: 600, color: COLORS.ink }}>
                Food
            </Box>

            <Box sx={{ position: "relative" }}>
                <SearchRoundedIcon
                    aria-hidden="true"
                    sx={{ position: "absolute", left: 12, top: 14, fontSize: 20, color: COLORS.muted }}
                />
                <Box
                    component="input"
                    id="extra-food-search"
                    type="search"
                    placeholder="Search food name or code"
                    value={query}
                    autoComplete="off"
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    sx={{
                        boxSizing: "border-box", width: "100%", height: 48, pl: 5, pr: 1.5,
                        fontFamily: FONT, fontSize: 16, color: COLORS.ink,
                        bgcolor: COLORS.surface, border: `1.5px solid ${COLORS.fieldBorder}`,
                        borderRadius: "12px", outline: "none",
                        "&:focus": { borderColor: COLORS.plum, boxShadow: `0 0 0 3px ${COLORS.orchid}` },
                    }}
                />
            </Box>

            {/* matching foods */}
            {showSuggestions && (
                <FoodSuggestionItem
                    suggestions={filteredSuggestions}
                    onSelect={handleSelectFood}
                    activeIndex={activeIndex}
                    personType={personType}
                />
            )}

            {/* add the chosen food to the basket */}
            {hasSelection && (
                <Box
                    component="button"
                    type="button"
                    onClick={handleAddToCart}
                    sx={{
                        mt: 2, width: "100%", height: 52, border: 0, borderRadius: "14px", cursor: "pointer",
                        bgcolor: COLORS.plum, color: COLORS.white, fontFamily: FONT, fontSize: 17, fontWeight: 700,
                        "&:active": { bgcolor: COLORS.plumDark },
                        ...focusRing,
                    }}
                >
                    {`Add to order  ·  ₹${selectedFood?.price || 0}`}
                </Box>
            )}
        </Box>
    );
};

export default MobileFoodOrder;
