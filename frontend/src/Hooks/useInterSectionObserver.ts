import React, {useEffect, useState} from "react";

type InterSectionObserver = (ref:  React.RefObject<HTMLDivElement>) => boolean;

export const useInterSectionObserver: InterSectionObserver = (ref) => {
    const [isInViewPort, setIsInViewPort] = useState<boolean>(true);

    useEffect(() => {
        const observer = new IntersectionObserver((entry) => {
                setIsInViewPort(entry[0].isIntersecting);
            },
            {
                threshold: 0.05,
                rootMargin: '0px 0px 90% 0px',
            });

        ref.current !== null && observer.observe(ref.current);

        return () => {
            ref.current !== null && observer.unobserve(ref.current);
        }
    }, [ref.current]);


    return isInViewPort;
};