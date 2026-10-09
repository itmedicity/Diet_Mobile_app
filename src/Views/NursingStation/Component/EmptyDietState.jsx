import React, { memo } from "react";
import { Box } from "@mui/joy";
import NoMealsIcon from "@mui/icons-material/NoMeals";
import TextComponent from "../../../components/TextComponent";


const EmptyDietState = ({
    title = "Diet food not processed yet",
    subtitle = "No meals available for this patient currently"
}) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 5,
                px: 2,
                textAlign: "center",
                borderRadius: 12,
                bgcolor: "#fafafa",
                border: "1px dashed #d1d1d1",
                mt: 2
            }}
        >
            <NoMealsIcon
                sx={{
                    fontSize: 48,
                    color: "#9e9e9e",
                    mb: 1
                }}
            />

            <TextComponent
                value={title}
                size={15}
                weight={700}
                color="#555"
            />

            <TextComponent
                value={subtitle}
                size={12}
                weight={500}
                color="#999"
            />
        </Box>
    );
};

export default memo(EmptyDietState);