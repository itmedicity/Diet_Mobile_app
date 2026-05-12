import React, { memo, useCallback, useMemo, useState } from "react";
import { Box } from "@mui/joy";
import { UseFoodDetail } from "../CommonData/UseQuery";
import DietButton from "./DietButton";
import FoodSuggestionItem from "./FoodSuggestionItem";
import DietInputLabel from "./DietInputLabel";
import { warningNofity } from "../Views/Constant/Constant";

const AddFoodSection = ({ onAdd }) => {
  const { data: ExistFoodDetail = [] } = UseFoodDetail();

  const [tempFood, setTempFood] = useState({
    item_id: null,
    item_name: "",
    itemtype: "",
  });

  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = useMemo(() => {
    if (!query.trim()) return [];
    return ExistFoodDetail
      .filter((item) =>
        item.item_name.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 8);
  }, [query, ExistFoodDetail]);

  const handleSelectFood = useCallback((food) => {
    setTempFood({
      item_id: food.item_slno,
      item_name: food.item_name,
      itemtype: food.group_name,
    });

    setQuery(food.item_name);
    setShowSuggestions(false);
  }, []);

  const handleAddFood = () => {
    if (!tempFood.item_id) {
      warningNofity("Please Select Item From List");
      return;
    }

    onAdd?.(tempFood);

    setTempFood({
      item_id: null,
      item_name: "",
      itemtype: "",
    });

    setQuery("");
  };

  const handleFoodChange = (e) => {
    const value = e.target.value;

    setTempFood({
      item_id: null,
      item_name: value,
      itemtype: "",
    });

    setQuery(value);
    setShowSuggestions(Boolean(value.trim()));
  };

  return (
    <Box sx={{ mt: 2, display: 'flex', width: '100%', boxSizing: "border-box", gap: 1 }}>
      <Box sx={{ mb: 1, width: '100%', boxSizing: "border-box", }}>
        {/* <DietInputLabel name="Select Item" /> */}

        <Box sx={{ position: "relative" }}>
          <input
            placeholder="Search food Item"
            value={query}
            onChange={handleFoodChange}
            onFocus={() => query && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            className="qty-input"
            style={{
              width: "100%",
              boxSizing: "border-box",
              fontSize:'12px',
              padding:'1px 5px'
            }}
          />

          {showSuggestions && (
            <Box
              sx={{
                position: "absolute",
                top: "110%",
                left: 0,
                right: 0,
                bgcolor: "#fff",
                boxShadow: "md",
                zIndex: 10,
              }}
            >
              <FoodSuggestionItem
                suggestions={filteredSuggestions}
                onSelect={handleSelectFood}
              />
            </Box>
          )}
        </Box>
      </Box>

      <DietButton width={40} name="Add" onClick={handleAddFood} />
    </Box>
  );
};

export default memo(AddFoodSection);



// use if needed

//       {/* <Box sx={{ mb: 1 }}>
//         <DietInputLabel name="Measurement" />
//         <ChooseDietMeasurementSelect
//           value={tempFood?.measure || ""}
//           setValue={(v) =>
//             setTempFood((p) => ({ ...p, measure: v }))
//           }
//         />
//       </Box>


//       <Box sx={{ mb: 1 }}>
//         <DietInputLabel name="Quantity" />
//         <input
//           className="qty-input"
//           type="number"
//           value={tempFood?.qty || ""}
//           onChange={(e) =>
//             setTempFood((p) => ({ ...p, qty: e.target.value }))
//           }
//         />
//       </Box> */}