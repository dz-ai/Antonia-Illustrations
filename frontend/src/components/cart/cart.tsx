import {FaMinusCircle, FaPlusCircle} from "react-icons/all";

type P = {
    image: string;
}

export function Cart({image}: P) {
    return (
        <div className="cart-item">
            <div className="image-cart-wrapper">
                <img src={image} alt=""/>
                <p>description tall some words about the item</p>
            </div>

            <div className="total-add-wrapper">

            <div>
                <p>Total: 0 &#8362;</p>
            </div>
                <section className="add-to-cart-cart">
                    <button className="minus-btn-cart"><FaMinusCircle/></button>
                    <div className="cart-quantity">0</div>
                    <button className="plus-btn-cart"><FaPlusCircle/></button>
                </section>
            </div>

            <div className="cart-rm-btn">
                <button>Remove Item ✘</button>
            </div>
        </div>
    );
}