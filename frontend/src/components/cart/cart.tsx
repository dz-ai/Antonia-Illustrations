import {rab1} from "../../imgs/imagesArray";
import {FaMinusCircle, FaPlusCircle} from "react-icons/all";


export function Cart() {
    return (
        <div className="cart-item">
            <div className="image-cart-wrapper">
                <img src={rab1} alt=""/>
            </div>

            <div className="description-add-wrapper">
                <p>description tall some words about the item</p>

                <section className="add-to-cart-cart">
                    <button className="minus-btn-cart"><FaMinusCircle/></button>
                    <div className="cart-quantity">0</div>
                    <button className="plus-btn-cart"><FaPlusCircle/></button>
                </section>
            </div>
            <div className="total-wrapper">
                <p>Total: 0 &#8362;</p>
            </div>

            <div className="cart-rm-btn">
                <button>Remove Item</button>
            </div>
        </div>
    );
}