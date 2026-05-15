import React, { memo, useMemo, useState } from "react";
import LoginEmployeeHeader from "../../components/LoginEmployeeHeader";
import { Box } from "@mui/joy";
import SearchComponent from "../../components/SearchComponent";
import DeliveryPatientCardList from "../PatientDeliveryMarking/DeliveryPatientCardList";
import { groupByPatient } from "../../CommonData/Common";
import { EmpauthId } from "../Constant/Constant";
import { useAllAssingedDeliveryItem, useAllDietDeliveryDetails } from "../../CommonData/UseQuery";
import DeliveryStatusFilter from "./DeliveryStatusFilter";

const Delivery = () => {

    const id = EmpauthId();
    const {
        data: DeliveryDetail = [],
    } = useAllAssingedDeliveryItem(id);

    const [seachVal, setSearchVal] = useState("");

    const [deliveryStatus, setDeliveryStatus] = useState("");


    const filteredData = DeliveryDetail?.filter(item =>
        !deliveryStatus ||
        item.ItemStatus === deliveryStatus
    );

    return (
        <Box sx={{ width: "100%" }}>
            <LoginEmployeeHeader />
            <SearchComponent value={seachVal} onChange={setSearchVal} />
            <DeliveryStatusFilter
                value={deliveryStatus}
                onChange={setDeliveryStatus}
            />
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
                <DeliveryPatientCardList
                    filterdData={filteredData}

                />
            </Box>

        </Box>
    );
};

export default memo(Delivery);