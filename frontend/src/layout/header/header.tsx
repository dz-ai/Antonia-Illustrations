import Dropdown from "../../components/dropdown/dropdown";
import {HiOutlineShoppingCart} from "react-icons/hi";
import {GiHamburgerMenu, HiMagnifyingGlass} from "react-icons/all";
import {useEffect, useRef, useState} from "react";
import {useNavigate} from 'react-router-dom';
import {useMediaQuery} from "react-responsive";
import {useOutClick} from "../../Hooks/useOutClick";


export function Header() {
    const navigate = useNavigate();
    const ref = useRef(null);

    const isSmallScreen = useMediaQuery({query: '(max-width: 800px)'});

    const [showSearchInput, setShowSearchInput] = useState(isSmallScreen);
    const [inputFocus, setInputFocus] = useState(false);

    const [showBurgerMenu, setShowBurgerMenu] = useState<string | boolean>(false);
    const [outClickRem, setOutClickRem] = useState<boolean>(!showBurgerMenu);

    useOutClick(ref, setShowBurgerMenu, outClickRem);

    useEffect(() => {
      if (showBurgerMenu) {
          setOutClickRem(false);
      } else {
          setOutClickRem(true);
      }
    }, [showBurgerMenu]);


    const handleInputFocusOut = () => {
        setInputFocus(false);
        setShowSearchInput(false);
    };

    return (
        <header className={!isSmallScreen ? "main-header" : "mobile-header"}>

            {
                isSmallScreen &&
                <button
                    id="burger-btn"
                    onClick={() => setShowBurgerMenu(!showBurgerMenu)}
                >

                    <GiHamburgerMenu/>
                </button>
            }

            {
                <>
                    <div
                        className={isSmallScreen && showBurgerMenu ? "nav-blur-active" : "nav-blur"}
                            style={{right: isSmallScreen && showBurgerMenu ? '0' : '-100%'}}
                    >
                        <nav
                            ref={ref}
                            className={isSmallScreen && showBurgerMenu ? "nav-active" : "nav-manu"}
                       >

                            <button
                                onClick={() => {
                                showBurgerMenu && setShowBurgerMenu(false);
                                navigate('/');
                            }}>
                                Home
                            </button>

                            <button
                                onClick={() => {
                                showBurgerMenu && setShowBurgerMenu(false);
                                navigate('/portfolio-shop/portfolio');
                            }}>
                                Portfolio
                            </button>

                            <button
                                onClick={() => {
                                    showBurgerMenu && setShowBurgerMenu(false);
                                    navigate('/portfolio-shop/shop');
                                }}>
                                Shop
                            </button>

                            <div className="dropdown-wrapper" onClick={() => {
                                    setOutClickRem(true);
                                    setTimeout(() => {
                                        setOutClickRem(false);
                                    }, 500);
                            }
                            }>
                                <Dropdown
                                    options={['Category', 'Category1', 'Category2', 'Category3', 'Category4']}
                                    categoryValue={'Categories'}
                                    setCategoryValue={(arg) => null}
                                />
                            </div>

                            <div
                                id={isSmallScreen ? "search-btn-mobil" : "search-btn-main"}
                                onMouseOver={() => setShowSearchInput(true)}
                                onMouseLeave={() => !inputFocus && !isSmallScreen && setShowSearchInput(false)}
                            >

                                {
                                    showSearchInput || isSmallScreen ?
                                    <input
                                        type="text"
                                        onFocus={() => setInputFocus(true)}
                                        onBlur={handleInputFocusOut}
                                    />
                                        : null
                                }

                                <button className="search-btn">
                                    <HiMagnifyingGlass/>
                                </button>
                            </div>

                            <button
                                className="cart-btn"
                                onClick={() => {
                                    showBurgerMenu && setShowBurgerMenu(false);
                                    navigate('/cart');
                                }}
                            >
                                <HiOutlineShoppingCart style={{height: '30px'}}/>
                                Cart
                            </button>

                            <button
                                onClick={() => {
                                showBurgerMenu && setShowBurgerMenu(false);
                                navigate('/about-me');
                            }}>
                                About Me
                            </button>
                        </nav>
                    </div>
                </>
            }
        </header>
    );
}