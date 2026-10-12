import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import LoginEmployeeHeader from "../../components/LoginEmployeeHeader";
import { Box } from "@mui/joy";
import SearchComponent from "../../components/SearchComponent";
import DeliveryPatientCardList from "../PatientDeliveryMarking/DeliveryPatientCardList";
import { EmpauthId, errorNofity, succesNofity, warningNofity } from "../Constant/Constant";
import { useAllAssingedDeliveryItem } from "../../CommonData/UseQuery";
import DeliveryStatusFilter from "./DeliveryStatusFilter";
import DeliveryBulkAction from "./DeliveryMarkingComponent/DeliveryBulkAction";
import { axioslogin } from "../../Axios/axios";
import { COLORS, FONT } from "../../Style/designTokens";

const Delivery = () => {

    const id = EmpauthId();
    const {
        data: DeliveryDetail = [],
        refetch: FetchDeliveryDetails
    } = useAllAssingedDeliveryItem(id);

    const [seachVal, setSearchVal] = useState("");
    const [selectionMode] = useState(true);
    const [selectedItems, setSelectedItems] = useState([]);
    const [picking, setPicking] = useState(false);

    // LOAD INITIAL VALUE FROM LOCAL STORAGE
    const [deliveryStatus, setDeliveryStatus] = useState(() => {
        try {
            return localStorage.getItem("delivery_filter") || "";
        } catch (e) {
            return "";
        }
    });

    // SAVE WHEN STATUS CHANGES
    useEffect(() => {
        try {
            localStorage.setItem("delivery_filter", deliveryStatus);
        } catch (e) {
            // private window / blocked storage: the filter just is not remembered
        }
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

    // orders that match the search (the status chips count within these)
    const searched = useMemo(() => {
        const search = seachVal.toLowerCase();
        return (DeliveryDetail || []).filter(item =>
            !search ||
            item?.fb_ptc_name?.toLowerCase().includes(search) ||
            item?.fb_pt_no?.toString().toLowerCase().includes(search) ||
            item?.fb_bdc_no?.toString().toLowerCase().includes(search)
        );
    }, [DeliveryDetail, seachVal]);

    const counts = useMemo(() => {
        return searched.reduce((all, item) => {
            all[item?.ItemStatus] = (all[item?.ItemStatus] || 0) + 1;
            return all;
        }, {});
    }, [searched]);

    const filteredData = useMemo(
        () => searched.filter(item => !deliveryStatus || item.ItemStatus === deliveryStatus),
        [searched, deliveryStatus]
    );

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
        // ignore extra taps while the request is running
        if (picking) return;
        try {
            setPicking(true);
            const response = await axioslogin.post('/dietdelivery/update-bulk-pickup', {
                Items: selectedItems
            });
            const { success, message } = response?.data ?? {};
            if (success !== 1) return warningNofity(message || "Error in Picking Up Details");
            succesNofity(message || "SuccessFully PickedUp Details!!")
            FetchDeliveryDetails()
            // an empty list, not undefined (later selecting an order did prev.some on undefined)
            setSelectedItems([])
        } catch (error) {
            errorNofity("Error in PickingUp Details!")
        } finally {
            setPicking(false);
        }
    }, [selectedItems, picking, FetchDeliveryDetails]);

    return (
        <Box sx={{ width: "100%", minHeight: "100dvh", bgcolor: COLORS.surface }}>
            <LoginEmployeeHeader />
            <SearchComponent
                value={seachVal}
                onChange={setSearchVal}
                placeholder="Search patient, UHID or bed"
                selectionMode={selectionMode}
                allSelected={allSelected}
                onToggleSelectAll={handleToggleSelectAll}
            />

            <Box sx={{ width: "100%", maxWidth: 560, mx: "auto", mt: 8, pb: selectedItems?.length ? 14 : 3 }}>
                <DeliveryStatusFilter
                    value={deliveryStatus}
                    onChange={setDeliveryStatus}
                    counts={counts}
                    total={searched.length}
                />

                <DeliveryPatientCardList
                    filterdData={filteredData}
                    selectionMode={selectionMode}
                    selectedItems={selectedItems}
                    onToggleSelect={handleToggleSelect}
                />

                {!filteredData.length && (
                    <Box sx={{ px: 3, py: 6, fontFamily: FONT, fontSize: 16, lineHeight: 1.5, color: COLORS.muted }}>
                        {DeliveryDetail.length
                            ? "No orders match this search or status. Clear the search or choose All."
                            : "No orders are assigned to you yet."}
                    </Box>
                )}
            </Box>

            <DeliveryBulkAction
                selectedCount={selectedItems?.length}
                onAction={handlePickupOrders}
                loading={picking}
            />
        </Box>
    );
};

export default memo(Delivery);
