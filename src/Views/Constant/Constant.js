import DOMPurify from "dompurify";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { format, differenceInYears, differenceInMonths, differenceInDays, parseISO } from "date-fns";


//URL EXSIT CHECK FUNCTION

export const urlExist = (url, callBack) => {
    const img = new Image()
    img.src = JSON.parse(url)

    if (img.complete) {
        callBack(true)
    } else {
        img.onload = () => {
            callBack(true)
        }

        img.onerror = () => {
            callBack(false)
        }
    }
}

export const innerHeight = window.innerHeight
export const innerWidth = window.innerWidth



export const sanitizeInput = (input) => {
    return DOMPurify.sanitize(input);
};

export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

export const isValidMobileNumber = (mobile) => {
    const regex = /^\d{10}$/;
    return regex.test(mobile);
};

export const isValidOTPMobileNumber = (mobile) => {
    const regex = /^\d{12}$/;
    return regex.test(mobile);
};

export const removeEmojis = (inputText) => {
    return inputText.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{2B06}\u{2194}\u{1F004}-\u{1F0CF}]/gu, '');
}

export const validateEnglishInput = (english) => {
    const englishRegex = /^[A-Za-z0-9\s,.\-?!():;]*$/;
    if (!englishRegex.test(english)) {
        return false;
    }
    return true;
};



export const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    /*
     * -> Minimum 6 characters
     * -> At least one uppercase letter
     * -> At least one lowercase letter
     * -> At least one number
     * -> At least one special character
     * -> Password must contain at least one letter and one number
     */
    return passwordRegex.test(password);
};

export const succesNofity = (message) => toast.success(message, {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
});

export const errorNofity = (message) => toast.error(message, {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
});

export const warningNofity = (message) => toast.warning(message, {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
});

export const infoNofity = (message) => toast.info(message, {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
});

export const normalizeDate = (dateStr) => {
    try {
        return format(new Date(dateStr), 'yyyy-MM-dd');
    } catch {
        return '';
    }
};


export const employeeID = () => {
    const localData = localStorage.getItem("app_auth");
    const employeeID = atob(JSON.parse(localData)?.authNo);
    return employeeID;
};


export const EmpauthId = () => {
    const localData = localStorage.getItem("app_auth");
    const EmpauthId = atob(JSON.parse(localData)?.authId);
    return EmpauthId;
};


export const CleanHtmlString = (htmlString) => {
    // First, decode HTML entities (e.g., &lt; becomes <)
    const tempElement = document.createElement('div');
    tempElement.innerHTML = htmlString;
    const decodedString = tempElement.textContent || tempElement.innerText || '';

    // Remove HTML tags
    let cleaned = decodedString.replace(/<[^>]*>/g, '');
    // Replace &nbsp; (non-breaking spaces) with regular spaces
    cleaned = cleaned.replace(/&nbsp;/g, ' ');
    // Replace multiple spaces with a single space
    cleaned = cleaned.replace(/\s+/g, ' ').trim();

    return cleaned;
};



// export const filterFoodsByType = (
//     foods = [],
//     selectedFilter = 0
// ) => {

//     // ALL

//     if (
//         selectedFilter === 0 ||
//         selectedFilter === "All" ||
//         selectedFilter === null ||
//         selectedFilter === undefined
//     ) {
//         return foods;
//     }

//     // FILTER USING HIGHLIGHT TYPE ID
//     return foods?.filter((food) => {
//         // SINGLE OBJECT
//         if (
//             Number(food.highlight_type_id) ===
//             Number(selectedFilter)
//         ) {
//             return true;
//         }

//         // ARRAY SUPPORT
//         if (Array.isArray(food.highlights)) {
//             return food.highlights.some(
//                 (val) =>
//                     Number(val.highlight_type_id) ===
//                     Number(selectedFilter)
//             );
//         }
//         return false;
//     });
// };


export const filterFoodsByType = (
    foods = [],
    selectedFilter = 0
) => {

    const normalizedFoods = foods?.map((food) => ({
        ...food,

        // normalize highlight meta
        highlight: {
            id: food?.highlight_type_id,
            name: food?.highlight_name,
            icon: food?.highlight_icon,
            color: food?.color_code,
            title: food?.highlight_title,
            description: food?.highlight_description,
            code: food?.highlight_code
        }
    }));

    // ALL
    if (
        selectedFilter === 0 ||
        selectedFilter === "All" ||
        selectedFilter === null ||
        selectedFilter === undefined
    ) {
        return normalizedFoods;
    }

    // FILTER USING HIGHLIGHT TYPE ID
    return normalizedFoods?.filter((food) => {

        // SINGLE OBJECT
        if (
            Number(food?.highlight?.id) ===
            Number(selectedFilter)
        ) {
            return true;
        }

        // ARRAY SUPPORT
        if (Array.isArray(food.highlights)) {
            return food.highlights.some(
                (val) =>
                    Number(val.highlight_type_id) ===
                    Number(selectedFilter)
            );
        }

        return false;
    });
};


export const buildBystanderCategories = (foods = []) => {

    if (!foods || foods.length === 0) return {};

    // remove duplicate items
    const uniqueFoods = Object.values(
        foods.reduce((acc, item) => {

            if (!acc[item.item_id]) {

                // parse price details
                const parsedPrices = item?.price_details
                    ? JSON.parse(item.price_details)
                    : [];

                // find bystander price
                const bystanderPrice = parsedPrices.find(
                    (price) => price.party_name === "BYSTANDER"
                );

                acc[item.item_id] = {
                    ...item,
                    // add formatted price object
                    prices: bystanderPrice
                        ? [bystanderPrice]
                        : []
                };
            }
            return acc;

        }, {})
    );

    const grouped = {};

    uniqueFoods.forEach((food) => {

        const categoryName =
            food?.highlight_name || "RECOMMENDED FOOD";

        if (!grouped[categoryName]) {
            grouped[categoryName] = [];
        }

        grouped[categoryName].push(food);
    });

    return grouped;
};