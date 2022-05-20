import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { BannerData } from '../interfaces/interfaces';
import { urlFor } from '../lib/client';

interface Props {
    data?: BannerData;
}

const HeroBanner: NextPage<Props> = ({ data }) => {
    return (
        <div className="hero-banner-container">
            <div>
                <p className="beats-solo">{data?.smallText}</p>
                <h3>{data?.midText}</h3>
                <h1>{data?.largeText1}</h1>
                <div className="hero-banner-image">
                    {data?.image && (
                        <Image
                            src={urlFor(data?.image).url()}
                            layout="fill"
                            alt={data.desc}
                            priority
                        />
                    )}
                </div>

                <div>
                    <Link href={`/product/${data?.product}`}>
                        <button type="button">{data?.buttonText}</button>
                    </Link>
                    <div className="desc">
                        <h5>Description</h5>
                        <p>{data?.desc}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroBanner;
