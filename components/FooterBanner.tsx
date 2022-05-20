import Image from 'next/image';
import Link from 'next/link';
import { BannerData } from '../interfaces/interfaces';
import { urlFor } from '../lib/client';

interface Props {
    data: BannerData;
}
const FooterBanner = ({ data }: Props) => {
    return (
        <div className="footer-banner-container">
            <div className="banner-desc">
                <div className="left">
                    <p>{data?.discount}</p>
                    <h3>{data?.largeText1}</h3>
                    <h3>{data?.largeText2}</h3>
                    <p>{data?.saleTime}</p>
                </div>
                <div className="right">
                    <p>{data?.smallText}</p>
                    <h3>{data?.midText}</h3>
                    <p>{data?.desc}</p>
                    <Link href={`/product/${data?.product}`}>
                        <button type="button">{data?.buttonText}</button>
                    </Link>
                </div>
                <div className="footer-banner-image">
                    {data?.image && (
                        <Image
                            src={urlFor(data?.image).url()}
                            layout="fill"
                            alt={data.desc}
                            priority
                            objectFit='cover'
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default FooterBanner;
