import {
    createContext,
    Dispatch,
    SetStateAction,
    useContext,
    useEffect,
    useState,
} from 'react';
import toast from 'react-hot-toast';
import { Products } from '../interfaces/interfaces';

interface ContextValues {
    showCart: boolean;
    setShowCart: Dispatch<SetStateAction<boolean>>;
    cartItems: Products[] | [];
    totalPrice: number;
    totalQuantities: number;
    qty: number;
    incQty: () => void;
    decQty: () => void | 1;
    onAdd: (product: Products, quantity: number) => void;
    toggleCartItemQuantity: (id: string, value: 'inc' | 'dec') => void;
    onRemove: (id: string) => void;
    setCartItems: Dispatch<SetStateAction<[] | Products[]>>;
    setTotalPrice: Dispatch<SetStateAction<number>>;
    setTotalQuantities: Dispatch<SetStateAction<number>>;
}

export const Context = createContext({} as ContextValues);

interface Props {
    children: JSX.Element | JSX.Element[];
}

export const StateContext = ({ children }: Props) => {
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState<Products[] | []>([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantities, setTotalQuantities] = useState(0);
    const [qty, setQty] = useState(1);

    let foundProduct: Products | undefined;

    const toggleCartItemQuantity = (id: string, value: 'inc' | 'dec') => {
        foundProduct = cartItems.find((item) => item._id === id);

        if (value === 'inc') {
            setCartItems(
                cartItems.map((item) =>
                    item._id === foundProduct?._id
                        ? {
                              ...foundProduct,
                              quantity:
                                  foundProduct.quantity &&
                                  foundProduct?.quantity + 1,
                          }
                        : item
                )
            );
            setTotalPrice((prevTotalPrice) =>
                foundProduct && foundProduct.quantity
                    ? prevTotalPrice + foundProduct.price
                    : prevTotalPrice
            );
            setTotalQuantities((prevTotalQuantities) =>
                foundProduct && foundProduct.quantity
                    ? prevTotalQuantities + 1
                    : prevTotalQuantities
            );
        } else if (value === 'dec') {
            if (foundProduct?.quantity && foundProduct?.quantity > 1) {
                setCartItems(
                    cartItems.map((item) =>
                        item._id === foundProduct?._id
                            ? {
                                  ...foundProduct,
                                  quantity:
                                      foundProduct.quantity &&
                                      foundProduct?.quantity - 1,
                              }
                            : item
                    )
                );
                setTotalPrice((prevTotalPrice) =>
                    foundProduct && foundProduct.quantity
                        ? prevTotalPrice - foundProduct.price
                        : prevTotalPrice
                );
                setTotalQuantities((prevTotalQuantities) =>
                    foundProduct && foundProduct.quantity
                        ? prevTotalQuantities - 1
                        : prevTotalQuantities
                );
            }
        }
    };

    const onRemove = (id: string) => {
        const item = cartItems.find((item) => item._id === id);
        setCartItems(cartItems.filter((item) => item._id !== id));
        setTotalPrice((prevTotalPrice) =>
            item && item.quantity
                ? prevTotalPrice - item.price * item.quantity
                : prevTotalPrice
        );
        setTotalQuantities((prevTotalQuantities) =>
            item && item.quantity
                ? prevTotalQuantities - item.quantity
                : prevTotalQuantities
        );
    };

    const onAdd = (product: Products, quantity: number) => {
        const checkProductInCart = cartItems.find(
            (item) => item._id === product._id
        );
        setTotalPrice(
            (prevTotalPrice) => prevTotalPrice + product.price * quantity
        );
        setTotalQuantities(
            (prevTotalQuantities) => prevTotalQuantities + quantity
        );

        if (checkProductInCart) {
            const updatedCartItems = cartItems.map((cartProduct) =>
                cartProduct._id === product._id
                    ? {
                          ...cartProduct,
                          quantity:
                              cartProduct.quantity &&
                              cartProduct.quantity + quantity,
                      }
                    : cartProduct
            );
            setCartItems(updatedCartItems);
        } else {
            product.quantity = quantity;
            setCartItems([...cartItems, { ...product }]);
        }
        setQty(1);
        toast.success(`${qty} ${product.name} added to the cart.`);
    };
    useEffect(() => {
        console.log(cartItems);
    }, [cartItems]);

    const incQty = () => {
        setQty((prevQty) => prevQty + 1);
    };
    const decQty = () => {
        if (qty - 1 < 1) return 1;

        return setQty((prevQty) => prevQty - 1);
    };

    return (
        <Context.Provider
            value={{
                showCart,
                cartItems,
                totalPrice,
                totalQuantities,
                qty,
                incQty,
                decQty,
                onAdd,
                setShowCart,
                toggleCartItemQuantity,
                onRemove,
                setCartItems,
                setTotalPrice,
                setTotalQuantities,
            }}
        >
            {children}
        </Context.Provider>
    );
};

export const useStateContext = () => useContext(Context);
