import type { Category, CheckoutState, Product, Service, Testimonial } from '../types/store';

export const categories: Category[] = [
  {
    id: 'women',
    name: 'Women',
    subtitle: 'Elegant cuts for daily polish and festive evenings',
    items: 128,
    image:
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1400&auto=format&fit=crop',
  },
  {
    id: 'men',
    name: 'Men',
    subtitle: 'Refined street tailoring with premium essentials',
    items: 96,
    image:
      'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?q=80&w=1400&auto=format&fit=crop',
  },
  {
    id: 'juniors',
    name: 'Juniors',
    subtitle: 'Comfort-forward silhouettes built for movement',
    items: 74,
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1400&auto=format&fit=crop',
  },
  {
    id: 'accessories',
    name: 'Accessories',
    subtitle: 'Premium details that complete every look',
    items: 53,
    image:
      'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1400&auto=format&fit=crop',
  },
];

export const products: Product[] = [
  {
    id: 'p1',
    slug: 'silk-line-co-ord',
    title: 'Silk Line Co-ord',
    categoryId: 'women',
    categoryLabel: 'Women',
    fit: 'Relaxed Fit',
    price: 8490,
    oldPrice: 10990,
    badge: 'Best Seller',
    image:
      'https://images.unsplash.com/photo-1551163943-3f7e29e16c14?q=80&w=1400&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1551163943-3f7e29e16c14?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1464863979621-258859e62245?q=80&w=1200&auto=format&fit=crop',
    ],
    colors: ['Ivory', 'Sand', 'Espresso'],
    description: 'Luxe drape with fluid movement and sharp neckline.',
    details:
      'Designed for all-day wear with breathable silk blend, hidden side zip, and elevated fall.',
    material: 'Silk Blend',
    stock: 18,
    sizes: ['XS', 'S', 'M', 'L'],
    rating: 4.9,
    reviews: 132,
  },
  {
    id: 'p2',
    slug: 'linen-overshirt',
    title: 'Linen Overshirt',
    categoryId: 'men',
    categoryLabel: 'Men',
    fit: 'Regular Fit',
    price: 6290,
    oldPrice: 7690,
    badge: 'New In',
    image:
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1400&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1200&auto=format&fit=crop',
    ],
    colors: ['Stone', 'Olive', 'Black'],
    description: 'Structured linen overshirt for polished layering.',
    details:
      'Premium linen weave, contrast buttons, and relaxed shoulder line for modern tailoring.',
    material: 'Pure Linen',
    stock: 26,
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.8,
    reviews: 88,
  },
  {
    id: 'p3',
    slug: 'refined-cargo-trouser',
    title: 'Refined Cargo Trouser',
    categoryId: 'men',
    categoryLabel: 'Men',
    fit: 'Tapered Fit',
    price: 5990,
    oldPrice: 7190,
    badge: 'Limited',
    image:
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1400&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=1200&auto=format&fit=crop',
    ],
    colors: ['Black', 'Khaki', 'Slate'],
    description: 'Street-ready utility with sleek taper silhouette.',
    details:
      'Soft twill body, practical pocket construction, and refined ankle crop for clean footwear pairing.',
    material: 'Cotton Twill',
    stock: 31,
    sizes: ['M', 'L', 'XL'],
    rating: 4.7,
    reviews: 63,
  },
  {
    id: 'p4',
    slug: 'signature-white-shirt',
    title: 'Signature White Shirt',
    categoryId: 'women',
    categoryLabel: 'Women',
    fit: 'Tailored Fit',
    price: 4690,
    oldPrice: 5490,
    badge: 'AYLEEN Edit',
    image:
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=1400&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?q=80&w=1200&auto=format&fit=crop',
    ],
    colors: ['White', 'Cloud', 'Blue Stripe'],
    description: 'Crisp classic shirt upgraded with luxe finish.',
    details:
      'Button-down collar, mother-of-pearl style buttons, and anti-crease finish for daily confidence.',
    material: 'Mercerized Cotton',
    stock: 39,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.9,
    reviews: 204,
  },
  {
    id: 'p5',
    slug: 'urban-leather-sneaker',
    title: 'Urban Leather Sneaker',
    categoryId: 'accessories',
    categoryLabel: 'Accessories',
    fit: 'Comfort Fit',
    price: 9990,
    oldPrice: 11590,
    badge: 'Premium',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1400&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1200&auto=format&fit=crop',
    ],
    colors: ['White', 'Black', 'Tan'],
    description: 'Minimal leather sneaker with superior comfort.',
    details:
      'Cushioned sole, stitched leather upper, and breathable lining for elevated all-day movement.',
    material: 'Top Grain Leather',
    stock: 24,
    sizes: ['40', '41', '42', '43', '44'],
    rating: 4.8,
    reviews: 97,
  },
  {
    id: 'p6',
    slug: 'luxe-tote-bag',
    title: 'Luxe Tote Bag',
    categoryId: 'accessories',
    categoryLabel: 'Accessories',
    fit: 'Structured',
    price: 7490,
    oldPrice: 8990,
    badge: 'Back In Stock',
    image:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1400&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=1200&auto=format&fit=crop',
    ],
    colors: ['Mocha', 'Black', 'Taupe'],
    description: 'Structured tote with minimalist hardware.',
    details:
      'Spacious interior, magnetic closure, and reinforced handles to carry essentials elegantly.',
    material: 'Vegan Leather',
    stock: 14,
    sizes: ['One Size'],
    rating: 4.8,
    reviews: 59,
  },
  {
    id: 'p7',
    slug: 'noir-abaya-set',
    title: 'Noir Abaya Set',
    categoryId: 'women',
    categoryLabel: 'Women',
    fit: 'Flowing Fit',
    price: 11990,
    oldPrice: 13990,
    badge: 'Signature',
    image:
      'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=1400&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?q=80&w=1200&auto=format&fit=crop',
    ],
    colors: ['Black', 'Onyx', 'Charcoal'],
    description: 'Flowing premium abaya with contrast inner.',
    details:
      'Tailored front line, fluid sleeves, and elegant drape for formal and semi-formal styling.',
    material: 'Nida Premium',
    stock: 12,
    sizes: ['S', 'M', 'L'],
    rating: 4.9,
    reviews: 44,
  },
  {
    id: 'p8',
    slug: 'soft-denim-jacket',
    title: 'Soft Denim Jacket',
    categoryId: 'juniors',
    categoryLabel: 'Juniors',
    fit: 'Relaxed Fit',
    price: 5390,
    oldPrice: 6490,
    badge: 'Top Rated',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1400&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop',
    ],
    colors: ['Washed Blue', 'Ink', 'Grey'],
    description: 'Lightweight denim layer for all-season use.',
    details:
      'Soft wash texture, metal button closure, and versatile fit for casual daily styling.',
    material: 'Soft Wash Denim',
    stock: 22,
    sizes: ['XS', 'S', 'M', 'L'],
    rating: 4.7,
    reviews: 73,
  },
  {
    id: 'p9',
    slug: 'pleated-lawn-shirt',
    title: 'Pleated Lawn Shirt',
    categoryId: 'women',
    categoryLabel: 'Women',
    fit: 'Straight Fit',
    price: 4390,
    oldPrice: 5690,
    badge: 'Summer Pick',
    image:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1400&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1495385794356-15371f348c31?q=80&w=1200&auto=format&fit=crop',
    ],
    colors: ['Rose', 'Mint', 'Ivory'],
    description: 'Airy lawn shirt finished with delicate pleat details.',
    details:
      'Easy straight fit with soft breathable fabric, tonal stitchwork, and a refined everyday silhouette.',
    material: 'Premium Lawn',
    stock: 28,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.8,
    reviews: 91,
  },
  {
    id: 'p10',
    slug: 'tailored-waistcoat-set',
    title: 'Tailored Waistcoat Set',
    categoryId: 'men',
    categoryLabel: 'Men',
    fit: 'Slim Fit',
    price: 13490,
    oldPrice: 15490,
    badge: 'Occasion Wear',
    image:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1400&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop',
    ],
    colors: ['Navy', 'Charcoal', 'Camel'],
    description: 'Sharp formal set cut for festive and evening dressing.',
    details:
      'A clean three-piece inspired profile with polished buttons, soft lining, and tailored structure.',
    material: 'Tropical Blend',
    stock: 11,
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.9,
    reviews: 57,
  },
  {
    id: 'p11',
    slug: 'weekend-canvas-backpack',
    title: 'Weekend Canvas Backpack',
    categoryId: 'accessories',
    categoryLabel: 'Accessories',
    fit: 'Utility',
    price: 5190,
    oldPrice: 6390,
    badge: 'Travel Ready',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200&auto=format&fit=crop',
    ],
    colors: ['Olive', 'Sand', 'Black'],
    description: 'Utility canvas backpack with premium finishing touches.',
    details:
      'Spacious multi-pocket layout, padded straps, and durable canvas body for daily movement.',
    material: 'Waxed Canvas',
    stock: 34,
    sizes: ['One Size'],
    rating: 4.7,
    reviews: 66,
  },
  {
    id: 'p12',
    slug: 'athleisure-track-set',
    title: 'Athleisure Track Set',
    categoryId: 'juniors',
    categoryLabel: 'Juniors',
    fit: 'Loose Fit',
    price: 5790,
    oldPrice: 6990,
    badge: 'Campus Edit',
    image:
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1400&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop',
    ],
    colors: ['Ash', 'Cherry', 'Midnight'],
    description: 'Relaxed matching set built for comfort and sharp casual styling.',
    details:
      'Soft brushed knit, ribbed hems, and easy movement fit designed for everyday campus wear.',
    material: 'Cotton Fleece',
    stock: 21,
    sizes: ['XS', 'S', 'M', 'L'],
    rating: 4.8,
    reviews: 82,
  },
];

