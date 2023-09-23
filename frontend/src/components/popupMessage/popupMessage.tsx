import React, {useState, createContext} from "react";

export function PopupMessage({message}: { message: string }) {
    return (
        <div className={`popup-message ${message ? "show" : ""}`}>
            <p>{message}</p>
        </div>
    );
}

const PopupContext: React.Context<any> = createContext(null);

const PopupProvider = ({children}: { children: any }) => {
    const [popupMessage, setPopupMessage] = useState('');
    const [displayPopup, setDisplayPopup] = useState<boolean>(false);

    const showPopup = (message: string) => {
        setDisplayPopup(true);

        let timeToShowMessage: number = 5;
        if (message.length > 40) {
            timeToShowMessage = 8;
        }
        // separate the component display and the actual message appearing with the animation affect
        setTimeout(() => {
            setPopupMessage(message);
        }, 100);
        // remove the message with the animation affect
        setTimeout(() => {
            setPopupMessage('');
        }, timeToShowMessage * 1000);
        // remove the component completely from the DOM
        setTimeout(() => {
            setDisplayPopup(false);
        }, (timeToShowMessage * 1000) + 500);

    };

    return (
        <PopupContext.Provider value={{showPopup}}>
            {children}
            {displayPopup && <PopupMessage message={popupMessage}/>}
        </PopupContext.Provider>
    );
};

export {PopupContext, PopupProvider};
