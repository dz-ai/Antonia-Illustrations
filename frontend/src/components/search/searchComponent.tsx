import React, {useEffect, useRef, useState} from 'react';
import store from "../../store";
import {ImagesGroupsNamesEnum} from "../popupEditImage/popupEditImage";
import {observer} from "mobx-react";
import {useLocation, useNavigate} from "react-router-dom";
import {useOutClick} from "../../Hooks/useOutClick";
import {AiOutlineClose, HiOutlineMagnifyingGlass} from "react-icons/all";

const SearchComponent = ({onSearchClicked}: { onSearchClicked: () => void }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResults, setSearchResults] = useState<string[]>([]);
    const [showSearchList, setShowSearchList] = useState<boolean | string>(false);
    const [highlightedIndex, setHighlightedIndex] = useState<null | number>(null);

    const ref = useRef(null);
    useOutClick(ref, setShowSearchList);

    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect((): void => {
        if (store.imagesArray.length === 0) {
            store.getImages(ImagesGroupsNamesEnum.portfolioImagesGroupName).then();
        }
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement> | undefined): void => {
        setHighlightedIndex(null);

        const currentSearchVal: string = e?.target.value || '';
        setSearchTerm(currentSearchVal);

        const searchResults: string[] = store.searchFilter(currentSearchVal);

        if (currentSearchVal === '' || searchResults.length === 0) {
            setSearchResults([]);
            setShowSearchList(false);
            return
        }
        setSearchResults(searchResults);
        setShowSearchList(true);
    }

    const onSearchResultClicked = (result: string): void => {
        if (location.pathname !== '/portfolio') {
            navigate('/portfolio', {state: {searchResult: result}});
        }
        store.searchFilter(result);
        setSearchTerm('');
        setShowSearchList(false);
        result && store.triggerRerender('downSearchScroll');
        onSearchClicked();
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowDown") {
            highlightedIndex === null ?
                setHighlightedIndex(0)
                :
                setHighlightedIndex(prevState => prevState === searchResults.length - 1 ? 0 : prevState as number + 1);
        }
        if (e.key === "ArrowUp") {
            highlightedIndex === null ?
                setHighlightedIndex(searchResults.length - 1)
                :
                setHighlightedIndex(prevState => prevState === 0 ? searchResults.length - 1 : prevState as number - 1);
        }
        if (e.key === "Enter") {
            onSearchResultClicked(searchResults[highlightedIndex as number] || searchTerm);
        }
        if (e.key === "Escape") {
            setShowSearchList(false);
            setHighlightedIndex(null);
        }
    };

    return (
        <div ref={ref} className="search-wrapper">
            <input
                ref={searchInputRef}
                style={{borderBottomLeftRadius: showSearchList ? '0px' : '5px'}}
                type="text"
                placeholder="Search Here..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e)}
                onKeyDown={(e) => handleKeyPress(e)}
            />
            <AiOutlineClose className="clear-text-btn" onClick={() => handleSearchChange(undefined)}/>
            <div className="search-btn" style={{borderBottomRightRadius: showSearchList ? '0px' : '5px'}}>
                <HiOutlineMagnifyingGlass
                    onClick={() => onSearchResultClicked(searchTerm)}
                    onTouchStart={() => searchInputRef.current?.blur()}
                    onTouchEnd={(e) => {
                        e.preventDefault();
                        onSearchResultClicked(searchTerm);
                    }}
                />
            </div>
            {
                showSearchList &&
                <section className="search-results-list">
                    {
                        searchResults.map((result: string, index: number) =>
                            <div
                                key={result}
                                className={index === highlightedIndex ? "search-results-result highlighted" : "search-results-result"}
                                onClick={() => onSearchResultClicked(result)}
                                onTouchStart={() => searchInputRef.current?.blur()/* clear the keyboard on a mobile device */}
                                onTouchEnd={(e) => {
                                    e.preventDefault();
                                    onSearchResultClicked(result);
                                }}
                            >
                                {result}
                            </div>
                        )
                    }
                </section>
            }
        </div>
    );
};

export default observer(SearchComponent);
