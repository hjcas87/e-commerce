import Image from 'next/image';
import Link from 'next/link';
import { Products } from '../interfaces/interfaces';
import { urlFor } from '../lib/client';

interface Props {
    product: Products;
}

const Product = ({ product }: Props) => {
    const { _id, details, image, name, price, slug } = product;
    return (
        <div>
            <Link href={`/product/${slug.current}`}>
                <div className="product-card">
                    <div className="product-image">
                        {!!image.length && (
                            <Image
                                src={urlFor(image[0]).url()}
                                alt={name}
                                width={250}
                                height={250}
                            />
                        )}
                    </div>
                      <p className="product-name">{name}</p>
                      <p className="product-price">${price}</p>
                </div>
            </Link>
        </div>
    );
};

export default Product;
