import { useRef, useEffect } from "react";

export const useIsFirstRender = () => {
    const firstRenderRef = useRef<boolean>(true);
    useEffect(()=> {
        if (firstRenderRef.current)
            firstRenderRef.current = false;
    },[]);
    return firstRenderRef.current;
};

export const trim = (text :string, maxLength :number) :string => text.length > maxLength ? text.substring(0, maxLength) + "..." : text;

export const parseDate = (date :Date) :string => ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();