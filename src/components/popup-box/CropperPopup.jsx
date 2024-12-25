import React, { useRef } from 'react'
import { PopupBox } from './PopupBox'
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

export const CropperPopup = ({ openState, onClose, imgSrc, onCrop }) => {
    const cropperRef = useRef(null);
    const handleCrop = () => {
        const cropper = cropperRef.current?.cropper;
        if (cropper) {
            cropper.getCroppedCanvas().toBlob(blob => {
                const file = new File([blob], "Cropped-img.jpg", { type: blob.type });
                onCrop(file);
                onClose();
            })
        }
    };
    return (
        <PopupBox openState={openState} onClose={onClose} className='hb-cropbox-popup'>
            <div className='hb-crop-popup-content-box'>
                <div className='justify-self-center'>
                    <Cropper
                        src={imgSrc}
                        ref={cropperRef}
                        aspectRatio={1}
                        guides={true}
                        className='hb-cropper-box'
                    />
                </div>
                <div className='hb-display__inline-flex p-3 justify-content-end hb-width-100'>
                    <button className="hb-btn" onClick={onClose}>Cancel</button>
                    <button className="hb-btn hb-btn-primary__grad" onClick={handleCrop}>Crop & Continue</button>
                </div>
            </div>
        </PopupBox>
    )
}
