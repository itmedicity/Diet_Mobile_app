import React, { memo } from "react";
import { Box } from "@mui/joy";
import { useAllHighlightMaster } from "../CommonData/UseQuery";
import { COLORS, FONT, focusRing } from "../Style/designTokens";

// Filter chips for the bystander food list (All, then each highlight group)
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
      highlight_name: "All",
    },
    ...allHighlights,
  ];

  const handleSelect = (item) => {
    setSelectedFilter(item.highlight_type_id);
  };

  return (
    <Box
      role="group"
      aria-label="Filter foods"
      sx={{
        display: "flex",
        gap: 1,
        overflowX: "auto",
        py: 1,
        mt: 0.5,
        "&::-webkit-scrollbar": { display: "none" },
        scrollbarWidth: "none",
      }}
    >

      {filterData?.map((item) => {

        const isSelected =
          Number(selectedFilter) === Number(item.highlight_type_id);

        return (
          <Box
            key={item.highlight_type_id}
            component="button"
            type="button"
            aria-pressed={isSelected}
            onClick={() => handleSelect(item)}
            sx={{
              flexShrink: 0,
              height: 40,
              px: 2,
              borderRadius: "20px",
              cursor: "pointer",
              whiteSpace: "nowrap",
              fontFamily: FONT,
              fontSize: 15,
              fontWeight: 600,
              bgcolor: isSelected ? COLORS.plum : COLORS.white,
              color: isSelected ? COLORS.white : COLORS.ink,
              border: `1.5px solid ${isSelected ? COLORS.plum : COLORS.fieldBorder}`,
              ...focusRing,
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
