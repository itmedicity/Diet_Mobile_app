import React, { memo } from "react";
import CollectionPage, { SkeletonBlock } from "./CollectionPage";

const CashCollectionSummarySkeleton = () => (
    <CollectionPage title="Collection summary" subtitle="Loading…">
        <SkeletonBlock height={150} />
        <SkeletonBlock height={72} />
        <SkeletonBlock height={72} />
    </CollectionPage>
);

export default memo(CashCollectionSummarySkeleton);
