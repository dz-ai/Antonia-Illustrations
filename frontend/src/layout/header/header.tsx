import Dropdown from "../../components/util-components/dropdown";
import {HiOutlineShoppingCart} from "react-icons/hi";
import {HiMagnifyingGlass} from "react-icons/all";
import {useState} from "react";
import {nav} from "../../pages/portfolio/portfolio";

export function Header() {
    const [showSearchInput, setShowSearchInput] = useState(false);
    const [inputFocus, setInputFocus] = useState(false);

    const handleInputFocusOut = () => {
        setInputFocus(false);
        setShowSearchInput(false);
    };

    return (
        <header className="main-header">

            <nav>
                <button>Home</button>

                <button>Portfolio</button>

                <button>Shop</button>

                <div className="dropdown-wrapper">
                    <Dropdown
                        options={['Category', 'Category1', 'Category2', 'Category3', 'Category4']}
                        categoryValue={'Categories'}
                        setCategoryValue={(arg) => null}
                        removeEventListener={false}
                        setRemoveEventListener={(arg) => null}
                    />
                </div>

                <div
                    onMouseOver={() => setShowSearchInput(true)}
                            onMouseLeave={() => !inputFocus && setShowSearchInput(false)}
                >

                    {
                        showSearchInput &&
                        <input
                            type="text"
                            onFocus={() => setInputFocus(true)}
                            onBlur={handleInputFocusOut}
                        />
                    }

                    <button className="search-btn">
                        <HiMagnifyingGlass/>
                    </button>
                </div>

                <button className="cart-btn">
                    <HiOutlineShoppingCart style={{height: '30px'}}/>
                </button>

                <button>About Me</button>
            </nav>
        </header>
    );
};