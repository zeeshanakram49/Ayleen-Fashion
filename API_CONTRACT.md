# Aylee Store API Contract

This frontend calls only public backend API endpoints. Payment secrets, Stripe secret keys, JazzCash integrity salt, EasyPaisa merchant credentials, webhook signing secrets, and gateway private keys must stay on the backend.

## Environment

Frontend variables:

```env
VITE_API_BASE_URL=https://your-domain.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxx
VITE_PAYMENT_SUCCESS_URL=https://your-domain.com/#/order-success
VITE_PAYMENT_CANCEL_URL=https://your-domain.com/#/order-failed
```

## Response Shape

Successful responses should use:

```json
{
  "success": true,
  "message": "Optional message",
  "payload": {}
}
```

The frontend also accepts `data` instead of `payload` for compatibility.

Errors should use:

```json
{
  "success": false,
  "message": "Human readable error",
  "errors": {
    "field": ["Validation message"]
  }
}
```

HTTP `401` means the user session expired. The frontend clears local auth and redirects to login.

## Auth

### POST `/api/login`

Request may be JSON or `FormData`:

```json
{
  "email": "customer@example.com",
  "password": "password"
}
```

Response:

```json
{
  "success": true,
  "payload": {
    "token": "bearer-token",
    "user": {
      "id": "1",
      "name": "Customer",
      "email": "customer@example.com",
      "phone": "+923001234567",
      "address": "House 1",
      "city": "Lahore"
    }
  }
}
```

### POST `/api/register`

Request:

```json
{
  "name": "Customer",
  "email": "customer@example.com",
  "password": "password"
}
```

Response is the same as login.

### GET `/api/me`

Requires `Authorization: Bearer <token>`.

Response payload is the current user object.

### POST `/api/logout`

Requires auth. Ends the session on the backend.

## Catalog

### GET `/api/categories`

Response payload:

```json
[
  {
    "id": "men",
    "name": "Men",
    "subtitle": "Textured polos and knit henleys",
    "items": 6,
    "image": "/uploads/category.jpg"
  }
]
```

### GET `/api/products`

May support pagination through `page`.

Response payload:

```json
[
  {
    "id": "p1",
    "slug": "sand-textured-knit-polo",
    "title": "Sand Textured Knit Polo",
    "categoryId": "men",
    "categoryLabel": "Men",
    "tags": ["new-in", "polo"],
    "fit": "Regular Fit",
    "price": 3990,
    "oldPrice": 4990,
    "badge": "New In",
    "image": "/uploads/product.jpg",
    "gallery": ["/uploads/product.jpg"],
    "colors": ["Sand"],
    "description": "Short product copy",
    "details": "Detailed product copy",
    "material": "Textured Knit",
    "stock": 24,
    "sizes": ["S", "M", "L", "XL"],
    "rating": 4.9,
    "reviews": 18
  }
]
```

The frontend can normalize common alternate backend fields such as `name`, `sale_price`, `regular_price`, `category_id`, `photos`, `images`, `quantity`, and `available_sizes`.

### GET `/api/products/:slug`

Returns one product.

### GET `/api/products/search?q=term`

Returns matching products.

### GET `/api/products/featured`

Returns featured products.

## Wishlist

### GET `/api/wishlist`

Requires auth. Returns product IDs or favorite records.

### POST `/api/wishlist/add`

Request:

```json
{
  "productId": "p1"
}
```

### DELETE `/api/wishlist/:productId`

Removes a product from the authenticated user's wishlist.

Legacy compatibility endpoints currently supported by the frontend:

- `GET /api/fetch/favorites`
- `POST /api/add/favorite`
- `POST /api/delete/favorites`

## Cart

Authenticated users sync cart with the backend. Guests use `localStorage`.

### GET `/api/cart`

Response payload:

```json
[
  {
    "productId": "p1",
    "size": "M",
    "qty": 2
  }
]
```

### POST `/api/cart/add`

Request:

```json
{
  "productId": "p1",
  "size": "M",
  "qty": 1
}
```

### POST `/api/cart/update`

Request:

```json
{
  "productId": "p1",
  "size": "M",
  "qty": 3
}
```

### POST `/api/cart/remove`

Request:

```json
{
  "productId": "p1",
  "size": "M"
}
```

### POST `/api/cart/clear`

Clears the authenticated user's cart.

## Orders

### POST `/api/orders`

Request:

