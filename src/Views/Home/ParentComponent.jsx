import React, { memo } from "react";
import LoginEmployeeHeader from "../../components/LoginEmployeeHeader";
import { Box } from "@mui/joy";
import NavCard from "./NavCard";
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';


const ParentComponent = () => {

  const TotalNavs = [
    { label: "Order Taking", path: '/Home', icon: CardGiftcardIcon },
    { label: "Delivery Marking", path: '/delivery', icon: DeliveryDiningIcon },


  ]


  return (
    <Box sx={{ width: "100%" }}>
      <LoginEmployeeHeader />
      <Box
        sx={{
          width: "100%",
          mt: 3,
          minHeight: 400,
          // display: "flex",
          // // alignItems: "center",
          // flexDirection: "column",
          pb: 10,
        }}
      >
        {
          TotalNavs?.map((item, index) => {
            return (
              <Box key={index}
                sx={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column'
                }}>
                <NavCard
                  label={item.label}
                  path={item.path}
                  icon={item.icon}
                />
              </Box>
            )
          })

        }
      </Box>
    </Box>
  );
};

export default memo(ParentComponent);