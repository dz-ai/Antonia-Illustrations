


export function CheckDownPage() {
    return (
        <>
            <h3>Payment Detail</h3>

            <div className="payment-card">
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
        </>
    );
}