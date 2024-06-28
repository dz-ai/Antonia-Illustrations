import React, {useContext, useEffect, useRef, useState} from "react";
import {observer} from "mobx-react";
import store from "../../store";  /* todo consider to move the store out of the component */
import {PopupContext} from "../popupMessage/popupMessage";
import {useNavigate} from "react-router-dom";
import {useOutClick} from "../../Hooks/useOutClick";
import {Tooltip} from 'react-tooltip';
import {SvgArrowIconWrapper} from "./svgArrowIconWrapper";

interface IDropdown {
    categories: string[];
    initCategory: string;
    onCategoryChang: (currentCategory: string) => void;
    navigateTo?: string | null; /* suggest the option to navigate after that a category has been chosen */
}

function Dropdown(
    {categories, navigateTo, initCategory, onCategoryChang}: IDropdown) {
    const popupContext = useContext(PopupContext);
    const navigate = useNavigate();

    const [currentCategory, setCurrentCategory] = useState<string>(initCategory);
    const [openDropdown, setOpenDropdown] = useState<boolean | string>(false);
    const [showAddCatPopup, setShowAddCatPopup] = useState<boolean>(false);
    const [showRemCatPopup, setShowRemCatPopup] = useState<boolean>(false);
    const [catToAdd, setCatToAdd] = useState<string>('');
    const [categoryToRemove, setCategoryToRemove] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [hideTooltip, setHideTooltip] = useState<boolean>(true);

    const ref = useRef(null);
    useOutClick(ref, setOpenDropdown);

    const allCategories: string = 'All Categories';

    const handleDropdown = (): void => {
        setOpenDropdown(!openDropdown);
    };

    const handleCategoryChoice = (category: string): void => {
        onCategoryChang(category);
        setCurrentCategory(category);
        if (navigateTo) {
            navigate(navigateTo, {state: {category}});
        } else {
            setOpenDropdown(false);
        }
    };

    const handleAddCat = (): void => {
        setLoading(true);
        if (catToAdd === '') {
            setLoading(false);
            popupContext.showPopup('Please provide new category to add');
            return;
        }
        store.addCategory(catToAdd)
            .then(message => {
                setLoading(false);
                popupContext.showPopup(message);
                setShowAddCatPopup(false);
            });
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

    const detectTextOverflow = (event: React.MouseEvent<HTMLElement>) => {
        const element = event.currentTarget;
        const isOverflowing = element.scrollWidth > element.clientWidth;

        if (isOverflowing) {
            setHideTooltip(false);
        } else {
            setHideTooltip(true);
        }
    }

    useEffect(() => {
        setCurrentCategory(initCategory);
    }, [initCategory]);

    return (
        <div className={!openDropdown ? "dropdown" : "dropdown select-open"}>
            <div
                ref={ref}
                className={!openDropdown ? "hover select" : "select"}
                onClick={handleDropdown}>
                <section className="current-category-section">
                    <div data-tooltip-id="tooltip" data-tooltip-content={currentCategory}
                         className="ellipsis-container current-category"
                         onMouseEnter={event => detectTextOverflow(event)}>{currentCategory}
                    </div>
                    <SvgArrowIconWrapper arrowDirection={openDropdown ? 'up' : 'down'}/>
                </section>
                <Tooltip id="tooltip" hidden={hideTooltip} delayShow={150} style={{zIndex: 1}}/>
                <section className={openDropdown ? "options-container options-show" : "options-container"}>
                    {
                        store.isUserLog && openDropdown &&
                        <div className="option container"
                             onClick={() => setShowAddCatPopup(true)}>
                            Add +
                        </div>
                    }
                    {
                        categories.map((category) =>
                            category !== currentCategory &&
                            <div
                                key={category}
                                className="option"
                                onClick={() => handleCategoryChoice(category)}
                            >
                                <div
                                    className="ellipsis-container"
                                    data-tooltip-content={category}
                                    data-tooltip-id="tooltip"
                                    onMouseEnter={event => detectTextOverflow(event)}>
                                    {category}
                                </div>
                                {
                                    store.isUserLog && category !== allCategories &&
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
                showAddCatPopup &&
                <div className="popup-category">
                    <div className="add-category">
                        <span>
                            Category:
                        </span>
                        <input onChange={(e) => setCatToAdd(e.target.value)} autoFocus={true}/>
                        <div className="btn-section">
                            <div className="rem-btn btn" onClick={handleAddCat}>
                                {loading ? <div className="loader"></div> : 'Add'}
                            </div>
                            <div className="btn" onClick={() => setShowAddCatPopup(false)}>Cansel</div>
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