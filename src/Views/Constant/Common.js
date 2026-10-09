

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



export const existingPackets = (
  PackageDetails = [],
  items = []
) => {

  if (!Array.isArray(PackageDetails)) {
    return [];
  }

  const grouped = PackageDetails.reduce((acc, detail) => {

    const packetUid = detail?.packet_uid;

    if (!packetUid) {
      return acc;
    }

    const orderItemId = Number(detail?.order_item_id);

    // Find the original order item
    const orderItem = items.find(
      item =>
        Number(
          item?.canteen_order_item_id ??
          item?.order_detail_id ??
          item?.item_id
        ) === orderItemId
    );

    const packetItem = {
      // Original item details
      ...orderItem,

      // Packing details override original values
      canteen_order_item_id: orderItemId,
      quantity: Number(detail?.quantity ?? 0),

      // Packing information
      packing_detail_id: detail?.packing_detail_id,
      packet_status: detail?.packet_status,
      barcode_printed: detail?.barcode_printed
    };

    const existingPacket = acc.find(
      packet =>
        packet.packet_uid === packetUid
    );

    if (existingPacket) {

      existingPacket.items = [
        ...existingPacket.items,
        packetItem
      ];

      return acc;
    }

    return [
      ...acc,
      {
        packing_id: detail?.packing_id,
        packet_uid: packetUid,
        packet_no: Number(detail?.packet_no),
        confirmed: true,
        items: [
          packetItem
        ]
      }
    ];

  }, []);

  return grouped;
};