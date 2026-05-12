import { Box } from "@mui/joy";
import React, { memo, useEffect } from "react";
import TextComponent from "./TextComponent";
import { useAllOrderPartyType } from "../CommonData/UseQuery";

const PatientBystanderToggle = ({ selected, setSelected }) => {



    const { data: allPartyType = [] } = useAllOrderPartyType();

    // filter only required types
    const filteredTypes = allPartyType?.filter(
        item =>
            item.is_active === 1 &&
            (item.party_name === "PATIENT" || item.party_name === "BYSTANDER")
    );

    useEffect(() => {
        if (allPartyType?.length && !selected) {
            const patient = allPartyType.find(
                item => item.party_name === "PATIENT"
            );
            if (patient) {
                setSelected(patient);
            }
        }
    }, [allPartyType, selected]);
    return (
        <Box
            sx={{
                width: "100%",
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
            }}
        >
            {filteredTypes?.map((item) => {

                const isActive = selected?.party_type_id === item.party_type_id;

                return (
                    <Box
                        key={item.party_type_id}
                        onClick={() => setSelected(item)}
                        sx={{
                            width: "45%",
                            height: 32,
                            borderRadius: 10,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: isActive ? "#9d25b8" : "#c2bfbf",
                            borderLeft: isActive ? "3px solid black" : "3px solid #9d25b8",
                            borderRight: isActive ? "3px solid black" : "3px solid #9d25b8",
                        }}
                    >
                        <TextComponent
                            color={isActive ? "#ffffff" : "#030303"}
                            value={item.party_name}
                            size={10}
                            weight={800}
                        />
                    </Box>
                );
            })}
        </Box>
    );
};

export default memo(PatientBystanderToggle);