import React from "react";

interface Props {
    id :string,
    message :string,
    isActive :boolean
}
export const SnackbarTime :number = 3000;
export default ({id, message = "", isActive = false} : Props) => {
    return <div id={id} className={`snackbar ${isActive ? "snackbar-active" : undefined}`}>{message}</div>
}