import type { GetServerSideProps, NextPage } from 'next';
import { FooterBanner, HeroBanner, Product } from '../components';
import { BannerData, Products } from '../interfaces/interfaces';
import { client } from '../lib/client';

interface props {
    products: Products[];
    bannerData: BannerData[];
}

const Home: NextPage<props> = ({ products, bannerData }) => {
    return (
        <>
            <HeroBanner data={bannerData && bannerData[0]} />
            <div className="products-heading">
                <h2>Best Selling Products</h2>
                <p>Speakers of many variations</p>
            </div>
            <div className="products-container">
                {products &&
                    products.map((product) => (
                        <Product key={product._id} product={product} />
                    ))}
            </div>
            <FooterBanner data={bannerData && bannerData[0]} />
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async () => {
    const query = '*[_type == "product"]';
    const products = await client.fetch(query);
    const bannerQuery = '*[_type == "banner"]';
    const bannerData = await client.fetch(bannerQuery);

    return {
        props: {
            products,
            bannerData,
        },
    };
};

export default Home;
