export type Category = {
  id: string;
  name: string;
  subtitle: string;
  items: number;
  image: string;
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  categoryId: string;
  categoryLabel: string;
  tags: string[];
  fit: string;
  price: number;
  oldPrice: number;
  badge: string;
  image: string;
  gallery: string[];
  colors: string[];
  description: string;
  details: string;
  material: string;
  stock: number;
  sizes: string[];
  rating: number;
  reviews: number;
};

export type Service = {
  title: string;
  detail: string;
};

export type Testimonial = {
  name: string;
  city: string;
  quote: string;
};

export type CartItem = {
  productId: string;
  size: string;
  qty: number;
};

export type CheckoutState = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  payment: 'COD' | 'CARD' | 'JAZZCASH' | 'EASYPAISA' | 'BANK';
  note: string;
  jazzcashMobile?: string;
  cnicLast6?: string;
  easypaisaMobile?: string;
  easypaisaName?: string;
  cardName?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  bankScreenshot?: string | null; // Base64 or filename placeholder
};

export type Route =
  | { page: 'home' }
  | { page: 'shop' }
  | { page: 'men' }
  | { page: 'women' }
  | { page: 'juniors' }
  | { page: 'new-arrivals' }
  | { page: 'sale' }
  | { page: 'product'; slug: string }
  | { page: 'wishlist' }
  | { page: 'cart' }
  | { page: 'checkout' }
  | { page: 'account' }
  | { page: 'about' }
  | { page: 'contact' }
  | { page: 'track-order' }
  | { page: 'search' };

export type CartRow = CartItem & { product: Product };

export type Notice = {
  kind: 'success' | 'info';
  message: string;
};

