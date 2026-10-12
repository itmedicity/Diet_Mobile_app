import React, { memo, useEffect, useState } from 'react';
import { Box } from '@mui/joy';

import nofoodfound from '../../../assets/images/nofood.jpg'
import { useFetchItemFiles } from '../../../CommonData/UseQuery';
import { COLORS, FONT, focusRing } from '../../../Style/designTokens';

// The food chosen in the extra-order search: photo, name, details and price
const FoodDetailShowCard = ({ selectedFood = {} }) => {

    const {
        item_id,
        item_name,
        description,
        category_name,
        group_name,
        price,
        discount
    } = selectedFood ?? {};


    const { data: ItemFiles = [] } = useFetchItemFiles(item_id);

    const [selectedImage, setSelectedImage] = useState("");

    // Set first image when files load
    useEffect(() => {
        if (!selectedFood?.item_id) return;

        if (ItemFiles?.length > 0) {
            setSelectedImage(ItemFiles[0].url);
        } else {
            setSelectedImage(nofoodfound); //  fallback
        }
    }, [ItemFiles, selectedFood?.item_id]);

    if (!selectedFood?.item_id) return null;

    return (
        <Box sx={{ width: '100%', mt: 2, fontFamily: FONT }}>

            <Box
                sx={{
                    display: 'flex', gap: 1.5, p: 1.25, borderRadius: '16px',
                    bgcolor: COLORS.surface, border: `1px solid ${COLORS.line}`,
                }}
            >
                <Box sx={{ flexShrink: 0, width: 88, height: 88, borderRadius: '12px', overflow: 'hidden', bgcolor: COLORS.wash }}>
                    {selectedImage && (
                        <img
                            src={selectedImage}
                            alt={item_name || "food"}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    )}
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ fontSize: 17, fontWeight: 700, color: COLORS.ink, lineHeight: 1.25 }}>{item_name}</Box>

                    {(category_name || group_name) && (
                        <Box sx={{ mt: 0.25, fontSize: 14, color: COLORS.muted }}>
                            {[category_name, group_name].filter(Boolean).join('  ·  ')}
                        </Box>
                    )}

                    {description && (
                        <Box sx={{ mt: 0.5, fontSize: 14, lineHeight: 1.4, color: COLORS.muted, wordBreak: 'break-word' }}>
                            {description}
                        </Box>
                    )}

                    <Box sx={{ mt: 0.75, display: 'flex', alignItems: 'baseline', gap: 1 }}>
                        <Box sx={{ fontSize: 20, fontWeight: 700, color: COLORS.ink }}>{`₹${price ?? 0}`}</Box>
                        {discount > 0 && (
                            <Box sx={{ fontSize: 14, fontWeight: 600, color: COLORS.success }}>{`${discount}% off`}</Box>
                        )}
                    </Box>
                </Box>
            </Box>

            {/* more photos of the item */}
            {ItemFiles?.length > 1 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    {ItemFiles.map(file => (
                        <Box
                            key={file.name}
                            component="button"
                            type="button"
                            onClick={() => setSelectedImage(file.url)}
                            aria-label={`Show photo ${file.name}`}
                            sx={{
                                width: 48, height: 48, p: 0, borderRadius: '10px', overflow: 'hidden', cursor: 'pointer',
                                border: `2px solid ${selectedImage === file.url ? COLORS.plum : COLORS.line}`,
                                ...focusRing,
                            }}
                        >
                            <img src={file.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </Box>
                    ))}
                </Box>
            )}

        </Box>
    );
};

export default memo(FoodDetailShowCard);
