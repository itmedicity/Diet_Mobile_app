import { useMemo } from "react";
import { warningNofity } from "../Views/Constant/Constant";

export const Data = {
    "ingredients": [
        "Basmati rice",
        "Chicken",
        "Yogurt",
        "Onions",
        "Tomatoes",
        "Ginger-garlic paste",
        "Green chilies",
        "Biriyani masala",
        "Turmeric powder",
        "Red chili powder",
        "Garam masala",
        "Fresh coriander leaves",
        "Mint leaves",
        "Ghee",
        "Cooking oil",
        "Salt",
        "Whole spices (bay leaf, cloves, cardamom, cinnamon)"
    ],
    "nutrition": [
        "Calories: 450–500 kcal per serving",
        "Protein: 25–30 g",
        "Carbohydrates: 50–55 g",
        "Fat: 18–22 g",
        "Fiber: 3–4 g"
    ]
}


export const inputStyle = {
    width: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: 14,
    fontFamily: "var(--roboto-font)",
    // fontWeight: 500
};

export const DIET_ALT_COLORS = [
    { bg: '#d8d8d8', border: '#000000' }, // Black
    { bg: '#f5f2f2', border: '#8217d8' }  // Yellow
]


export const foodUnits = [
    { value: "g", label: "Gram (g)" },
    { value: "kg", label: "Kilogram (kg)" },
    { value: "mg", label: "Milligram (mg)" },

    { value: "ml", label: "Millilitre (ml)" },
    { value: "l", label: "Litre (l)" },

    { value: "pcs", label: "Pieces" },
    { value: "nos", label: "Numbers" },

    { value: "tsp", label: "Teaspoon" },
    { value: "tbsp", label: "Tablespoon" },
    { value: "cup", label: "Cup" },

    { value: "slice", label: "Slice" },
    { value: "plate", label: "Plate" },
    { value: "bowl", label: "Bowl" },

    { value: "pack", label: "Packet" },
    { value: "box", label: "Box" },

    { value: "serving", label: "Serving" }
];

export const DAYS = [
    "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday", "Sunday"
]



export const headerCell = {
    flex: 1,
    fontSize: 13,
    fontWeight: 600,
    color: '#ffffff'
}

export const bodyCell = {
    flex: 1,
    fontSize: 13,
    fontWeight: 500,
    color: '#2e2e2e'
}

export const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 12px'
}


export const PATIENT_STATUS = {
    NORMAL: 'NORMAL',
    DIET_CHANGED: 'DIET_CHANGED',
    DISCHARGED: 'DISCHARGED',
    // DECEASED: 'DECEASED'
}

export const DIET_STATUS = {
    UNCHANGED: 'UNCHANGED',
    UPDATED: 'UPDATED',
    STOPPED: 'STOPPED'
}

export const STATUS_CODES = {
    NORMAL: 'N',
    DIET_CHANGED: 'DC',
    DISCHARGED: 'D',
    // DECEASED: 'X'
}

export const PATIENT_STATUS_TO_CODE = {
    [PATIENT_STATUS.NORMAL]: STATUS_CODES.NORMAL,
    [PATIENT_STATUS.DIET_CHANGED]: STATUS_CODES.DIET_CHANGED,
    [PATIENT_STATUS.DISCHARGED]: STATUS_CODES.DISCHARGED,
    // [PATIENT_STATUS.DECEASED]: STATUS_CODES.DECEASED
}

export const getPatientStatus = (index) => {
    // if (index % 17 === 0) return PATIENT_STATUS.DECEASED
    if (index % 13 === 0) return PATIENT_STATUS.DISCHARGED
    if (index % 7 === 0) return PATIENT_STATUS.DIET_CHANGED
    return PATIENT_STATUS.NORMAL
}


export const STATUS_FILTERS = [
    { label: 'Normal', code: STATUS_CODES.NORMAL, color: 'success' },
    { label: 'Diet Updated', code: STATUS_CODES.DIET_CHANGED, color: 'warning' },
    { label: 'Discharged', code: STATUS_CODES.DISCHARGED, color: 'primary' },
    // { label: 'Deceased', code: STATUS_CODES.DECEASED, color: 'danger' }
]



export const STATUS_BORDER_COLOR = {
    [STATUS_CODES.NORMAL]: 'success',
    [STATUS_CODES.DIET_CHANGED]: 'warning',
    [STATUS_CODES.DISCHARGED]: 'primary',
    // [STATUS_CODES.DECEASED]: 'danger'
}


