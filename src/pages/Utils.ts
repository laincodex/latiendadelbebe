import { useRef, useEffect } from "react";
import { Request } from "express";

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

export const getRefUrl = (req :Request, defaultRef :string = "/") => {
    if (typeof req.query.ref === "string") {
        const refUrl = unescape(req.query.ref as string);
        // Should match root "/" or start with / +alphabet
        if (/^\/$|^\/[A-Za-z]\S*/.test(refUrl))
            return refUrl;
    }
    return defaultRef;
};

export namespace StringUtils {
    export const isValidString = (input :string, allowWhiteSpace :boolean = true) :boolean => {
        if (typeof input === 'undefined')
            return false;
        if (allowWhiteSpace) {
            return (/^[A-Za-z\s]*$]/).test(input);
        } else {
            return (/^[A-Za-z]*$]/).test(input);
        }
    };

    export const sanitizeString = (input :string, allowWhiteSpace :boolean = true, allowAccentMark :boolean = false ) :string => {
        if (typeof input === 'undefined')
            return '';
        
        let regex :string = "[^a-zA-Z0-9";
        if (allowWhiteSpace) {
            regex += "\\s";
            // return input.replace(/[^a-zA-Z0-9\s]/g, "");
        }

        if (allowAccentMark) {
            regex += "áÁéÉíÍóÓúÚñÑ";
        }
        regex += "]";
        return input.replace(new RegExp(regex, 'g'), "");
    };

    export const slugify = (input :string) :string => {
        return input.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-');
    };
};