import type { Route } from '../types/store';

export const money = (amount: number) => `PKR ${amount.toLocaleString('en-PK')}`;
export const discountPercent = (price: number, oldPrice: number) =>
  Math.max(0, Math.round(((oldPrice - price) / oldPrice) * 100));
export const installmentAmount = (amount: number) => Math.round(amount / 3);

export const shippingFee = (subtotal: number) => (subtotal > 6000 ? 0 : 250);

export const taxAmount = (subtotal: number) => Math.round(subtotal * 0.03);

export const orderTotal = (subtotal: number) => subtotal + shippingFee(subtotal) + taxAmount(subtotal);

export function parseHash(): Route {
  const raw = window.location.hash.replace(/^#/, '');
  const path = raw || '/';
  const [base, maybeSlug] = path.split('/').filter(Boolean);

  if (!base) return { page: 'home' };
  if (base === 'shop') return { page: 'shop' };
  if (base === 'product' && maybeSlug) return { page: 'product', slug: maybeSlug };
  if (base === 'wishlist') return { page: 'wishlist' };
  if (base === 'cart') return { page: 'cart' };
  if (base === 'checkout') return { page: 'checkout' };
  if (base === 'account') return { page: 'account' };
  if (base === 'login') return { page: 'login' };
  if (base === 'register') return { page: 'register' };
  if (base === 'about') return { page: 'about' };
  if (base === 'contact') return { page: 'contact' };
  return { page: 'home' };
}
