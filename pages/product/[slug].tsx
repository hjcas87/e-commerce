import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import { ParsedUrlQuery } from 'querystring';
import { useState } from 'react';
import {
    AiFillStar,
    AiOutlineMinus,
    AiOutlinePlus,
    AiOutlineStar,
} from 'react-icons/ai';
import { Product } from '../../components';
import { useStateContext } from '../../context/StateContext';
import { Products } from '../../interfaces/interfaces';
import { client, urlFor } from '../../lib/client';

interface Props {
    products: Products[];
    product: Products;
}
interface Params extends ParsedUrlQuery {
    slug: string;
}

const ProductDetails = ({ products, product }: Props) => {
    const [index, setIndex] = useState(0);

    const { decQty, incQty, qty, onAdd, setShowCart } = useStateContext();

    const handleBuyNow = () => {
        onAdd(product, qty);
        setShowCart(true);
    };

    return (
        <div>
            <div className="product-detail-container">
                <div>
                    <div className="image-container">
                        <div className="product-detail-image">
                            <Image
                                src={
                                    product.image.length
                                        ? urlFor(product.image[index]).url()
                                        : ''
                                }
                                alt={product.name}
                                width={450}
                                height={450}
                                objectFit="contain"
                            />
                        </div>
                    </div>
                    <div className="small-images-container">
                        {product.image?.map((item, i) => (
                            <Image
                                key={i}
                                src={urlFor(item).url()}
                                className={
                                    i === index
                                        ? 'small-image selected-image'
                                        : 'small-image'
                                }
                                onMouseEnter={() => setIndex(i)}
                                alt={product.name}
                                width={70}
                                height={70}
                            />
                        ))}
                    </div>
                </div>
                <div className="product-detail-desc">
                    <h1>{product.name}</h1>
                    <div className="reviews">
                        <div>
                            <AiFillStar />
                            <AiFillStar />
                            <AiFillStar />
                            <AiFillStar />
                            <AiOutlineStar />
                        </div>
                        <p>(20)</p>
                    </div>
                    <h4>Details: </h4>
                    <p>{product.details}</p>
                    <p className="price">${product.price}</p>
                    <div className="quantity">
                        <h3>Quantity: </h3>
                        <p className="quantity-desc">
                            <span className="minus" onClick={decQty}>
                                <AiOutlineMinus />
                            </span>
                            <span className="num">{qty}</span>
                            <span className="minus" onClick={incQty}>
                                <AiOutlinePlus />
                            </span>
                        </p>
                    </div>
                    <div className="buttons">
                        <button
                            type="button"
                            className="add-to-cart"
                            onClick={() => onAdd(product, qty)}
                        >
                            Add to Cart
                        </button>
                        <button
                            type="button"
                            className="buy-now"
                            onClick={handleBuyNow}
                        >
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
            <div className="maylike-products-wrapper">
                <h2>You may also like</h2>
                <div className="marquee">
                    <div className="maylike-products-container track">
                        {products.map((item) => (
                            <Product product={item} key={item._id} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const getStaticPaths: GetStaticPaths = async () => {
    const query = `*[_type == "product"]{
    slug {
      current
    }
  }`;
    const products = await client.fetch(query);
    console.log(products);
    const paths = products.map((product: { slug: { current: any } }) => ({
        params: {
            slug: product.slug.current,
        },
    }));
    return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { slug } = params as Params;
    const query = `*[_type == "product" && slug.current == '${slug}'][0]`;
    const productsQuery = '*[_type == "product"]';
    const product = await client.fetch(query);
    const products = await client.fetch(productsQuery);

    return {
        props: {
            products,
            product,
        },
    };
};

export default ProductDetails;
