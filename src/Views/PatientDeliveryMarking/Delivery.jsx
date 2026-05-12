import React, { memo, useMemo, useState } from "react";
import LoginEmployeeHeader from "../../components/LoginEmployeeHeader";
import { Box } from "@mui/joy";
import SearchComponent from "../../components/SearchComponent";
import DeliveryPatientCardList from "../PatientDeliveryMarking/DeliveryPatientCardList";
import { groupByPatient } from "../../CommonData/Common";
import { EmpauthId } from "../Constant/Constant";
import { useAllDietDeliveryDetails } from "../../CommonData/UseQuery";

const Delivery = () => {

    const id = EmpauthId();
    const { data: DeliverData = [] } = useAllDietDeliveryDetails(id);


    const FinalDeliveryData = useMemo(() => {
        return groupByPatient(DeliverData);
    }, [DeliverData]);


    const [seachVal, setSearchVal] = useState("");



    return (
        <Box sx={{ width: "100%" }}>
            <LoginEmployeeHeader />
            <SearchComponent value={seachVal} onChange={setSearchVal} />
            <Box
                sx={{
                    width: "100%",
                    mt: 8,
                    minHeight: 400,
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    pb: 1,
                }}
            >
                <DeliveryPatientCardList filterdData={FinalDeliveryData} />
            </Box>

        </Box>
    );
};

export default memo(Delivery);