import React, { useState, useEffect } from "react";

import ArrowBackIcon from "../../../assets/icons/arrow_left-24px.svg";

export default (
    { pages, currentPage, callback, MAX_BUTTONS = 5, MAX_SIDE_BUTTONS = 2} : 
        {
            pages :number, 
            currentPage :number, 
            callback :Function,
            MAX_BUTTONS? :number, // Works better with odd number
            MAX_SIDE_BUTTONS? :number
        }
) => {
    const renderPageList = ():Array<JSX.Element> => {
        let pageList :Array<JSX.Element> = [];

        let startIndex :number = 1; // initial page
        let endIndex :number = pages; // maximum pages
        
        if (pages > MAX_BUTTONS) {
            if (currentPage <= MAX_SIDE_BUTTONS) {
                endIndex = MAX_BUTTONS
            } else {
                // if too far to the end, render just 2 next buttons
                if (currentPage <= pages - MAX_SIDE_BUTTONS) {
                    endIndex = currentPage + MAX_SIDE_BUTTONS;
                    // if also far from the start, render just 2 previous buttons 
                    if(currentPage > MAX_SIDE_BUTTONS) {
                        startIndex = currentPage - MAX_SIDE_BUTTONS;
                    }
                } else {
                    // then is close to the end, render the last 5 buttons
                    startIndex = pages - (MAX_BUTTONS - 1);
                }
            }
        }
        
        // Render Previous or a dummy object for space
        if (endIndex > MAX_BUTTONS ) {
            pageList.push(<li key={0} onClick={callback(currentPage-1)}><ArrowBackIcon className="svg-24" /></li>);
        } else {
            pageList.push(<li key={0} style={{opacity:0}}></li>)
        }

        // Main pages
        for (let p = startIndex; p <= endIndex; p++) {
            pageList.push(<li key={p} onClick={callback(p)} className={(p == currentPage) ? "paginator-active-page" : ""}>{p}</li>);
        }

        // Next
        if (currentPage + MAX_SIDE_BUTTONS < pages) {
            pageList.push(<li key={endIndex+1} onClick={callback(currentPage+1)}><ArrowBackIcon className="rotate-180 svg-24" /></li>);
        } else {
            pageList.push(<li key={endIndex+1} style={{opacity:0}}></li>)
        }
        return pageList;
    }

    return (
        <ul className="paginator no-select">
            {renderPageList()}
        </ul>
    );
}