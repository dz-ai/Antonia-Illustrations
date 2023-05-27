import React, {useEffect} from "react";

interface props {
    message: string;
    setMessage: React.Dispatch<React.SetStateAction<string>>
}

export function PopupMessage({message, setMessage}: props) {
    // TODO add animation
    useEffect(() => {
        setTimeout(() => {
            setMessage('');
        }, 7000);
    }, []);

    return (
        <div className="popup-message">
            <p>{message}</p>
        </div>
    );
}