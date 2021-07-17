import {useEffect, useState} from "react";
import {smallFormsScreenSize} from "../config/ApplicationSetting";

export interface WindowDimension {
    width: number
    height: number
}

function getCurrentWindowDimension() {
    return {
        width: window.innerWidth,
        height: window.innerHeight
    }
}

export function useWindowDimension() {
    const [windowDimension, setWindowDimension] = useState(getCurrentWindowDimension())

    useEffect(() => {
        window.addEventListener("resize", () => setWindowDimension(getCurrentWindowDimension))
        return () => window.removeEventListener("resize", () => setWindowDimension(getCurrentWindowDimension))
    }, [])

    return windowDimension
}


export function isSmallScreen(windowDimension: WindowDimension) {
    return windowDimension.width < smallFormsScreenSize.width || windowDimension.height < smallFormsScreenSize.height
}