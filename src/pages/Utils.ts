import { useRef, useEffect } from "react";

export const useIsFirstRender = () => {
    const firstRenderRef = useRef<boolean>(true);
    useEffect(()=> {
        if (firstRenderRef.current)
            firstRenderRef.current = false;
    },[]);
    return firstRenderRef.current;
};