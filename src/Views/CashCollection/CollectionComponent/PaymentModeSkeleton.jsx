import React, { memo } from "react";
import CollectionPage, { SkeletonBlock } from "./CollectionPage";

const PaymentModeSkeleton = () => (
    <CollectionPage title="Payment modes" subtitle="Loading…">
        <SkeletonBlock height={72} />
        <SkeletonBlock height={72} />
        <SkeletonBlock height={72} />
        <SkeletonBlock height={72} />
    </CollectionPage>
);

export default memo(PaymentModeSkeleton);
