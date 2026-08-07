import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import LoginEmployeeHeader from "../../components/LoginEmployeeHeader";
import { Box } from "@mui/joy";
import SearchComponent from "../../components/SearchComponent";
import DeliveryPatientCardList from "../PatientDeliveryMarking/DeliveryPatientCardList";
import { groupByPatient } from "../../CommonData/Common";
import { EmpauthId, errorNofity, succesNofity, warningNofity } from "../Constant/Constant";
import { useAllAssingedDeliveryItem, useAllDietDeliveryDetails } from "../../CommonData/UseQuery";
import DeliveryStatusFilter from "./DeliveryStatusFilter";
import DeliveryBulkAction from "./DeliveryMarkingComponent/DeliveryBulkAction";
import { axioslogin } from "../../Axios/axios";

const Delivery = () => {

    const id = EmpauthId();
    const {
        data: DeliveryDetail = [],
        refetch: FetchDeliveryDetails
    } = useAllAssingedDeliveryItem(id);

    

    const [seachVal, setSearchVal] = useState("");
    const [selectionMode, setSelectionMode] = useState(true);
    const [selectedItems, setSelectedItems] = useState([]);

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


    const handleToggleSelect = (item) => {
        setSelectedItems(prev => {
            const exists = prev.some(
                x =>
                    x.canteen_order_id === item.canteen_order_id &&
                    x.type_slno === item.type_slno
            );

            if (exists) {
                return prev.filter(
                    x =>
                        !(
                            x.canteen_order_id === item.canteen_order_id &&
                            x.type_slno === item.type_slno
                        )
                );
            }

            return [...prev, item];
        });
    };



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

    const pendingItems = filteredData?.filter(
        item => item?.ItemStatus === "PENDING"
    );

    const allSelected =
        pendingItems?.length > 0 &&
        selectedItems?.length === pendingItems?.length;

    const handleToggleSelectAll = () => {
        if (allSelected) {
            setSelectedItems([]);
        } else {
            setSelectedItems(pendingItems);
        }
    };


    const handlePickupOrders = useCallback(async () => {
        try {
            const response = await axioslogin.post('/dietdelivery/update-bulk-pickup', {
                Items: selectedItems
            });
            const { success, data, message } = response?.data ?? {};
            if (success !== 1) return warningNofity(message || "Error in Picking Up Details");
            succesNofity(message || "SuccessFully PickedUp Details!!")
            FetchDeliveryDetails()
            setSelectedItems()
        } catch (error) {
            errorNofity("Error in PickingUp Details!")
        }
    }, [selectedItems]);

    return (
        <Box sx={{ width: "100%" }}>
            <LoginEmployeeHeader />
            <SearchComponent
                value={seachVal}
                onChange={setSearchVal}
                selectionMode={selectionMode}
                allSelected={allSelected}
                onToggleSelectAll={handleToggleSelectAll}
            />
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
                    selectionMode={selectionMode}
                    selectedItems={selectedItems}
                    onToggleSelect={handleToggleSelect}
                />
            </Box>
            <DeliveryBulkAction
                selectedCount={selectedItems?.length}
                onAction={handlePickupOrders}
            />
        </Box>
    );
};

export default memo(Delivery);