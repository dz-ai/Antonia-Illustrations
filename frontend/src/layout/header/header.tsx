import Dropdown from "../../components/dropdown/dropdown";
import {HiOutlineShoppingCart} from "react-icons/hi";
import {HiMagnifyingGlass} from "react-icons/all";
import {useState} from "react";
import {useNavigate} from 'react-router-dom';

export function Header() {
    const navigate = useNavigate();

    const [showSearchInput, setShowSearchInput] = useState(false);
    const [inputFocus, setInputFocus] = useState(false);

    const handleInputFocusOut = () => {
        setInputFocus(false);
        setShowSearchInput(false);
    };

    return (
        <header className="main-header">

            <nav>
                <button onClick={() => navigate('/')}>Home</button>

                <button onClick={() => navigate('/portfolio-shop/portfolio')}>Portfolio</button>

                <button onClick={() => navigate('/portfolio-shop/shop')}>Shop</button>

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