import React, {useState} from "react";
import {IoIosArrowDropdown, IoIosArrowDropup} from "react-icons/all";

interface IDropdown {
    options: string[];
    categoryValue: string;
    setCategoryValue: (arg: string) => void;
}

function Dropdown(
    {options, categoryValue, setCategoryValue}:IDropdown) {

    const optionShow = 'options-show';
    const optionHide = 'options-hide';

    const [optionsShowState, setOptionShowState] = useState<string>(optionHide);

    const handleDropdown = () => {
        if (optionsShowState === optionHide) {
            setOptionShowState(optionShow);

        } else {
            setOptionShowState(optionHide);

            setTimeout(() => {
            }, 100);
        }
    };

    const handleOption = (currentCategory:string) => {
        setCategoryValue(currentCategory);
        setOptionShowState(optionHide);
    };

    return (

        <div
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