import React, {useState} from "react";
import {IoIosArrowDropdown, IoIosArrowDropup} from "react-icons/all";
import {observer} from "mobx-react";
import store from "../../store";

interface IDropdown {
    options: string[];
    categoryValue: string;
    setCategoryValue: (arg: string) => void;
}

function Dropdown(
    {options, categoryValue, setCategoryValue}: IDropdown) {

    const [optionsShowState, setOptionShowState] = useState<boolean>(false);
    const [showCatPopup, setShowCatPopup] = useState<boolean>(false);
    const [catToAdd, setCatToAdd] = useState<string>('');

    const handleDropdown = () => {
        setOptionShowState(!optionsShowState);
        setTimeout(() => {
        }, 100);
    };

    const handleOption = (currentCategory: string) => {
        setCategoryValue(currentCategory);
        setOptionShowState(false);
    };

    const handleAddCat = (): void => {
        store.addCategory(catToAdd);
        setShowCatPopup(false);
    }
    // TODO make out click
    return (

        <>
            <div
                className={!optionsShowState ? "hover select container" : "select container"}
                onClick={handleDropdown}
            >
                {
                    !optionsShowState &&
                    <IoIosArrowDropdown
                        className="icon"
                        onClick={() => setOptionShowState(true)}
                    />
                }
                {
                    optionsShowState &&
                    <IoIosArrowDropup
                        className="icon"
                        onClick={() => setOptionShowState(false)}
                    />
                }

                {categoryValue}

                <section className={optionsShowState ? "options-show" : "options-hide"}>
                    {
                        options.map((category) =>
                            <div
                                key={category}
                                className="option"
                                onClick={() => handleOption(category)}
                            >
                                <div className="ellipsis-container">{category}</div>
                                {
                                    store.isUserLog &&
                                    <button className="option-rem-button">X</button>
                                }
                            </div>)
                    }
                    {
                        store.isUserLog && optionsShowState &&
                        <div className="option container"
                             onClick={() => setShowCatPopup(true)}>
                            Add +
                        </div>
                    }
                </section>

            </div>
            {
                showCatPopup &&
                <div id="popup-category">
                    <div className="add-category">
                        <label>
                            Category:
                        </label>
                        <input onChange={(e) => setCatToAdd(e.target.value)}/>
                        <button onClick={handleAddCat} disabled={catToAdd === ''}>Add</button>
                        <button onClick={() => setShowCatPopup(false)}>Cansel</button>
                    </div>
                </div>
            }
        </>

    );
}

export default observer(Dropdown);