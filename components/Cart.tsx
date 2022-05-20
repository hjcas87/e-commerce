import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import toast from 'react-hot-toast';
import {
    AiOutlineLeft,
    AiOutlineMinus,
    AiOutlinePlus,
    AiOutlineShopping,
} from 'react-icons/ai';
import { TiDeleteOutline } from 'react-icons/ti';
import { useStateContext } from '../context/StateContext';
import { urlFor } from '../lib/client';
import getStripe from '../lib/getStripe';

interface res extends Response {
    statusCode?: number;
}

const Cart = () => {
    const cartRef = useRef<HTMLDivElement | null>(null);
    const {
        cartItems,
        totalQuantities,
        totalPrice,
        setShowCart,
        toggleCartItemQuantity,
        onRemove,
    } = useStateContext();

    const handleCheckout = async () => {
        const stripe = await getStripe();

        const response: res = await fetch('/api/stripe', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(cartItems),
        });

        if (response.statusCode === 500) return;

        const data = await response.json();

        toast.loading('Redirecting...');

        stripe?.redirectToCheckout({sessionId: data.id})
    };

    return (
        <div className="cart-wrapper" ref={cartRef}>
            <div className="cart-container">
                <button
                    className="cart-heading"
                    type="button"
                    onClick={() => setShowCart(false)}
                >
                    <AiOutlineLeft />
                    <span className="heading">Your Cart</span>
                    <span className="cart-num-items">
                        ({totalQuantities} items)
                    </span>
                </button>

                {cartItems.length < 1 && (
                    <div className="empty-cart">
                        <AiOutlineShopping size={150} />
                        <h3>Your shopping bag is empty</h3>
                        <Link href="/">
                            <button
                                className="btn"
                                type="button"
                                onClick={() => setShowCart(false)}
                            >
                                Continue Shopping
                            </button>
                        </Link>
                    </div>
                )}
                <div className="product-container">
                    {cartItems.length >= 1 &&
                        cartItems.map((item) => (
                            <div key={item._id} className="product">
                                <div className="cart-product-image">
                                    <Image
                                        src={urlFor(item?.image[0]).url()}
                                        alt={item?.name}
                                        width={180}
                                        height={180}
                                    />
                                </div>
                                <div className="item-desc">
                                    <div className="flex top">
                                        <h5>{item.name}</h5>
                                        <h5>${item.price}</h5>
                                    </div>
                                    <div className="flex bottom">
                                        <div>
                                            <p className="quantity-desc">
                                                <span
                                                    className="minus"
                                                    onClick={() =>
                                                        toggleCartItemQuantity(
                                                            item._id,
                                                            'dec'
                                                        )
                                                    }
                                                >
                                                    <AiOutlineMinus />
                                                </span>
                                                <span className="num">
                                                    {item.quantity}
                                                </span>
                                                <span
                                                    className="plus"
                                                    onClick={() =>
                                                        toggleCartItemQuantity(
                                                            item._id,
                                                            'inc'
                                                        )
                                                    }
                                                >
                                                    <AiOutlinePlus />
                                                </span>
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            className="remove-item"
                                            onClick={() => onRemove(item._id)}
                                        >
                                            <TiDeleteOutline />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
                {cartItems.length >= 1 && (
                    <div className="cart-bottom">
                        <div className="total">
                            <h3>Subtotal: </h3>
                            <h3>${totalPrice}</h3>
                        </div>
                        <div className="btn-container">
                            <button
                                type="button"
                                className="btn"
                                onClick={handleCheckout}
                            >
                                Pay with Stripe
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
