import React from "react";


export function LoadingComponent({loading}: { loading: boolean | string }) {
    let jsx;
    if (typeof loading === 'boolean') {
        loading ?
            jsx = <div className="images-loader"></div>
            :
            jsx = null;
    } else {
        jsx = <p className="no-image-to-show">{loading}</p>;
    }
    return (
        <>
            {jsx}
        </>
    );
}
