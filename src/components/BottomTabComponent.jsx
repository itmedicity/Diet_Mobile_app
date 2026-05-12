import React, { memo } from "react";
import { Box } from "@mui/joy";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import FormatListBulletedRoundedIcon from "@mui/icons-material/FormatListBulletedRounded";

const BottomTabComponent = ({ activeTab, onClickTab }) => {
  const tabs = [
    { value: "view", icon: <VisibilityRoundedIcon sx={{ fontSize: 22 }} /> },
    { value: "list", icon: <FormatListBulletedRoundedIcon sx={{ fontSize: 22 }} /> },
  ];

  const activeIndex = tabs.findIndex((t) => t.value === activeTab);

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        width: "88%",
        maxWidth: 360,
        height: 54,
        borderRadius: 30,
        bgcolor: "#fff",
        border: "1.5px solid #9d25b8",
        boxShadow:
          "0 10px 25px rgba(0,0,0,0.08), 0 4px 10px rgba(157,37,184,0.08)",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        zIndex: 1000,
      }}
    >
      {/*  Active Indicator */}
      {activeIndex !== -1 && (
        <Box
          sx={{
            position: "absolute",
            height: 40,
            width: "50%",
            borderRadius: 25,
            background: "linear-gradient(135deg, #9d25b8, #c158dc)",
            top: "50%",
            left: `${activeIndex * 50}%`,
            transform: "translateY(-50%)",
            transition: "all 0.3s ease",
          }}
        />
      )}

      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;

        return (
          <Box
            key={tab.value}
            onClick={() => onClickTab(tab.value)}
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              zIndex: 2,
              color: isActive ? "#fff" : "#9d25b8",
              transition: "0.3s",
              "&:active": {
                transform: "scale(0.92)",
              },
            }}
          >
            {tab.icon}
          </Box>
        );
      })}
    </Box>
  );
};

export default memo(BottomTabComponent);