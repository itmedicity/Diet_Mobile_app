import React, { memo } from "react";
import { Box } from "@mui/joy";
import { useAllHighlightMaster } from "../CommonData/UseQuery";

const SpecialMealSelectScollBox = ({
  selectedFilter = 0,
  setSelectedFilter,
}) => {

  const {
    data: allHighlights = [],
  } = useAllHighlightMaster();

  // ADD DEFAULT ALL OPTION

  const filterData = [
    {
      highlight_type_id: 0,
      highlight_name: "ALL",
    },
    ...allHighlights,
  ];

  const handleSelect = (item) => {
    setSelectedFilter(item.highlight_type_id);
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

      {filterData?.map((item) => {

        const isSelected =
          Number(selectedFilter) === Number(item.highlight_type_id);

        return (
          <Box
            key={item.highlight_type_id}
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

              color: isSelected
                ? "#fff"
                : "#555",

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
            {item.highlight_name}
          </Box>
        );
      })}
    </Box>
  );
};

export default memo(SpecialMealSelectScollBox);