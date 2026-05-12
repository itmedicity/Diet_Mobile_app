

export const getFoodPrice = (food, personType) => {
  const parsed = safeParseJSON(food?.price_details);
  const parsedPrices = Array.isArray(parsed) ? parsed : [];

  const match =
    parsedPrices.find(
      item => Number(item.party_type_id) === Number(personType)
    ) || parsedPrices[0] || {};

  return {
    price: Number(match.price || 0),
    gst: Number(match.gst_rate || 0),
    discount: Number(match.discount || 0),
  };
};

export const safeParseJSON = (value, fallback = []) => {
  try {
    if (!value) return fallback;

    // If already parsed (object/array), return as is
    if (typeof value === "object") return value;

    // If it's a string, parse it
    return JSON.parse(value);
  } catch (error) {
    console.warn("JSON parse failed:", error, value);
    return fallback;
  }
};
