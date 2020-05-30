import React from "react";
import Login from "./components/login";

export default ({ isLoggedIn = false } : { isLoggedIn :boolean }) => {
    if (!isLoggedIn) {
        return (<Login />);
    } else {
        return (
            <div>
                loggedIn
            </div>
        );
    }
}