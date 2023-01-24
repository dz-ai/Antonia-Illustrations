import React, {useState} from "react";
import {IoIosArrowDropdown, IoIosArrowDropup} from "react-icons/all";
//import {useMediaQuery} from "react-responsive";

interface IDropdown {
    options: string[];
    categoryValue: string;
    setCategoryValue: (arg: string) => void;
    removeEventListener: boolean;
    setRemoveEventListener: (arg: boolean) => void;
}

function Dropdown(
    {options, categoryValue, setCategoryValue, removeEventListener, setRemoveEventListener}:IDropdown) {

    //const isMobile = useMediaQuery({query: '(max-width: 670px)'});


    //const ref = useRef();

    const optionShow = 'options-show';
    const optionHide = 'options-hide';

    const [optionsShowState, setOptionShowState] = useState<string>(optionHide);

    //useOutClick(ref, removeEventListener, null, setOptionShowState);

    const handleDropdown = () => {
        if (optionsShowState === optionHide) {
            setRemoveEventListener(true);
            setOptionShowState(optionShow);

            setTimeout(() => {
                setRemoveEventListener(false);
            }, 100);
        } else {
            setRemoveEventListener(true);
            setOptionShowState(optionHide);

            setTimeout(() => {
                setRemoveEventListener(false);
            }, 100);
        }
    };

    const handleOption = (currentCategory:string) => {
        setCategoryValue(currentCategory);
        setOptionShowState(optionHide);
    };

    return (

        <div
            // ref={!isMobile ? ref : null}
            className={optionsShowState !== optionShow ? "hover select container" : "select container"}
            onClick={handleDropdown}
            onMouseLeave={() => optionsShowState === optionShow && handleDropdown() }
        >
            {
                optionsShowState === optionHide &&
                <IoIosArrowDropdown
                    className="icon"
                    onClick={() => setOptionShowState(optionShow)}
                />
            }
            {
                optionsShowState === optionShow &&
                <IoIosArrowDropup
                    className="icon"
                    onClick={() => setOptionShowState(optionHide)}
                />
            }

            {categoryValue}

            <section className={optionsShowState}>
                {options.map((category) =>
                    <div
                        key={category}
                        className="option container"
                        onClick={() => handleOption(category)}
                    >
                        {category}
                    </div>)}
            </section>
        </div>

    );
}

export default Dropdown;