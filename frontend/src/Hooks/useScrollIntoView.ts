import React from "react";

export type TUseScrollIntoView = (ref:  React.RefObject<HTMLDivElement>) => void;

export const useScrollIntoView = ():TUseScrollIntoView =>  {
    return (ref:  React.RefObject<HTMLDivElement>) => {
        (ref.current as HTMLDivElement).scrollIntoView({behavior: 'smooth'});
    }
}