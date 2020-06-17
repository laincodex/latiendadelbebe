import React from "react";

interface Props {
    type? :SnackbarStyles,
    message :string,
    isActive :boolean
}
export enum SnackbarStyles {
    SUCCESS,
    ERROR
};
export const SnackbarTime :number = 3000;
export default ({type, message = "", isActive = false} : Props) => {
    const getStyleType = (type? :SnackbarStyles) => {
        switch(type) {
            case SnackbarStyles.SUCCESS:
                return "snackbar-success"; break;
            case SnackbarStyles.ERROR:
                return "snackbar-error"; break;
            default:
                return "";
        }
    }
    return <div className={`snackbar ${getStyleType(type)} ${isActive ? "snackbar-active" : undefined} `}>{message}</div>
}