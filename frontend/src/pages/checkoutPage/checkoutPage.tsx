import {deliverTrack} from "../../imgs/imagesArray";
import React, {useEffect, useRef, useState} from "react";
import {FaArrowAltCircleUp} from "react-icons/all";

export function CheckoutPage() {
    const ref = useRef<HTMLDivElement>(null);
    const upRef = useRef<HTMLDivElement>(null);

    const [isInViewPort, setIsInViewPort] = useState<boolean>(true);


    const handleClick = () => {
        (ref.current as HTMLDivElement).scrollIntoView({behavior: 'smooth'});
    };

    const handleBackClick = () => {
        (upRef.current as HTMLDivElement).scrollIntoView({behavior: 'smooth'});
    };

    useEffect(() => {
        const observer = new IntersectionObserver((entry) => {
                setIsInViewPort(entry[0].isIntersecting);
            },
            {
                threshold: 0,
                rootMargin: '0px 0px 90% 0px'
            });

        ref.current !== null && observer.observe(ref.current);

        return () => {
            ref.current !== null && observer.unobserve(ref.current);
        }
    }, [ref.current]);


    return (
        <>
            <div className="checkout-up-page" ref={upRef}>

                <div className="co-up-l">
                    <h2>Shipping Details</h2>

                    <div className="input-f-wrapper">
                        <label>First Name:</label>
                        <input type="text" placeholder="First Name"/>
                    </div>

                    <div className="input-f-wrapper">
                        <label>Last Name:</label>
                        <input type="text" placeholder="Last Name"/>
                    </div>

                    <div className="input-f-wrapper">
                        <label>Email:</label>
                        <input type="email" placeholder="Email"/>
                    </div>

                    <div className="input-f-wrapper">
                        <label>Country:</label>
                        <select>
                            <option value="country">country</option>
                            <option value="country">country</option>
                            <option value="country">country</option>
                            <option value="country">country</option>
                            <option value="country">country</option>
                        </select>
                    </div>

                    <div className="input-f-wrapper">
                        <label>City:</label>
                        <select>
                            <option value="city">city</option>
                            <option value="city">city</option>
                            <option value="city">city</option>
                            <option value="city">city</option>
                            <option value="city">city</option>
                        </select>
                    </div>

                    <div className="input-f-wrapper">
                        <label>Street:</label>
                        <input type="text" placeholder="Street"/>
                    </div>

                    <div className="input-f-wrapper">
                        <label>House Number:</label>
                        <input type="text" placeholder="House Number"/>
                    </div>

                    <div className="continue-btn">

                        <button
                            onClick={handleClick}
                            className="btn"
                        >
                            ↓ Continue ↓
                        </button>
                    </div>

                </div>

                <div
                    className="co-up-r"
                    style={{
                        background: `url(${deliverTrack}) no-repeat center center`,
                        backgroundSize: '100% auto',
                        flex: '1'
                    }}
                >
                    <div className="blur-checkout-img"></div>
                </div>


            </div>

            <div className="checkout-down-page">

                {
                    isInViewPort &&
                    <div className="up-btn">
                        <button onClick={handleBackClick}>
                            <FaArrowAltCircleUp/>
                        </button>
                    </div>
                }

                <h3>Payment Detail</h3>

                <div className="payment-card" ref={ref}>
                    <div className="credit-total">
                        <h4>You Got: 0 Items </h4>
                        <h4>Total: 0 ₪</h4>
                    </div>

                    <h4>Credit Card</h4>

                    <div className="payment-f">
                        <label>Number:</label>
                        <input type="text" placeholder="xxxx xxxx xxxx xxxx"/>
                    </div>

                    <div className="payment-f">
                        <label>Expire Date:</label>
                        <input type="text" placeholder="00/00"/>
                    </div>

                    <div className="payment-f">
                        <label>cvc:</label>
                        <input type="text" placeholder="xxx"/>
                    </div>

                    <button className="btn">Pay</button>

                </div>

            </div>


        </>
    );
}