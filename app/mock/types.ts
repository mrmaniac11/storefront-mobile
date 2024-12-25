export interface Product {
  id: string | null;
  description: string;
  price: number;
  image_url: string;
  affiliate_url: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
}

export interface User {
  name: string;
  productCount: number;
  collectionCount: number;
  avatar: string;
}