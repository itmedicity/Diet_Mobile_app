// Server addresses can be overridden at build time (.env.production / .env.development),
// e.g. REACT_APP_API_URL=https://diet.example.com/api. The old LAN values stay as defaults.
export const API_URL = process.env.REACT_APP_API_URL || "http://192.168.22.170:7000/api";

// export const API_URL = "http://192.168.11.42:5000/api";delivery
// export const PUBLIC_NAS_FOLDER = 'http://192.168.10.88:9090/Meliora'
// export const PUBLIC_NAS_FOLDER = "http://192.168.22.9";

//web socket address
export const WS_URL = process.env.REACT_APP_WS_URL || "http://192.168.22.170:7000";
//Ellider Api
// export const ELLIDER_API_URL = 'http://192.168.10.88:6001/api'
export const ELLIDER_API_URL = process.env.REACT_APP_ELLIDER_API_URL || "http://192.168.22.170:6001/api";

export const PUBLIC_NAS_FOLDER_KMC = "http://136.232.232.26:6357/NAS/Meliora";

// KMC API
// export const API_URL_KMC = 'http://192.168.10.88:7683/api'
export const API_URL_KMC = process.env.REACT_APP_API_URL_KMC || "http://192.168.22.170:5001/api";

export const snow = "http://192.168.10.88:9090/Meliora/Logo/logo.png";
export const mdsign = "http://192.168.10.88:9090/Meliora/md/signature/signature.jpg";
export const edsign = "http://192.168.10.88:9090/Meliora/ed/signature/signature.jpg";
