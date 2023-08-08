import React, {useContext, useEffect, useRef, useState} from "react";
import {IoIosArrowDropdown, IoIosArrowDropup} from "react-icons/all";
import {observer} from "mobx-react";
import store from "../../store";
import {PopupContext} from "../popupMessage/popupMessage";
import {useNavigate} from "react-router-dom";
import {useOutClick} from "../../Hooks/useOutClick";
import {Tooltip} from 'react-tooltip';

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
    const [hideTooltip, setHideTooltip] = useState<boolean>(true);

    const ref = useRef(null);
    useOutClick(ref, setOptionShowState);

    const allCategories: string = 'All Categories';

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
        if (catToAdd === '' ) {
            popupContext.showPopup('Please provide new category to add');
            return;
        }
        if (catToAdd.toLowerCase() !== allCategories.toLowerCase()) {
            store.addCategory(catToAdd)
                .then(message => {
                    popupContext.showPopup(message);
                    setShowCatPopup(false);
                });
        } else {
            popupContext.showPopup('This Category already exist');
        }
    }

    const removeCategory = (): void => {
        setLoading(true);
        store.removeCategory(categoryToRemove)
            .then(message => {
                setLoading(false);
                popupContext.showPopup(message);
                store.setCategory(allCategories);
                store.filterCategory(allCategories);
                setShowRemCatPopup(false);
            });
    }

    useEffect(() => {
        onValChange && onValChange(store.currentCategory);
    }, [store.currentCategory]);

    useEffect(() => {
        initCategory && store.setCategory(initCategory);
    }, []);


    const detectTextOverflow = (event: React.MouseEvent<HTMLElement>) => {
        const element = event.currentTarget;
        const isOverflowing = element.scrollWidth > element.clientWidth;

        if (isOverflowing) {
            setHideTooltip(false);
        } else {
            setHideTooltip(true);
        }
    }

    return (
        <div className={!optionsShowState ? "dropdown" : "dropdown select-open"} ref={ref}>
            <div
                className={!optionsShowState ? "hover select" : "select"}
                onClick={handleDropdown}>
                <section className="current-category-section">
                    <div data-tooltip-id="tooltip" data-tooltip-content={store.currentCategory}
                         className="ellipsis-container current-category"
                         onMouseEnter={event => detectTextOverflow(event)}>{store.currentCategory}
                    </div>
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
                <Tooltip id="tooltip" hidden={hideTooltip} delayShow={150} style={{zIndex: 1}}/>
                <section className={optionsShowState ? "options-container options-show" : "options-container"}>
                    {
                        store.isUserLog && optionsShowState &&
                        <div className="option container"
                             onClick={() => setShowCatPopup(true)}>
                            Add +
                        </div>
                    }
                    {
                        store.currentCategory !== allCategories &&
                        <div
                            className="option"
                            onClick={() => handleOption(allCategories)}
                        >
                            <div data-tooltip-id="tooltip" data-tooltip-content={allCategories}
                                 className="ellipsis-container"
                                 onMouseEnter={event => detectTextOverflow(event)}>
                                All Categories
                            </div>
                        </div>
                    }
                    {
                        options.map((category) =>
                            category !== store.currentCategory &&
                            <div
                                key={category}
                                className="option"
                                onClick={() => handleOption(category)}
                            >
                                <div
                                    data-tooltip-content={category} className="ellipsis-container" data-tooltip-id="tooltip"
                                    onMouseEnter={event => detectTextOverflow(event)}>
                                    {category}
                                </div>
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
                            <div className="btn" onClick={handleAddCat}>Add</div>
                            <div className="btn" onClick={() => setShowCatPopup(false)}>Cansel</div>
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