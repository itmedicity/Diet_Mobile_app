import React, { memo, useEffect, useMemo, useState } from "react";
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

    // LOAD INITIAL VALUE FROM LOCAL STORAGE
    const [deliveryStatus, setDeliveryStatus] = useState(() => {
        return localStorage.getItem("delivery_filter") || "";
    });

    // SAVE WHEN STATUS CHANGES
    useEffect(() => {
        localStorage.setItem(
            "delivery_filter",
            deliveryStatus
        );
    }, [deliveryStatus]);



    const filteredData = DeliveryDetail?.filter(item => {
        const matchesStatus =
            !deliveryStatus ||
            item.ItemStatus === deliveryStatus;

        const search = seachVal.toLowerCase();

        const matchesSearch =
            !search ||
            item?.fb_ptc_name?.toLowerCase().includes(search) ||
            item?.fb_pt_no?.toString().toLowerCase().includes(search) ||
            item?.fb_bdc_no?.toString().toLowerCase().includes(search);

        return matchesStatus && matchesSearch;
    });



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