export const DeliveryData = Array.from({ length: 20 }).map((_, index) => {
    const bedNumber = index + 1;

    return {
        bed: `Bed-${String(bedNumber).padStart(2, "0")}`,
        ns_code: bedNumber % 2 === 0 ? "NS02" : "NS01",
        ns_name: bedNumber % 2 === 0 ? "ICU" : "General Ward",

        persons: [
            // ================= PATIENT =================
            {
                type: "patient",
                ptc_name: `Patient ${bedNumber}`,
                ptc_age: 40 + bedNumber,
                diet_name: bedNumber % 2 === 0 ? "Low Salt Diet" : "Diabetic Diet",
                mrd_no: `MRD10${bedNumber}`,
                ip_no: `IP50${bedNumber}`,

                meals: [
                    {
                        time: "Breakfast",
                        foods: [
                            { id: 1 + bedNumber, name: "Oats", qty: 1 },
                            { id: 2 + bedNumber, name: "Boiled Egg", qty: 1 }
                        ]
                    },
                    {
                        time: "Lunch",
                        foods: [
                            { id: 3 + bedNumber, name: "Rice", qty: 1 },
                            { id: 4 + bedNumber, name: "Veg Curry", qty: 1 }
                        ]
                    },
                    {
                        time: "Dinner",
                        foods: [
                            { id: 5 + bedNumber, name: "Chapati", qty: 2 }
                        ]
                    }
                ]
            },

            // ================= BYSTANDER =================
            {
                type: "bystander",
                ptc_name: `Bystander ${bedNumber}`,
                ptc_age: 25 + bedNumber,
                diet_name: "Regular Diet",
                mrd_no: null,
                ip_no: null,

                meals: [
                    {
                        time: "Breakfast",
                        foods: [
                            { id: 100 + bedNumber, name: "Idli", qty: 2 }
                        ]
                    },
                    {
                        time: "Lunch",
                        foods: [
                            { id: 200 + bedNumber, name: "Meals", qty: 1 }
                        ]
                    },
                    {
                        time: "Dinner",
                        foods: [
                            { id: 300 + bedNumber, name: "Chapati", qty: 2 }
                        ]
                    }
                ]
            }
        ]
    };
});




export const groupMeals = (data) => {
    if (!data || data.length === 0) return [];

    const grouped = data.reduce((acc, item) => {
        const key = item?.type_desc;
        const foodId = item.item_id;

        if (!acc[key]) {
            acc[key] = [];
        }

        // check if food already exists (to avoid duplicates)
        let existingFood = acc[key].find(f => f.food_id === foodId);

        if (!existingFood) {
            existingFood = {
                food_id: item.item_id,
                item_name: item.item_name,
                category: item.category_name,
                description: item.description,
                qty: item.quantity,
                unit_code: item.unit_code,
                unit_id: item.unit_id,
                time_id: item.type_id,
                time_name: item.type_desc,
                prices: []   // add prices array
            };

            acc[key].push(existingFood);
        }

        // push price (avoid null)
        if (item?.price !== null) {
            existingFood?.prices.push({
                party_type_id: item.party_type_id,
                party_name: item.party_name,
                price: item.price,
                gst_rate: item.gst_rate,
                discount: item.discount,
                discount_rate: item.discount_rate
            });
        }
        return acc;
    }, {});

    return Object.keys(grouped)?.map((key) => ({
        type: key,
        foods: grouped[key],
    }));
};



// hanlde session error here
export const handleAuthError = (err) => {
    if (err?.response?.status === 401) {
        warningNofity("Session expired. Please login again");

        localStorage.removeItem("app_auth");
        localStorage.removeItem("token");

        setTimeout(() => {
            window.location.href = "/";
        }, 1000);

        return true; // tells caller it was handled
    }

    return false;
};



//Managing Diet into a proper Structure For show the Previous Orders
// export const groupPreviousOrder = (data) => {
//     const ordersMap = new Map();

//     data.forEach(row => {
//         const {
//             canteen_order_id,
//             order_time,
//             order_status,
//             item_id,
//             item_name,
//             quantity,
//             price,
//             gst,
//             gst_amount
//         } = row;

//         // Create order if not exists
//         if (!ordersMap.has(canteen_order_id)) {
//             ordersMap.set(canteen_order_id, {
//                 canteen_order_id,
//                 order_time,
//                 order_status,
//                 items: []
//             });
//         }

//         const order = ordersMap.get(canteen_order_id);

//         // Push item into order
//         order.items.push({
//             item_id,
//             item_name,
//             quantity,
//             price,
//             gst,
//             gst_amount,
//             canteen_order_id
//         });
//     });

//     // Convert map → array
//     return Array.from(ordersMap.values());
// };