export const services: Service[] = [
  {
    title: 'Nationwide Express',
    detail: 'Free delivery across Pakistan above PKR 6,000.',
  },
  {
    title: 'Easy Exchange',
    detail: '7-day exchange policy with smooth pickup process.',
  },
  {
    title: 'Secure Checkout',
    detail: 'COD and card payments with encrypted checkout.',
  },
  {
    title: 'Style Assistance',
    detail: 'Curated recommendations from our in-house team.',
  },
];

export const testimonials: Testimonial[] = [
  {
    name: 'Maham Tariq',
    city: 'Lahore',
    quote:
      'Fabric quality is honestly premium. Fits came exactly as shown and delivery was super fast.',
  },
  {
    name: 'Usman Raza',
    city: 'Karachi',
    quote:
      'The men collection has clean cuts and smart stitching. Great for office and evening both.',
  },
  {
    name: 'Areeba Khan',
    city: 'Islamabad',
    quote:
      'Packaging, quality and support team all feel professional. My go-to brand for gifting now.',
  },
];

export const navLinks = [
  { href: '#/', label: 'HOME' },
  { href: '#/shop', label: 'SHOP' },
  { href: '#/about', label: 'ABOUT' },
  { href: '#/contact', label: 'CONTACT' },
];

export const initialCheckout: CheckoutState = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  payment: 'COD',
  note: '',
};
