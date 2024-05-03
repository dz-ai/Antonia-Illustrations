import {Dispatch, RefObject, SetStateAction, useEffect} from "react";

export function useOutClick(ref: RefObject<HTMLDivElement>, set: Dispatch<SetStateAction<string | boolean>>, preventHook?: boolean) {
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (preventHook) {
                // This allows the element to open. It is temporary (by use of timeOut()) prevent the hook functionality.
                // Wrap the Toggle button and the element that you wish to "out click" in the one HTML tag to avoid this problem.(without to use preventHook).
                return
            }
            if (ref.current && !ref.current.contains(e.target as Node)) {
                set(false);
            }
        }

        window.addEventListener('click', handleClick);

        return () => {
            window.removeEventListener('click', handleClick);

        };
    }, [ref, preventHook]);
}