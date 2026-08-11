import { useQuery } from "@tanstack/react-query";
import { DietFoodFetching, DietItemType, getAllDietDeliveryDetail, GetAllDietRoomCategoryDetail, getAllDietTime, getAllEmployeeDeliveryDetail, getAllEmployyeName, getAllHighlightTypes, getAllItemDeliveryStatus, getallNurseStationBedDetail, getallNurseStationMaster, getAllOrderItemDetails, getAllOrderPartyType, getAllPatientDietPlan, getAllPatientExtraOrdres, getAllPatientOrderDetail, GetAllRoomTypeDetail, getAllTemplateFoodDetail, getAssingItemStatusDetail, getBystanderBillingDetails, getCustomerPreviousOrder, getDeliveryBillDetails, getDietDeliveryTime, getDietName, getFoodandBeverage, getFullDetailofItem, getItemFileDetails, getPatienPlanFoodDetail, getPatientDietRemarkDetails } from "./CommonFun";


export const UseFoodDetail = () => {
    return useQuery({
        queryKey: ['getFood'],
        queryFn: () => DietFoodFetching(),
        staleTime: Infinity,
    });
};



export const UseFoodTypeDetail = () => {
    return useQuery({
        queryKey: ['itemtype'],
        queryFn: () => DietItemType(),
        staleTime: Infinity,
    });
};



export const UseRoomTypeDetail = () => {
    return useQuery({
        queryKey: ['dietroomtype'],
        queryFn: () => GetAllRoomTypeDetail(),
        staleTime: Infinity,
    });
};



export const UseRoomCategoryDetail = () => {
    return useQuery({
        queryKey: ['dietroomcat'],
        queryFn: () => GetAllDietRoomCategoryDetail(),
        staleTime: Infinity,
    });
};


export const useDietTimes = () => {
    return useQuery({
        queryKey: ['diettime'],
        queryFn: () => getAllDietTime(),
        staleTime: Infinity,
    });
};

export const useDietNames = () => {
    return useQuery({
        queryKey: ['dietname'],
        queryFn: () => getDietName(),
        staleTime: Infinity,
    });
};


export const useDietDeliveryTime = () => {
    return useQuery({
        queryKey: ['dietdeltime'],
        queryFn: () => getDietDeliveryTime(),
        staleTime: Infinity,
    });
};

export const useNursingStationMaster = () => {
    return useQuery({
        queryKey: ['getallnsmaster'],
        queryFn: getallNurseStationMaster,
        staleTime: Infinity
    });
};

export const useNursingStationBedDetail = (code) => {
    return useQuery({
        queryKey: ['getallnsbedmast', code],
        queryFn: () => getallNurseStationBedDetail(code),
        staleTime: Infinity,
        enabled: !!code
    });
};

export const useAllEmployeeFetch = () => {
    return useQuery({
        queryKey: ['allemp'],
        queryFn: getAllEmployyeName,
        staleTime: Infinity
    });
};



export const useAllPatientDietPlan = (nscode) => {
    return useQuery({
        queryKey: ['patientdietplan', nscode],
        queryFn: () => getAllPatientDietPlan(nscode),
        staleTime: Infinity,
        enabled: !!nscode
    });
};

export const useAllPateinetFoodDetail = (template_id, typeIds) => {
    return useQuery({
        queryKey: ['templatefood', template_id, typeIds],
        queryFn: () => getAllTemplateFoodDetail(template_id, typeIds),
        staleTime: Infinity,
        enabled: !!template_id && typeIds?.length > 0,
    });
};





export const useAllPatientPreviousOrders = (patient_id) => {
    return useQuery({
        queryKey: ['patientOrder', patient_id],
        queryFn: () => getAllPatientOrderDetail(patient_id),
        staleTime: Infinity,
        enabled: !!patient_id
    });
};



export const useCustomerPreviousCanteenOrder = (admission_id, personType) => {
    return useQuery({
        queryKey: ['customerorder', admission_id, personType],
        queryFn: () => getCustomerPreviousOrder(admission_id, personType),
        staleTime: Infinity,
        enabled: !!admission_id && !!personType
    });
};


export const usePatientPlanFoodDetails = (plan_id) => {
    return useQuery({
        queryKey: ['patientOrder', plan_id],
        queryFn: () => getPatienPlanFoodDetail(plan_id),
        staleTime: Infinity,
        enabled: !!plan_id
    });
};


