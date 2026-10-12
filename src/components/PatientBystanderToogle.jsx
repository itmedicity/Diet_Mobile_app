import { Box } from "@mui/joy";
import React, { memo, useEffect } from "react";
import { useAllOrderPartyType } from "../CommonData/UseQuery";
import { COLORS, FONT, focusRing } from "../Style/designTokens";

// "PATIENT" -> "Patient"
const titleCase = (text = "") => text.charAt(0) + text.slice(1).toLowerCase();

// Who the order is for: a two-way switch
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
    }, [allPartyType, selected, setSelected]);

    return (
        <Box
            role="radiogroup"
            aria-label="Order for"
            sx={{
                display: "flex", p: 0.5, gap: 0.5, borderRadius: "14px", bgcolor: COLORS.wash, fontFamily: FONT,
            }}
        >
            {filteredTypes?.map((item) => {

                const isActive = selected?.party_type_id === item.party_type_id;

                return (
                    <Box
                        key={item.party_type_id}
                        component="button"
                        type="button"
                        role="radio"
                        aria-checked={isActive}
                        onClick={() => setSelected(item)}
                        sx={{
                            flex: 1, height: 44, border: 0, borderRadius: "10px", cursor: "pointer",
                            fontFamily: FONT, fontSize: 16, fontWeight: 700,
                            bgcolor: isActive ? COLORS.plum : "transparent",
                            color: isActive ? COLORS.white : COLORS.plum,
                            ...focusRing,
                        }}
                    >
                        {titleCase(item.party_name)}
                    </Box>
                );
            })}
        </Box>
    );
};

export default memo(PatientBystanderToggle);
