import React, {useContext, useEffect, useRef, useState} from "react";
import {IoIosArrowDropdown, IoIosArrowDropup} from "react-icons/all";
import {observer} from "mobx-react";
import store from "../../store";
import {PopupContext} from "../popupMessage/popupMessage";
import {useNavigate} from "react-router-dom";
import {useOutClick} from "../../Hooks/useOutClick";

interface IDropdown {
    options: string[];
    noInfluence: boolean;
    onValChange?: (val: string) => void;
    navigateTo?: string | null;
    initCategory?: string;
}

function Dropdown(
    {options, noInfluence, onValChange, navigateTo, initCategory}: IDropdown) {
    const popupContext = useContext(PopupContext);
    const navigate = useNavigate();

    const [optionsShowState, setOptionShowState] = useState<boolean | string>(false);
    const [showCatPopup, setShowCatPopup] = useState<boolean>(false);
    const [showRemCatPopup, setShowRemCatPopup] = useState<boolean>(false);
    const [categoryToRemove, setCategoryToRemove] = useState<string>('');
    const [catToAdd, setCatToAdd] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const ref = useRef(null);
    useOutClick(ref, setOptionShowState);

    const handleDropdown = () => {
        setOptionShowState(!optionsShowState);
        setTimeout(() => {
        }, 100);
    };

    const handleOption = (category: string) => {
        store.setCategory(category);
        if (navigateTo) {
            if (!noInfluence) store.filterCategory(category);
            navigate(navigateTo, {state: {category}});
        } else {
            if (!noInfluence) store.filterCategory(category);
            setOptionShowState(false);
        }
    };

    const handleAddCat = (): void => {
        store.addCategory(catToAdd);
        popupContext.showPopup(`${catToAdd} has added`);
        setShowCatPopup(false);
    }

    const removeCategory = (): void => {
        setLoading(true);
        store.removeCategory(categoryToRemove)
            .then(message => {
                setLoading(false);
                popupContext.showPopup(message);
                store.setCategory('All Categories');
                store.filterCategory('All Categories');
                setShowRemCatPopup(false);
            });
    }

    useEffect(() => {
        onValChange && onValChange(store.currentCategory);
    }, [store.currentCategory]);

    useEffect(() => {
        initCategory && store.setCategory(initCategory);
    }, []);

    return (
        <div className={!optionsShowState ? "dropdown" : "dropdown select-open"} ref={ref}>
            <div
                className={!optionsShowState ? "hover select" : "select"}
                onClick={handleDropdown}>
                <section className="current-category-section">
                    {/* todo add tooltip when category ellipsis is in action */}
                    <div className="ellipsis-container current-category">{store.currentCategory}</div>
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
                </section>

                <section className={optionsShowState ? "options-container options-show" : "options-container"}>
                    {
                        store.currentCategory !== 'All Categories' &&
                        <div
                            className="option"
                            onClick={() => handleOption('All Categories')}
                        >
                            <div className="ellipsis-container">All Categories</div>
                        </div>
                    }
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
                                    <div className="option-rem-button"
                                         onClick={() => {
                                             setCategoryToRemove(category);
                                             setShowRemCatPopup(true);
                                         }}>X</div>
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
                <div className="popup-category">
                    <div className="add-category">
                        <span>
                            Category:
                        </span>
                        <input onChange={(e) => setCatToAdd(e.target.value)} autoFocus={true}/>
                        <div className="btn-section">
                            <button onClick={handleAddCat} disabled={catToAdd === ''}>Add</button>
                            <button onClick={() => setShowCatPopup(false)}>Cansel</button>
                        </div>
                    </div>
                </div>
            }
            {
                showRemCatPopup &&
                <div className="popup-category">
                    <div className="add-category">
                        <span className="rem-warning-message">Would You Like To Remove: {categoryToRemove}? </span>
                        <div className="btn-section">
                            <div className="rem-btn btn" onClick={removeCategory}>
                                {loading ? <div className="loader"></div> : 'Remove'}
                            </div>
                            <button className="btn" onClick={() => setShowRemCatPopup(false)}>Cansel</button>
                        </div>
                    </div>
                </div>
            }
        </div>

    );
}

export default observer(Dropdown);