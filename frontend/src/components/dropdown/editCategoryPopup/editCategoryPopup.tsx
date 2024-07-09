import React, {useState} from 'react';

interface Props {
    currentCategory: string;
    removeCategory: () => void;
    setShowEditCatPopup: React.Dispatch<React.SetStateAction<boolean>>;
    renameCategory: (newCategoryName: string) => void;
    loading: boolean;
}

const EditCategoryPopup: React.FC<Props> = ({
                                                currentCategory,
                                                removeCategory,
                                                setShowEditCatPopup,
                                                renameCategory,
                                                loading
                                            }) => {
    const [showEditCatInput, setShowEditCatInput] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState<string>(currentCategory);


    return (
        <>
            {
                !showEditCatInput &&
                <div className="popup-category">
                    <div className="add-category">
                        <span className="rem-warning-message">Would You Like To Remove: {currentCategory}? </span>
                        <div className="btn-section">
                            <div className="rename-btn btn" onClick={() => setShowEditCatInput(true)}>Rename</div>
                            <div className="rem-btn btn" onClick={removeCategory}>
                                {loading ? <div className="loader"></div> : 'Remove'}
                            </div>
                            <button className="btn" onClick={() => {
                                setShowEditCatPopup(false);
                            }}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            }
            {
                showEditCatInput &&
                <div className="popup-category">
                    <div className="add-category">
                        <input type="text"
                               autoFocus={true}
                               value={newCategoryName}
                               onChange={(e) => setNewCategoryName(e.target.value)}/>
                        <button className="btn" onClick={() => renameCategory(newCategoryName)}>
                            {loading ? <div className="loader"></div> : 'save'}
                        </button>
                        <button className="btn" onClick={() => setShowEditCatInput(false)}>back</button>
                    </div>
                </div>
            }
        </>
    );
};

export default EditCategoryPopup;
