import Dropdown from "../../components/dropdown/dropdown";
import {FaUserCircle, GiHamburgerMenu} from "react-icons/all";
import {useContext, useEffect, useRef, useState} from "react";
import {useLocation, useNavigate} from 'react-router-dom';
import {useMediaQuery} from "react-responsive";
import {useOutClick} from "../../Hooks/useOutClick";
import store from "../../store";
import {observer} from "mobx-react";
import {PopupContext} from "../../components/popupMessage/popupMessage";


function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const ref = useRef(null);
    const popupContext = useContext(PopupContext);

    const isSmallScreen = useMediaQuery({query: '(max-width: 800px)'});

    const [showBurgerMenu, setShowBurgerMenu] = useState<string | boolean>(false);
    const [outClickRem, setOutClickRem] = useState<boolean>(!showBurgerMenu);
    const [categoriesVal, setCategoriesVal] = useState<string>('');

    useOutClick(ref, setShowBurgerMenu, outClickRem);

    useEffect(() => {
        if (showBurgerMenu) {
            setOutClickRem(false);
        } else {
            setOutClickRem(true);
        }
    }, [showBurgerMenu]);

    useEffect(() => {
        if (isSmallScreen && showBurgerMenu) {
            setShowBurgerMenu(false);
        }
    }, [categoriesVal]);

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
                                    navigate('/portfolio');
                                }}>
                                Portfolio
                            </button>

                            <div className="dropdown-wrapper" onClick={() => {
                                setOutClickRem(true);
                                setTimeout(() => {
                                    setOutClickRem(false);
                                }, 500);
                            }
                            }>
                                <Dropdown options={store.categories} noInfluence={false}
                                          onValChange={(val) => setCategoriesVal(val)}
                                          navigateTo={location.pathname !== 'portfolio' ? '/portfolio' : null}
                                />
                            </div>

                            <button
                                onClick={() => {
                                    showBurgerMenu && setShowBurgerMenu(false);
                                    navigate('/about-me');
                                }}>
                                About Me
                            </button>
                            {
                                store.isUserLog && localStorage.getItem('token') !== null &&
                                <button id="logout-btn"
                                        onClick={() => store.logOut((message) => popupContext.showPopup(message))}>Log
                                    Out<FaUserCircle/></button>
                            }
                        </nav>
                    </div>
                </>
            }
        </header>
    );
}

export default observer(Header);