import { useContext } from "react";
import CartContext from "../store/CartContext.jsx";
import Modal from "./UI/Modal.jsx";
import { currencyFormatter } from "../util/formatting.js";
import UserProgressContext from "../store/UserProgressContext.jsx";
import Input from "./UI/Input.jsx";
import Button from "./UI/Button.jsx";

export default function Checkout() {
    const cartCtx = useContext(CartContext);
    const userProgressCtx = useContext(UserProgressContext);

    const cartTotal = cartCtx.items.reduce((totalPrice, item) => {
        return totalPrice + item.price * item.quantity;
    }, 0)

    function handleCloseCheckout() {
        userProgressCtx.hideCheckout();
    }

    function handleSubmit(event) {
        event.preventDefault();

        const fd = new FormData(event.target);
        const consumerData = Object.fromEntries(fd.entries()); // { email: , full-name:...}

        fetch('http://localhost:3000/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                order: {
                    items: cartCtx.items,
                    customer: consumerData
                }
            })
        })
    }

    return (
        <Modal 
            className="checkout"
            open={userProgressCtx.progress === 'checkout'}
            onClose={handleCloseCheckout}
        >
            <form onSubmit={handleSubmit}>
                <h2>Checkout</h2>
                <p>Total Amount: {currencyFormatter.format(cartTotal)}</p>
                <Input label="Full name" type="text" id="name" />
                <Input label="E-mail Address" type="email" id="email" />
                <Input label="Street" type="text" id="street" />
                <div className="control-row">
                    <Input label="Postal Code" type="text" id="postal-code" />
                    <Input label="City" type="text" id="city" />
                </div>

                <p className="modal-actions">
                    <Button type="button" textOnly onClick={handleCloseCheckout}>Close</Button>
                    <Button>Submit Order</Button>
                </p>
            </form>
        </Modal>
    );
}