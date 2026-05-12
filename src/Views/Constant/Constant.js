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




export const getAgeFromDOB = (dobString) => {
    if (!dobString) return "";

    // Convert "YYYY-MM-DD HH:mm:ss" → ISO
    const dob = parseISO(dobString.replace(" ", "T"));
    const today = new Date();

    const years = differenceInYears(today, dob);

    // Date after removing full years
    const afterYears = new Date(
        today.getFullYear() - years,
        today.getMonth(),
        today.getDate()
    );

    const months = differenceInMonths(afterYears, dob);

    // Date after removing full months
    const afterMonths = new Date(
        afterYears.getFullYear(),
        afterYears.getMonth() - months,
        afterYears.getDate()
    );

    const days = differenceInDays(afterMonths, dob);

    return `${years}Y ${months}M ${days}D`;
};


export const getAgeInYears = (dobString) => {
    if (!dobString) return 0;

    // Convert "YYYY-MM-DD HH:mm:ss" → ISO
    const dob = parseISO(dobString.replace(" ", "T"));
    const today = new Date();

    return differenceInYears(today, dob);
};


// dietFilter.js

export const filterFoodsByType = (foods, selectedFilter) => {
    switch (selectedFilter) {
        case "Special Meal":
            return foods.filter((f) => f.is_special === 1);

        case "Most Ordered":
            return foods.filter((f) => f.is_most_ordered === 1);

        case "Beverage":
            return foods.filter((f) => f.is_beverage === 1);

        case "Veg":
            return foods.filter((f) => f.category === "Veg");

        case "Non-Veg":
            return foods.filter((f) => f.category === "Non-Veg");

        case "Meals":
            return foods.filter(
                (f) => f.time_name === "Lunch" || f.time_name === "Dinner"
            );

        case "All":
        default:
            return foods;
    }
};


export const generateOrderId = () => {
    const random = Math.floor(100000 + Math.random() * 900000);
    return `ORD-${random}`;
};


const statuses = ["Preparing", "Packed", "Out for Delivery"];

export const randomStatus =
    statuses[Math.floor(Math.random() * statuses.length)];



export const buildBystanderCategories = (foods = []) => {
  const popularNames = ["Biriyani", "Mandi"];

  const grouped = {
    "Most Popular": [],
    "Recommended For You": [],
    "Chef Special": [],
    "More Items": [],
  };

  foods.forEach((food) => {
    if (popularNames.includes(food.item_name)) {
      grouped["Most Popular"].push(food);
    } else if (food.is_special === 1) {
      grouped["Chef Special"].push(food);
    } else {
      // random distribution between 2 groups
      const randomGroup =
        Math.random() > 0.5
          ? "Recommended For You"
          : "More Items";

      grouped[randomGroup].push(food);
    }
  });

  return grouped;
};