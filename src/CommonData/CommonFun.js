
import JSZip from "jszip";
import { axioslogin } from "../Axios/axios";
import { warningNofity } from "../Views/Constant/Constant";


export const DietFoodFetching = async () => {
    try {
        const result = await axioslogin.get('/kotitem/get/kotitem')
        const { success, data } = result.data
        if (success === 1 && Array.isArray(data) && data.length > 0) {
            return data;
        }
        return [];
    } catch (error) {
        console.error("Error In Fetching Detail:", error?.message || error);
        return [];
    }
};



export const DietItemType = async () => {
    try {
        const result = await axioslogin.get('/itemgrp/getitem')
        const { success, data } = result.data
        if (success === 1 && Array.isArray(data) && data.length > 0) {
            return data;
        }
        return [];
    } catch (error) {
        console.error("Error In Fetching Item Type Detail:", error?.message || error);
        return [];
    }
};



export const GetAllRoomTypeDetail = async () => {
    try {
        const result = await axioslogin.get('/kotitem/room/getallroomtype')
        const { success, data } = result.data

        if (success === 1 && Array.isArray(data) && data.length > 0) {
            return data;
        }
        return [];
    } catch (error) {
        console.error("Error In Fetching Item Type Detail:", error?.message || error);
        return [];
    }
};

export const GetAllDietRoomCategoryDetail = async () => {
    try {
        const result = await axioslogin.get('/kotitem/getalldietroom')
        const { success, data } = result.data

        if (success === 1 && Array.isArray(data) && data.length > 0) {
            return data;
        }
        return [];
    } catch (error) {
        console.error("Error In Fetching Item Type Detail:", error?.message || error);
        return [];
    }
};



export const getAllDietTime = async () => {
    try {
        const result = await axioslogin.get('/ratelist/diettype')
        const { success, data } = result.data

        if (success === 1 && Array.isArray(data) && data.length > 0) {
            return data;
        }
        return [];
    } catch (error) {
        console.error("Error In Fetching Item Type Detail:", error?.message || error);
        return [];
    }
};


// export const getAllDietItems = async () => {
//     try {
//         const result = await axioslogin.get(`/dietmenudtl/item/${group}`)
//         const { success, data } = result.data

//         if (success === 1 && Array.isArray(data) && data.length > 0) {
//             return data;
//         }
//         return [];
//     } catch (error) {
//         console.error("Error In Fetching Item Type Detail:", error?.message || error);
//         return [];
//     }
// };




