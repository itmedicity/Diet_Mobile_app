import React, { memo } from "react";
import { Box } from "@mui/joy";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import TextComponent from "./TextComponent";

const TABS = [
  {
    label: "HOME",
    value: "home",
    icon: HomeRoundedIcon,
    activeColor: "#9d25b8",
  },
  {
    label: "DELIVERY",
    value: "delivery",
    icon: LocalShippingRoundedIcon,
    activeColor: "#9d25b8",
  },
];

const BottomNavbar = ({ activeTab, setActiveTab }) => {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        bgcolor: "#ffffff",
        borderTop: "1px solid #e5e5e5",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.value;
        const IconComponent = tab.icon;

        return (
          <Box
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <IconComponent
              sx={{
                fontSize: 24,
                color: isActive ? tab.activeColor : "#777",
              }}
            />

            <TextComponent
              noWrap
              color={isActive ? tab.activeColor : "#777"}
              value={tab.label}
              size={10}
              weight={600}
            />
          </Box>
        );
      })}
    </Box>
  );
};

export default memo(BottomNavbar);