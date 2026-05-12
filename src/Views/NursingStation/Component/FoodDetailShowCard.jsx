import React, { memo, useEffect, useState } from 'react';
import { Box } from '@mui/joy';

import nofoodfound from '../../../assets/images/nofood.jpg'
import { useFetchItemFiles } from '../../../CommonData/UseQuery';
import TextComponent from '../../../components/TextComponent';
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

    const stockLeft = 12;

    if (!selectedFood?.item_id) return null;

    return (
        <Box sx={{ width: '100%', mt: 1 }}>

            {/*  MAIN CARD */}
            <Box
                sx={{
                    display: 'flex',
                    gap: 3,
                    p: 1,
                    borderRadius: 10,
                    bgcolor: '#fff',
                    boxShadow: 'sm',
                    height: 70
                }}
            >

                {/* LEFT IMAGE */}
                <Box sx={{ width: '40%' }}>
                    <Box
                        sx={{
                            height: '100%',
                            borderRadius: 8,
                            overflow: 'hidden',
                            border: '1px solid #eee'
                        }}
                    >
                        {selectedImage && (
                            <img
                                src={selectedImage}
                                alt="food"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                        )}
                    </Box>
                </Box>

                {/* RIGHT DETAILS */}
                <Box
                    sx={{
                        width: '60%',
                        display: 'flex',
                        flexDirection: 'column',
                        // gap: 1
                    }}
                >

                    {/* Title */}
                    <TextComponent
                        value={item_name}
                        size={12}
                        weight={700}
                    />

                    {/* Category + Group */}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextComponent
                            value={category_name}
                            size={9}
                            color="#555"
                        />
                        <TextComponent
                            value={group_name}
                            size={10}
                            color="#555"
                        />
                    </Box>

                    {/* Description */}
                    <TextComponent
                        value={description}
                        size={9}
                        color="#777"
                        sx={{
                            display: "block",
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                            overflowWrap: "anywhere"
                        }}
                    />

                    {/* Price */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Box>
                            <TextComponent
                                value={`₹ ${price ?? 0}`}
                                size={16}
                                weight={700}
                                color="#d32f2f"
                            />
                            {discount > 0 && (
                                <TextComponent
                                    value={`${discount}% OFF`}
                                    size={12}
                                    color="green"
                                />
                            )}
                        </Box>

                        <Box >
                            <TextComponent
                                value={`Stock Left: ${stockLeft}`}
                                size={13}
                                weight={600}
                                color={stockLeft > 5 ? "green" : "red"}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/*  THUMBNAILS BELOW (FIXED ISSUE) */}
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',   // prevents breaking
                    gap: 1,
                    mt: 1
                }}
            >
                {ItemFiles?.length > 0 && (
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 1,
                            mt: 0.2
                        }}
                    >
                        {ItemFiles.map(file => (
                            <img
                                key={file.name}
                                src={file.url}
                                alt={file.name}
                                onClick={() => setSelectedImage(file.url)}
                                style={{
                                    width: 45,
                                    height: 45,
                                    borderRadius: 6,
                                    cursor: 'pointer',
                                    objectFit: 'cover',
                                    border:
                                        selectedImage === file.url
                                            ? '2px solid #1976d2'
                                            : '1px solid #ccc'
                                }}
                            />
                        ))}
                    </Box>
                )}
            </Box>

        </Box>
    );
};

export default memo(FoodDetailShowCard);