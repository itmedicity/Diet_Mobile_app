import React, { memo } from "react";
import { SkeletonBlock } from "./CollectionPage";

// Placeholder cards while the payment history loads
const PaymentHistorySkeleton = () => (
    <>
        <SkeletonBlock height={170} />
        <SkeletonBlock height={170} />
        <SkeletonBlock height={170} />
    </>
);

export default memo(PaymentHistorySkeleton);