export const useAllDietDeliveryDetails = (emid) => {
    return useQuery({
        queryKey: ['dietdeliery', emid],
        queryFn: () => getAllDietDeliveryDetail(emid),
        staleTime: Infinity,
        enabled: !!emid
    });
};

export const useAllAssingedDeliveryItem = (emid) => {
    return useQuery({
        queryKey: ['assigneditem', emid],
        queryFn: () => getAllEmployeeDeliveryDetail(emid),
        staleTime: Infinity,
        enabled: !!emid
    });
};


export const useAllAssignedItemStatus = (emid, assign_id) => {
    return useQuery({
        queryKey: ['assigneditemstatus', emid, assign_id],
        queryFn: () => getAssingItemStatusDetail(emid, assign_id),
        staleTime: Infinity,
        enabled: !!emid && !!assign_id
    });
};



export const useAllItemDeliveryStatus = (canteen_order_id, type_slno) => {
    return useQuery({
        queryKey: ['delivery-status', canteen_order_id, type_slno],
        queryFn: () => getAllItemDeliveryStatus(canteen_order_id, type_slno),
        staleTime: Infinity,
        enabled: !!canteen_order_id && !!type_slno
    });
};


export const useItemFullDetials = (enabled) => {
    return useQuery({
        queryKey: ['itemfulldetail'],
        queryFn: getFullDetailofItem,
        enabled: enabled,
        staleTime: Infinity,
        select: (data) => {
            return data?.filter((val) =>
                (Number(val?.item_type_id) === 1 || Number(val?.item_type_id) === 3) &&
                Number(val?.is_active) === 1
            )
        }
    })
}


export const useAllFoodAndBeverage = (enabled) => {
    return useQuery({
        queryKey: ['food-bev'],
        queryFn: getFoodandBeverage,
        enabled: enabled,
        staleTime: Infinity,
        select: (data) => {
            return data?.filter((val) =>
                (Number(val?.item_type_id) === 1 || Number(val?.item_type_id) === 3) &&
                Number(val?.is_active) === 1
            )
        }
    })
}



export const useAllOrderPartyType = () => {
    return useQuery({
        queryKey: ['orderparty'],
        queryFn: getAllOrderPartyType,
        staleTime: Infinity
    });
};


export const useFetchItemFiles = (item_id) => {
    return useQuery({
        queryKey: ['itemfiles', item_id],
        queryFn: () => getItemFileDetails(item_id),
        staleTime: Infinity,
        enabled: !!item_id
    });
};


export const usePatientExtraOrders = (ptId, Status) => {
    return useQuery({
        queryKey: ['ptextraorder', ptId, Status],
        queryFn: () => getAllPatientExtraOrdres(ptId, Status),
        staleTime: Infinity,
        enabled: !!ptId && !!Status
    });
};



export const useOrderItemDetail = (memoOrder) => {
    return useQuery({
        queryKey: ['canteenorders', memoOrder],
        queryFn: () => getAllOrderItemDetails(memoOrder),
        staleTime: Infinity,
        enabled: !!memoOrder
    });
};



export const useAllHighlightMaster = () => {
    return useQuery({
        queryKey: ['highlights'],
        queryFn: getAllHighlightTypes,
        staleTime: Infinity,
    });
};


export const useBystanderBillingDetails = (assignment_detail_id) => {
    return useQuery({
        queryKey: ["bystanderbilling", assignment_detail_id],
        queryFn: () => getBystanderBillingDetails(assignment_detail_id),
        staleTime: Infinity,
        enabled: !!assignment_detail_id
    });
};


export const useDeliveryBillDetails = (DeliveredItemDetail = []) => {
    return useQuery({
        queryKey: [
            "deliveryBillDetails",
            DeliveredItemDetail
        ],
        queryFn: () =>
            getDeliveryBillDetails(
                DeliveredItemDetail
            ),
        staleTime: Infinity,
        enabled:
            Array.isArray(DeliveredItemDetail) &&
            DeliveredItemDetail.length > 0
    });

};

export const useDietPlanRemarkDetails = (plan_id) => {
    return useQuery({
        queryKey: ["plan-remarks", plan_id],
        queryFn: () => getPatientDietRemarkDetails(plan_id),
        staleTime: Infinity,
        enabled: !!plan_id
    });
};