export const groupPreviousOrder = (
    canteenData = [],
    dietData = [],
    extraData = []
) => {
    const ordersMap = new Map();

    // 1 CREATE BASE FROM CANTEEN
    canteenData.forEach(row => {
        const {
            canteen_order_id,
            order_time,
            order_status,
            item_id,
            item_name,
            quantity,
            price,
            gst,
            gst_amount,
            canteen_order_item_id
        } = row;

        if (!canteen_order_id) return;

        if (!ordersMap.has(canteen_order_id)) {
            ordersMap.set(canteen_order_id, {
                canteen_order_id,
                order_time,
                order_status,
                items: []
            });
        }

        const order = ordersMap.get(canteen_order_id);

        order.items.push({
            item_id,
            item_name,
            quantity: Number(quantity ?? 0),
            price: Number(price ?? 0),
            gst,
            gst_amount,
            canteen_order_item_id: canteen_order_item_id || null,

            // unified structure
            order_id: null,
            order_detail_id: null,

            type: "CANTEEN",
            isExtra: false,
            extra_order_id: null
        });
    });

    // 2 MERGE EXTRA (BY item_id)
    extraData.forEach(extra => {
        const { item_id, quantity, extra_order_id } = extra;

        const matchOrder = Array.from(ordersMap.values()).find(order =>
            (order.items ?? [])?.some(item => item.item_id === item_id)
        );

        if (!matchOrder) return;

        const existingItem = matchOrder.items.find(
            item => item.item_id === item_id
        );

        if (existingItem) {
            existingItem.isExtra = true;
            existingItem.extra_order_id = extra_order_id;

            existingItem.quantity = Number(quantity ?? existingItem.quantity);
        }
    });

    // 3 MERGE DIET (IMPORTANT FIX: NO PUSH)
    dietData.forEach(diet => {
        const {
            item_id,
            order_id,
            order_detail_id,
            quantity
        } = diet;

        const matchOrder = Array.from(ordersMap.values()).find(order =>
            (order.items ?? [])?.some(item => item.item_id === item_id)
        );

        if (!matchOrder) return;

        const existingItem = matchOrder.items.find(
            item => item.item_id === item_id
        );

        if (existingItem) {
            existingItem.order_id = order_id;
            existingItem.order_detail_id = order_detail_id;

            // optional: sync quantity if diet is source of truth
            existingItem.quantity = Number(quantity ?? existingItem.quantity);
        }
    });

    return Array.from(ordersMap.values());
};

// group the arrray of data based on their rendering structure
export const groupByPatient = (data) => {

    // Return empty array if input is null or undefined
    if (!data) return [];

    // Map to group data by patient_id
    // Key: patient_id, Value: patient object with nested orders
    const patientMap = new Map();

    data.forEach(row => {
        const pId = row.patient_id;
        const oId = row.order_id;
        const dId = row.diet_type_id;

        // Create patient entry if it does not exist
        if (!patientMap.has(pId)) {
            patientMap.set(pId, {
                patient_id: pId,
                patient_name: row.patient_name,
                ip_no: row.fb_ip_no,
                mrd_no: row.fb_pt_no,
                nurse_station_name: row.nurse_station_name || null,
                diet_name: row.diet_name,
                room_no: row.bed_no || null,
                diet_plan_id: row.plan_id,
                ordersMap: new Map() // Nested map for grouping orders
            });
        }

        // Retrieve patient object
        const patient = patientMap.get(pId);

        // Create order entry under the patient if it does not exist
        if (!patient.ordersMap.has(oId)) {
            patient.ordersMap.set(oId, {
                order_id: oId,
                order_status: row.order_status,
                foodsMap: new Map() // Nested map for grouping diet types
            });
        }

        // Retrieve order object
        const order = patient.ordersMap.get(oId);

        // Create diet group under the order if it does not exist
        if (!order.foodsMap.has(dId)) {
            order.foodsMap.set(dId, {
                diet_type_id: dId,
                diet_type_name: row.diet_type_name,
                items: [] // Array to store food items
            });
        }

        // Add item to the corresponding diet group
        order.foodsMap.get(dId).items.push({
            item_id: row.item_id,
            item_name: row.item_name,
            quantity: row.quantity,
            unit_code: row.unit_code,
            description: row.description,
        });
    });

    // Convert Maps to arrays for final output
    // ordersMap → orders array
    // foodsMap → foods array
    return [...patientMap.values()].map(patient => ({
        patient_id: patient.patient_id,
        patient_name: patient.patient_name,
        ip_no: patient.ip_no,
        nurse_station_name: patient.nurse_station_name,
        room_no: patient.room_no,
        mrd_no: patient.mrd_no,
        diet_name: patient.diet_name,
        diet_plan_id: patient.diet_plan_id,
        orders: [...patient.ordersMap.values()].map(order => ({
            order_id: order.order_id,
            order_status: order.order_status,
            foods: [...order.foodsMap.values()]
        }))
    }));
};

export const getBgColor = (type) => {
    switch (type) {
        case "EXTRA":
            return "#e74c3c"; // red
        case "DIET":
            return "#27ae60"; // green
        case "CANTEEN":
            return "#2980b9"; // blue
        default:
            return "#7f8c8d"; // fallback gray
    }
};

export const getItemType = (item) => {
    if (item?.extra_order_id !== null) return "EXTRA";
    if (item?.order_detail_id !== null) return "DIET";
    return item?.type;
};