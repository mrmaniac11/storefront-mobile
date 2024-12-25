import { Product, Collection } from './types';
import { Dimensions } from 'react-native';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

let productCardWidth = screenWidth * 0.47;

let productCardHeight = screenHeight * 0.4
if (screenHeight > 800) {
  productCardHeight = screenHeight * 0.37
}

let productCardWidthLarge = screenWidth * 0.9;

let productCardHeightLarge = screenHeight * 0.8
if (screenHeight > 800) {
  productCardHeightLarge = screenHeight * 0.9
}
const PRODUCT_DESCRIPTIONS = [
  'A high-quality product with amazing features and premium materials.',
  'An innovative product designed to meet your needs.',
  'A stylish and modern product that stands out.',
  'A durable and reliable product for everyday use.',
  'A premium product with exceptional performance.',
  'A versatile product suitable for various applications.',
  'A compact and portable product for convenience.',
  'A user-friendly product with intuitive controls.',
  'A cost-effective product offering great value.',
  'A top-rated product with excellent reviews.',
];


const PRODUCT_IMAGES = [
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f',
  'https://images.unsplash.com/photo-1491553895911-0055eca6402d',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
  'https://plus.unsplash.com/premium_photo-1675431443027-ad1f46c93c8d?q=80&&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
];

export function generateMockProducts(page: number, limit: number): Promise<Product[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const products = Array.from({ length: limit }, (_, i) => ({
        id: `product-${Date.now()}-${page}-${i}`,
        title: PRODUCT_DESCRIPTIONS[i % PRODUCT_DESCRIPTIONS.length],
        price: Math.floor(Math.random() * 900) + 100,
        image_url: `${PRODUCT_IMAGES[i % PRODUCT_IMAGES.length]}?w=${productCardWidth}&h=${productCardHeight}&fit=crop`,
        image_url_large: `${PRODUCT_IMAGES[i % PRODUCT_IMAGES.length]}?w=${productCardWidthLarge}&h=${productCardHeightLarge}&fit=crop`,

        affiliate_url: `Product ${page * limit + i + 1}`,
      }));
      resolve(products);
    }, 800);
  });
}

const COLLECTION_IMAGES = [
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
  'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04',
  'https://images.unsplash.com/photo-1472851294608-062f824d29cc',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
  `https://images.unsplash.com/photo-1524883173980-67b26d34e82c?q=80&2970&auto=format&fit=crop&w=${productCardWidth}&h=${productCardHeight}&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`
];

export function generateMockCollections(page: number, limit: number): Promise<Collection[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const collections = Array.from({ length: limit }, (_, i) => ({
        index: i,
        id: `collection-${Date.now()}-${page}-${i}`,
        name: `Collection ${page * limit + i + 1}`,
        name: [
          'Diwali Outfit',
          'Christmas Outfit',
          'Party Day',
          'Night Outfits',
          'Budget Friendly',
          'Casual Wear',
          'Formal Attire',
          'Summer Collection',
          'Winter Collection'
        ][i % 9],
        description: 'A carefully curated collection of premium products.',
        image_url: `${COLLECTION_IMAGES[i % COLLECTION_IMAGES.length]}?w=600&fit=crop`,
        media_ind: true,
        total_products: Math.floor(Math.random() * 50) + 10,
        media_data: {
          id: `media-${Date.now()}-${page}-${i}`,
          media_id: `media-${Date.now()}-${page}-${i}`,
          media_type: 'Reel',
          media_source: 'instagram',
          thumbnail_url: `${COLLECTION_IMAGES[i % COLLECTION_IMAGES.length]}?w=600&fit=crop`,
        }
      }));
      resolve(collections);
    }, 800);
  });
}