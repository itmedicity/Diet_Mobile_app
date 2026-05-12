import React from "react";
import { Box } from "@mui/joy";

const options = [
  { id: 0, label: "All" },
  { id: 1, label: "Special Meal" },
  { id: 2, label: "Most Ordered" },
  { id: 3, label: "Meals" },
  { id: 4, label: "Beverage" },
  { id: 5, label: "Veg" },
  { id: 6, label: "Non-Veg" },
];

const SpecialMealSelectScollBox = ({
  selectedFilter,
  setSelectedFilter,
}) => {
  const handleSelect = (item) => {
    setSelectedFilter(item.label); //  send label to parent
  };

  return (
    <Box
      sx={{
        width: "95%",
        display: "flex",
        gap: 1,
        overflowX: "auto",
        whiteSpace: "nowrap",
        p: 1,
        mt: 1,
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      {options.map((item) => {
        const isSelected = selectedFilter === item.label;

        return (
          <Box
            key={item.id}
            onClick={() => handleSelect(item)}
            sx={{
              fontSize: 11,
              fontWeight: 600,
              borderRadius: "20px",
              cursor: "pointer",
              px: 2,
              py: 0.6,
              transition: "0.2s ease",

              backgroundColor: isSelected
                ? "#9d25b8"
                : "transparent",

              color: isSelected ? "#fff" : "#555",

              border: isSelected
                ? "1px solid #9d25b8"
                : "1px solid #ddd",

              "&:hover": {
                backgroundColor: isSelected
                  ? "#8a1fa3"
                  : "#f3f3f3",
              },
            }}
          >
            {item.label}
          </Box>
        );
      })}
    </Box>
  );
};

export default SpecialMealSelectScollBox;