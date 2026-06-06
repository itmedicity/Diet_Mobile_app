import { Box } from '@mui/joy'
import React, { memo } from 'react'
import TextComponent from './TextComponent'
import DietButton from './DietButton'
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const FoodItemAddCard = ({
    onIncrement,
    onDecrement,
    assignedFood,
    foodDetail,
    onClick
}) => {



    const name = foodDetail?.item_name;
    const group = foodDetail?.category;
    const qty = assignedFood?.qty || 0;
    const status = assignedFood ? 1 : 2;
    const description = foodDetail?.description;

    console.log({
        assignedFood
    });
    

    return (
        <Box

            sx={{
                width: '100%',
                height: 55,
                boxShadow: 'sm',
                borderRadius: 5,
                bgcolor: '#fff',
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                mb: 1,
                border: status === 1 ? '1px solid #62ed66' : '1px solid #e282e5',
                boxSizing: "border-box",
            }}>
            <Box onClick={onClick} sx={{
                width: '60%',
                height: '100%',
                display: 'flex',
                alignItems: 'start',
                flexDirection: 'column',
                justifyContent: 'center',
                position: 'relative',
                minWidth: 0,
                gap: 0.3
            }}>
                <TextComponent value={name} size={12} weight={600} />
                <TextComponent noWrap value={description} size={9} weight={400} color='#5b5b5b' />
                <TextComponent value={group} size={9} weight={400} color='#5b5b5b' />
            </Box>

            <Box sx={{
                width: '30%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: status === 2 ? "center" : 'space-between',
                // bgcolor: 'red'
            }}>
                {
                    status === 1 &&
                    <DietButton
                        width={20}
                        icon={RemoveIcon}
                        name=""
                        onClick={onDecrement}
                        disabled={qty <= 1}
                    />
                }

                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <TextComponent value={qty} size={12} weight={800} />
                </Box>
                {
                    status === 1 &&
                    <DietButton
                        width={20}
                        icon={AddIcon}
                        name=""
                        onClick={onIncrement}
                    />
                }
            </Box>
        </Box>
    )
}

export default memo(FoodItemAddCard)