```json
{
  "customerDetails": {
    "fullName": "Customer",
    "email": "customer@example.com",
    "phone": "+923001234567"
  },
  "shippingDetails": {
    "address": "House 1, Street 2",
    "city": "Lahore"
  },
  "items": [
    {
      "productId": "p1",
      "size": "M",
      "qty": 1
    }
  ],
  "subtotal": 3990,
  "shipping": 250,
  "tax": 120,
  "total": 4360,
  "paymentMethod": "COD",
  "notes": "Optional note"
}
```

Response:

```json
{
  "success": true,
  "payload": {
    "orderId": "ord_123",
    "total": 4360
  }
}
```

### GET `/api/orders`

Requires auth. Returns order history.

Order shape:

```json
{
  "id": "ord_123",
  "orderNumber": "AY-10001",
  "customerName": "Customer",
  "customerEmail": "customer@example.com",
  "customerPhone": "+923001234567",
  "shippingAddress": "House 1",
  "city": "Lahore",
  "items": [
    {
      "productId": "p1",
      "productTitle": "Sand Textured Knit Polo",
      "qty": 1,
      "price": 3990,
      "size": "M"
    }
  ],
  "subtotal": 3990,
  "shippingFee": 250,
  "tax": 120,
  "total": 4360,
  "paymentMethod": "COD",
  "status": "pending",
  "paymentStatus": "pending",
  "createdAt": "2026-06-30T12:00:00.000Z"
}
```

Valid order statuses: `pending`, `paid`, `failed`, `cancelled`, `shipped`, `delivered`.

### GET `/api/orders/:orderId`

Returns order detail.

### POST `/api/orders/:orderId/cancel`

Cancels an order if backend policy allows it.

## Payments

### Cash on Delivery

The frontend creates the order with `paymentMethod: "COD"`. If order creation succeeds, the frontend clears cart and redirects to `#/order-success/:orderId`.

### Stripe

Frontend never receives the Stripe secret key.

### POST `/api/payments/stripe/create-checkout-session`

Request:

```json
{
  "orderId": "ord_123",
  "amount": 4360,
  "currency": "PKR",
  "customer": {
    "name": "Customer",
    "email": "customer@example.com",
    "phone": "+923001234567"
  },
  "items": [
    {
      "productId": "p1",
      "title": "Sand Textured Knit Polo",
      "price": 3990,
      "qty": 1,
      "size": "M"
    }
  ],
  "successUrl": "https://your-domain.com/#/order-success?orderId=ord_123&session_id={CHECKOUT_SESSION_ID}",
  "cancelUrl": "https://your-domain.com/#/order-failed?orderId=ord_123"
}
```

Response:

```json
{
  "success": true,
  "payload": {
    "checkoutUrl": "https://checkout.stripe.com/c/...",
    "sessionId": "cs_test_..."
  }
}
```

If `checkoutUrl` exists, the frontend redirects to it.

### POST `/api/payments/stripe/verify`

Request:

```json
{
  "orderId": "ord_123",
  "sessionId": "cs_test_..."
}
```

Response should confirm whether the payment is paid.

### JazzCash

### POST `/api/payments/jazzcash/initiate`

Request:

```json
{
  "orderId": "ord_123",
  "amount": 4360,
  "customer": {
    "name": "Customer",
    "email": "customer@example.com",
    "phone": "+923001234567"
  }
}
```

Response may include:

```json
{
  "success": true,
  "payload": {
    "redirectUrl": "https://gateway.example/...",
    "paymentFormFields": {
      "pp_Amount": "436000"
    },
    "transactionRef": "T123",
    "instructions": "Open JazzCash and pay to ..."
  }
}
```

### POST `/api/payments/jazzcash/verify`

Request:

```json
{
  "orderId": "ord_123",
  "transactionRef": "T123"
}
```

### EasyPaisa

### POST `/api/payments/easypaisa/initiate`

Same request and response structure as JazzCash.

### POST `/api/payments/easypaisa/verify`

Same verification structure as JazzCash.

### GET `/api/payments/status/:orderId`

Used by the payment processing screen.

Response:

```json
{
  "success": true,
  "payload": {
    "orderId": "ord_123",
    "paymentStatus": "paid",
    "message": "Payment received"
  }
}
```

Valid payment statuses: `pending`, `paid`, `failed`, `cancelled`.

## Webhooks And Callbacks

Backends should verify payment provider webhooks server-side and update order payment status before returning `paid` to the frontend.

Recommended callbacks:

- Stripe success: `#/order-success?orderId=<id>&session_id=<session>`
- Stripe cancel: `#/order-failed?orderId=<id>&message=Payment%20cancelled`
- Wallet processing: `#/payment-processing/<id>?provider=jazzcash&transactionRef=<ref>`

Frontend verification is a user-facing confirmation layer. Backend webhooks remain the source of truth.
