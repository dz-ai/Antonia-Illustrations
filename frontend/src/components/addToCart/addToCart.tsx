import {FaMinusCircle, FaPlusCircle} from "react-icons/all";
import {useState} from "react";



export function AddToCart() {
    const [quantity, setQuantity] = useState<number>(0);
    return (
        <div className="add-to-cart">
            {
                quantity > 0 &&
                <div className="minus-btn">
                    <button onClick={() => setQuantity(prevState => prevState - 1)}>
                        <FaMinusCircle/>
                    </button>
                </div>
            }


            <div
                className="add-to-cart-quantity"
                style={{borderRadius: quantity > 0 ? '0' : '0px 0px 0px 7px'}}
            >
                <p>{quantity > 0 ? quantity : 'Add To Cart'}</p>
            </div>

            <div className="plus-btn">
                <button onClick={() => setQuantity(prevState => prevState + 1)}>
                    <FaPlusCircle/>
                </button>
            </div>

        </div>
    );
}