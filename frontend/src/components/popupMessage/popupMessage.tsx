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
    // todo bag fix the popup must disappear after use, so it is not disturbing user clicking.
    const showPopup = (message: string) => {
        let timeToShowMessage: number = 5;
        if (message.length > 40) {
            timeToShowMessage = 8;
        }
        setPopupMessage(message);

        setTimeout(() => {
            setPopupMessage('');
        }, timeToShowMessage * 1000);

    };

    return (
        <PopupContext.Provider value={{showPopup}}>
            {children}
            {<PopupMessage message={popupMessage}/>}
        </PopupContext.Provider>
    );
};

export {PopupContext, PopupProvider};
