import React, {useState, createContext} from "react";
import {useMediaQuery} from "react-responsive";

export function PopupMessage({message}: { message: string }) {
    const mobileScreen = useMediaQuery({query: '(max-width: 520px)'})

    let className: string = '';
    if (message && !mobileScreen) className = 'popup-message show';
    if (message && message.length > 25 && mobileScreen) className = 'popup-message show long-text';
    if (!message) className = 'popup-message';

    return (
        <div className={className}>
            <p>{message}</p>
        </div>
    );
}

const PopupContext: React.Context<any> = createContext(null);

const PopupProvider = ({children}: { children: any }) => {
    const [popupMessage, setPopupMessage] = useState('');
    const [displayPopup, setDisplayPopup] = useState<boolean>(false);

    const showPopup = (message: string | unknown): void => {
        typeof message !== 'string' ? message = 'Some Error has been probably occur check console for details' : null;
        setDisplayPopup(true);

        let showMessageDuration: number = 5;
        if (typeof message === 'string' && message.length > 40) {
            showMessageDuration = 8;
        }
        // separate the component display and the actual message appearing with the animation effect
        setTimeout(() => {
            setPopupMessage(message as string);
        }, 100);
        // remove the message with the animation effect
        setTimeout(() => {
            setPopupMessage('');
        }, showMessageDuration * 1000);
        // remove the component completely from the DOM
        setTimeout(() => {
            setDisplayPopup(false);
        }, (showMessageDuration * 1000) + 500);

    };

    return (
        <PopupContext.Provider value={{showPopup}}>
            {children}
            {displayPopup && <PopupMessage message={popupMessage}/>}
        </PopupContext.Provider>
    );
};

export {PopupContext, PopupProvider};