export const getDietName = async () => {
    try {
        const result = await axioslogin.get('/ratelist/diet')
        const { success, data } = result.data
        if (success === 1) {
            return data;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error In Fetching Diets:", error?.message || error);
        return [];
    }

}

export const getDietDeliveryTime = async () => {
    try {
        const result = await axioslogin.get('/kotitem/getalldietdelivery')
        const { success, data } = result.data
        if (success === 1) {
            return data;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error In Fetching Diets:", error?.message || error);
        return [];
    }

}


export const getallNurseStationMaster = async () => {
    try {
        const res = await axioslogin.get('/feedback/getallnursestation');
        const { success, data } = res.data;

        if (success === 0) {
            // No data found
            return [];
        }

        if (success === 2) {
            return data || [];
        }

        // fallback for any other success code
        return [];
    } catch (error) {
        console.error("Error fetching all nurse stations:", error);
        return [];
    }
};




export const getallNurseStationBedDetail = async (code) => {
    if (!code) return;
    try {
        const res = await axioslogin.post('/kotitem/getnsbeds', {
            NS_CODE: code
        });
        const { success, data } = res.data;

        if (success === 1) {
            // No data found
            return [];
        }

        if (success === 2) {
            return data || [];
        }

        // fallback for any other success code
        return [];
    } catch (error) {
        console.error("Error fetching all nurse stations Bed Detail:", error);
        return [];
    }
};


export const getAllEmployyeName = async () => {
    try {
        const res = await axioslogin.get('/common/empname');
        const { success, data } = res.data;

        if (success === 0) {
            // No data found
            return [];
        }

        if (success === 1) {
            return data || [];
        }

        // fallback for any other success code
        return [];
    } catch (error) {
        console.error("Error fetching all nurse stations Bed Detail:", error);
        return [];
    }
};



export const getLoggedEmpDetail = async (id) => {
    const result = await axioslogin.get(`/feedback/getempdetail/${id}`);
    const { data, success } = result.data;
    if (success === 1) return warningNofity("Error in fetching Data");
    return data ? data : [];
}




export const normalizeFloor = (name = "") => name?.trim().replace(/\s+/g, " ");


export const getAllPatientDietPlan = async (nscode) => {
    if (!nscode) return warningNofity("Nursing Station Id Missing");
    try {
        const res = await axioslogin.post('/patientdietplan/activepatient', {
            ns_code: nscode
        });
        const { success, data } = res.data;
        if (success === 1) {
            return [];
        }
        if (success === 2) {
            return data || [];
        }
        // fallback for any other success code
        return [];
    } catch (error) {
        console.error("Error In getting All Patient Diet Plan:", error?.message || error);
        return [];
    }
};


export const getAllTemplateFoodDetail = async (template_id, typeIds) => {
    if (!template_id) return warningNofity("Template Id Missing");
    if (!typeIds || typeIds?.length === 0) return warningNofity("Type Id is Missing");
    try {
        const res = await axioslogin.post('/patientdietplan/gettodaytemplatedtl', {
            template_id: template_id,
            typeIds: typeIds
        });
        const { success, data } = res.data;
        if (success === 1) {
            return [];
        }
        if (success === 2) {
            return data || [];
        }
        // fallback for any other success code
        return [];
    } catch (error) {
        console.error("Error In getting All Patient Diet Plan:", error?.message || error);
        return [];
    }
};


export const getAllPatientOrderDetail = async (patient_id) => {
    if (!patient_id) return warningNofity("Patient Id Missing");
    try {
        const res = await axioslogin.post('/fooddietorder/getallpatientorders', {
            patient_id: patient_id
        });
        const { success, data } = res.data;
        if (success === 2) return [];

        if (success === 1) return data || [];

        // fallback for any other success code
        return [];
    } catch (error) {
        console.error("Error In getting All Patient Diet Plan:", error?.message || error);
        return [];
    }
};



export const getCustomerPreviousOrder = async (admission_Id, party_type_id) => {

    if (!admission_Id || !party_type_id) return warningNofity("Required Id is Missings");
    try {
        const res = await axioslogin.post('/canteenorder/previouscanteenorder', {
            admission_Id: admission_Id,
            party_type_id: party_type_id
        });
        const { success, data } = res.data;

        if (success === 1) {
            return data ?? [];
        }
        // fallback for any other success code
        return [];
    } catch (error) {
        console.error("Error In Fetching Canteen Foods", error?.message || error);
        return [];
    }
};

export const getPatienPlanFoodDetail = async (plan_id) => {
    if (!plan_id) return warningNofity("Patient Id Missing");
    try {
        const res = await axioslogin.post('/dietschedule/schedule/processfood', {
            plan_id: plan_id
        });
        const { success, data } = res.data;

        if (success === 2) return data || [];

        // fallback for any other success code
        return [];
    } catch (error) {
        console.error("Error In getting All Patient Diet Plan:", error?.message || error);
        return [];
    }
};


export const getAllOrderPartyType = async () => {
    try {
        const res = await axioslogin.get('/orderparty/getallordertype');
        const { success, data, message } = res.data;
        if (success === 0) {
            console.error("Error fetching Order Type:", message);
            return [];
        }
        if (success === 1) {
            return [];
        }

        if (success === 2) {
            return data || [];
        }

        // Fallback for any unexpected success code
        return [];
    } catch (error) {
        console.error("Error fetching Order Type:", error);
        return [];
    }
};

export const getAllDietDeliveryDetail = async (emid) => {
    if (!emid) return warningNofity("Employee Id Missing");
    try {
        const res = await axioslogin.post('/fooddietorder/getdelivery', {
            collected_by: emid
        });
        const { success, data } = res.data;
        if (success === 2) return [];

        if (success === 1) return data || [];

        // fallback for any other success code
        return [];
    } catch (error) {
        console.error("Error In getting All Patient Diet Delivery Detail:", error?.message || error);
        return [];
    }
};



export const getAllEmployeeDeliveryDetail = async (emid) => {
    if (!emid) return warningNofity("Employee Id Missing");
    try {
        const res = await axioslogin.post('/dietdelivery/fetchbyassigny', {
            assign_to: emid
        });
        const { success, data, message } = res.data;
        if (success === 0) {
            console.error("Error in Fetching Api", message)
            return []
        }
        if (success === 1) return data || [];

        // fallback for any other success code
        return [];
    } catch (error) {
        console.error("Error In getting All Patient Diet Delivery Detail:", error?.message || error);
        return [];
    }
};


export const getAssingItemStatusDetail = async (emid, assign_id) => {
    if (!emid) return warningNofity("Employee Id Missing");
    if (!assign_id) return warningNofity("Assign Id Missing");
    try {
        const res = await axioslogin.post('/dietdelivery/fetchassigny-item-status', {
            assign_to: emid,
            assignment_id: assign_id
        });
        const { success, data, message } = res.data;
        if (success === 0) {
            console.error("Error in Fetching Api", message)
            return []
        }
        if (success === 1) return data || [];

        // fallback for any other success code
        return [];
    } catch (error) {
        console.error("Error In getting All Patient Diet Delivery Detail:", error?.message || error);
        return [];
    }
};


export const getAllItemDeliveryStatus = async (canteen_order_id, type_slno) => {
    if (!canteen_order_id) return warningNofity("Employee Id Missing");
    if (!type_slno) return warningNofity("Assign Id Missing");
    try {
        const res = await axioslogin.post('/dietdelivery/fetch-delivery-log', {
            canteen_order_id: canteen_order_id,
            type_slno: type_slno
        });
        const { success, data, message } = res.data;
        if (success === 0) {
            console.error("Error in Fetching Api", message)
            return []
        }
        if (success === 1) return data || [];

        // fallback for any other success code
        return [];
    } catch (error) {
        console.error("Error In Delivery Item Status:", error?.message || error);
        return [];
    }
};


export const getFullDetailofItem = async () => {
    try {
        const result = await axioslogin.get('/fooditemmast/item-full-detail')
        const { success, data } = result.data
        if (success === 2 && Array.isArray(data) && data.length > 0) {
            return data;
        }


        return [];
    } catch (error) {
        console.error("Error In Fetching Detail:", error?.message || error);
        return [];
    }
};

export const getFoodandBeverage = async () => {
    try {
        const result = await axioslogin.get('/fooditemmast/get-food-bev')
        const { success, data } = result.data
        if (success === 2 && Array.isArray(data) && data.length > 0) {
            return data;
        }


        return [];
    } catch (error) {
        console.error("Error In Fetching Detail:", error?.message || error);
        return [];
    }
};

export const getItemFileDetails = async (item_id) => {

    if (!item_id) {
        warningNofity("Item Id is Missing");
        return [];
    }

    try {
        //  IMPORTANT: get blob (ZIP)
        const res = await axioslogin.get(
            `/fooditemmast/files/${item_id}`,
            { responseType: 'blob' }
        );

        const contentType = res.headers['content-type'] || '';

        // If backend returned JSON (no files case)
        if (contentType.includes('application/json')) {
            return [];
        }

        //  Unzip
        const zip = await JSZip.loadAsync(res.data);

        const validFiles = Object.entries(zip.files).filter(
            ([filename]) => /\.(jpe?g|png|gif|pdf)$/i.test(filename)
        );

        //  Convert to usable format
        const filePromises = validFiles.map(async ([filename, fileObj]) => {

            const blobData = await fileObj.async('blob');

            let mimeType = 'application/octet-stream';
            if (filename.endsWith('.pdf')) mimeType = 'application/pdf';
            else if (filename.endsWith('.png')) mimeType = 'image/png';
            else if (/\.(jpg|jpeg)$/i.test(filename)) mimeType = 'image/jpeg';

            const blob = new Blob([blobData], { type: mimeType });
            const url = URL.createObjectURL(blob);

            return {
                name: filename,
                url,
                blob
            };
        });

        //  FINAL READY DATA
        return await Promise.all(filePromises);

    } catch (error) {
        console.error("Error fetching item files:", error);
        warningNofity("Error fetching files");
        return [];
    }
};


export const getAllPatientExtraOrdres = async (admissionId, Status) => {

    if (!admissionId) return warningNofity("Admission Id is Missings");
    if (Status === "") return warningNofity("Order Status is Missing Id is Missings");
    try {
        const res = await axioslogin.post('/patientExtraOrder/get', {
            admission_id: admissionId,
            order_status: Status
        });
        const { success, data } = res.data;

        if (success === 1) {    
            return data ?? [];
        }
        // fallback for any other success code
        return [];
    } catch (error) {
        console.error("Error In Fetching Canteen Foods", error?.message || error);
        return [];
    }
};



export const getAllOrderItemDetails = async (memoOrder) => {

    if (!memoOrder) return warningNofity("Order Id is Missings");
    try {
        const res = await axioslogin.post('/canteenorder/get', {
            canteen_order_id: memoOrder
        });
        const { success, data } = res.data;

        if (success === 1) {
            return data ?? [];
        }
        // fallback for any other success code
        return [];
    } catch (error) {
        console.error("Error In Fetching Canteen Foods", error?.message || error);
        return [];
    }
};



export const getAllHighlightTypes = async () => {
    try {
        const result = await axioslogin.get(
            '/highlight/highlight-type'
        );
        const { success, data } = result?.data;
        if (success === 1) {
            return data || [];
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error Fetching Highlight Types:", error);
        warningNofity("Error Fetching Highlight Types");
        return [];
    }
};
