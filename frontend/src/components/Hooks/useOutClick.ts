import {Dispatch, RefObject, SetStateAction, useEffect} from "react";

export function useOutClick(ref: RefObject<HTMLDivElement>, set: Dispatch<SetStateAction<string | boolean>>, rem:boolean) {
    useEffect(() => {
        const handleClick = (e: MouseEvent) =>  {
            if (rem) {
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
    }, [ref, rem]);
}