import {deliverTrack} from "../../imgs/imagesArray";
import React from "react";

type Props = {
    scrollFun: (arg: string) => void;
}

export function CheckUpPage({scrollFun}: Props) {

    return (

        <>
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
                        onClick={() => scrollFun('down')}
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
                }}
            >
                <div className="blur-checkout-img"></div>
            </div>
        </>
    );
}