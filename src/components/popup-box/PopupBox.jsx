import React, { useEffect, useRef, useState } from 'react'
import "./popupBox.style.css"

export const PopupBox = ({ children, openState = false, className = '', pauseScroll = true, closeOnBackClick = false, onClose = Function }) => {
    // handle popup open
    const [open, setOpen] = useState(false);
    const [closeAnim, setCloseAnim] = useState(false);

    useEffect(() => {
        if (openState) {
            setOpen(true);
        } else {
            setCloseAnim(true);
            setTimeout(() => {
                setOpen(false);
                setCloseAnim(false);
            }, 300)
        }
    }, [openState])

    // pause scroll on open
    useEffect(() => {
        if (open)
            document.body.style.overflowY = pauseScroll ? "hidden" : "auto";
        else document.body.style.overflowY = "auto";
    });

    // close on background click
    const boxRef = useRef(null)
    useEffect(() => {
        const handleClose = e => {
            if (closeOnBackClick && open && !boxRef.current?.contains(e.target)) {
                onClose();
            }
        }

        document.addEventListener("mousedown", handleClose)
        return () => document.removeEventListener("mousedown", handleClose)
    })

    return (
        open && <div className={`hb-popup-container hb-fadein-anim ${closeAnim && "hb-fadeout-anim"}`}>
            <div className={`${className} hb-popup-box ${closeAnim && "hb-popup-box-close-anim"}`} ref={boxRef}>
                {children}
            </div>
        </div>
    )
}
