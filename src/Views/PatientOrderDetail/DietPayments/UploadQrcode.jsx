import React from "react";
import {
    Modal,
    ModalDialog,
    ModalClose,
    AspectRatio,
    Box,
} from "@mui/joy";
import TextComponent from "../../../components/TextComponent";
import qrcodeimage  from '../../../assets/images/qrcode.png'


const UploadQrcode = ({
    open,
    onClose,
    qrImage,
    title = "Scan & Pay",
    subtitle = "Scan this QR code using any UPI app.",
}) => {
    return (
        <Modal open={open} onClose={onClose}>
            <ModalDialog
                sx={{
                    width: 340,
                    borderRadius: 4,
                    p: 3,
                }}
            >
                <ModalClose />

                <TextComponent
                    value={title}
                    weight={700}
                    size={18}
                />

                <TextComponent
                    value={subtitle}
                    size={12}
                    color="#666"
                />

                <Box mt={2}>
                    <AspectRatio
                        ratio="1"
                        sx={{
                            borderRadius: 2,
                            overflow: "hidden",
                        }}
                    >
                        <img
                            src={qrcodeimage}
                            alt="UPI QR Code"
                        />
                    </AspectRatio>
                </Box>
            </ModalDialog>
        </Modal>
    );
};

export default UploadQrcode;