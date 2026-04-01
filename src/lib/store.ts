import type { Route } from '../types/store';

export const money = (amount: number) => `PKR ${amount.toLocaleString('en-PK')}`;

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
  if (base === 'about') return { page: 'about' };
  if (base === 'contact') return { page: 'contact' };
  return { page: 'home' };
}
