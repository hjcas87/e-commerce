export interface BannerData {
    buttonText: string;
    desc: string;
    discount: string;
    image: Image;
    largeText1: string;
    largeText2: string;
    midText: string;
    product: string;
    saleTime: string;
    smallText: string;
    _id: string;
    // _createdAt: string;
    // _rev: string;
    // _type: string;
    // _updatedAt: string;
}

export interface Image {
    assets: Assets;
    _type: string;
}
export interface Assets {
    _ref: string;
    _type: string;
}

export interface Products {
    details: string;
    _id: string;
    image: ImageProduct[];
    name: string;
    price: number;
    slug: Slug;
    quantity: number | undefined
}

export interface ImageProduct {
    _key: string;
    asset: Assets;
    _type: string;
}

export interface Slug {
    current: string;
    _type: string;
}
