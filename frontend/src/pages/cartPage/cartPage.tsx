import {cartImage} from "../../imgs/imagesArray";
import {Cart} from "../../components/cart/cart";
import {useNavigate} from "react-router-dom";


export function CartPage() {
    const navigate = useNavigate();

    return (
        <div
            className="cart"
            style={{
                background: `url(${cartImage}) no-repeat center center`,
                backgroundSize: 'cover',
                flex: '1'
            }}
        >

            <div className="blur-cart-img">

                <div className="cart-wrapper">
                    <h2>Cart</h2>

                    <div className="cart-container">

                        <div className="cart-container-l">

                            <Cart />

                        </div>



                        <div className="cart-container-r">
                            <div id="total-cart-wrapper">
                                <h3>You Got 0 Items In Cart</h3>
                                <h4>Total-Price: 0 &#8362;</h4>
                            </div>

                            <div className="btn">
                                <button onClick={() => navigate('/checkout')}>checkout</button>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}