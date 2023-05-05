import Dropdown from "../../components/dropdown/dropdown";
import {GiHamburgerMenu} from "react-icons/all";
import {useEffect, useRef, useState} from "react";
import {useNavigate} from 'react-router-dom';
import {useMediaQuery} from "react-responsive";
import {useOutClick} from "../../Hooks/useOutClick";
import store from "../../store";
import {observer} from "mobx-react";


function Header() {
    const navigate = useNavigate();
    const ref = useRef(null);

    const isSmallScreen = useMediaQuery({query: '(max-width: 800px)'});

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
                                {/*TODO make better dropdown ui ux (use library?)*/}
                                <Dropdown
                                    options={['Category', 'Category1', 'Category2', 'Category3', 'Category4']}
                                    categoryValue={'Categories'}
                                    setCategoryValue={(arg) => null}
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
                                <button onClick={() => store.logOut()}>Log Out</button>
                            }
                        </nav>
                    </div>
                </>
            }
        </header>
    );
}

export default observer(Header);