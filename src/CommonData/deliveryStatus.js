import { COLORS } from "../Style/designTokens";

/*
    One list of delivery statuses for the filter strip, the order cards and the status sheet.
    Colour is never the only signal: every status also has a word.
    Text colours are dark enough for 4.5:1 on their tint.
*/
export const DELIVERY_STATUS = {
    PENDING: { label: "Pending", short: "Pending", color: COLORS.plum, tint: COLORS.wash, line: COLORS.orchid },
    PICKEDUP: { label: "Picked up", short: "Picked up", color: "#8A5A00", tint: "#FFF1D6", line: "#EBCB8B" },
    DELIVERED: { label: "Delivered", short: "Delivered", color: COLORS.success, tint: "#E3F3E8", line: "#A9D3B8" },
    UNDELIVERED: { label: "Not delivered", short: "Missed", color: "#17608F", tint: "#E1F0FA", line: "#9CC7E3" },
    RETURNED: { label: "Returned", short: "Returned", color: "#A8431A", tint: "#FBE5DB", line: "#EDB59C" },
    CANCELLED: { label: "Cancelled", short: "Cancelled", color: COLORS.error, tint: "#FBE9E7", line: "#EDB3AD" },
};

// order of the filter strip
export const FILTER_KEYS = ["PENDING", "PICKEDUP", "DELIVERED", "UNDELIVERED", "RETURNED", "CANCELLED"];

export const statusOf = (key) => DELIVERY_STATUS[key] || DELIVERY_STATUS.PENDING;
