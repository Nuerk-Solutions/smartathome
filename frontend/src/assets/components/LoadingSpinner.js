import React from "react";

export default function LoadingSpinner(props) {
    return (
        <div className="loadingSpinner-div">
            <svg className={props.style + " svg-spinner"} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45"/>
            </svg>
            <h1 className="loadingSpinner-text">
                <span>L</span>
                <span>a</span>
                <span>d</span>
                <span>e</span>
                <span>n</span>
                <span>.</span>
                <span>.</span>
                <span>.</span>
            </h1>
        </div>
    );
}
