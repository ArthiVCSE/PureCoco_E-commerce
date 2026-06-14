# PureCoco E-Commerce Implementation Guide

## ✅ Completed Modules (Today's Build)

### 1. **Product Catalog API** ✓
- All product routes implemented in `/api/products`
- Demo products seeded (6+ coconut oil products with details)
- Search, filters, and category support
- **File:** `backend/models/Product.js`, `backend/controllers/productController.js`

### 2. **Shopping Cart** ✓
- Frontend cart context with add/remove/update quantity
- Persistent cart state management
- **File:** `frontend/src/context/CartContext.jsx`

### 3. **Checkout Flow** ✓
- Two-step checkout: Shipping → Payment Method
- Shipping address validation
- Conditional payment method rendering
- **File:** `frontend/src/pages/Checkout.jsx`

### 4. **Order Management** ✓
- Order creation API: `POST /api/orders`
- Order tracking: `GET /api/orders/my`, `GET /api/orders/:id`
- Admin dashboard: `GET /api/orders` (all orders)
- Order status updates with tracking info
- **File:** `backend/models/Order.js`, `backend/controllers/orderController.js`

### 5. **Stripe Payment Integration** ✓
- **Create Payment Intent:** `POST /api/payments/create-payment-intent`
- **Webhook Handler:** `POST /api/payments/webhook` (for payment_intent.succeeded/failed)
- Automatic order status update on payment success
- Real payment flow ready (requires Stripe API keys)
- **Files:** `backend/controllers/paymentController.js`, `backend/routes/paymentRoutes.js`

### 6. **Email Notifications** ✓
- Order confirmation email on order creation
- Payment receipt email on successful payment
- Configurable via `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASS`
- **File:** `backend/utils/sendEmail.js`

### 7. **Demo Data & Seeding** ✓
- 6 premium coconut oil products with:
  - Real farm traceability
  - Purity metrics (lauric acid, moisture, FFA, peroxide)
  - Batch & harvest dates
  - Multiple images
  - Ratings & reviews
- Demo users (admin + regular user)
- **File:** `backend/seed.js`

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 16+
- MongoDB local or Atlas URI
- Stripe account (for real payments)
- Gmail account (for email testing)

### Backend Setup

```bash
cd backend
npm install
```

**Create `.env` file (copy from `.env.example`):**
```
MONGODB_URI=mongodb://localhost:27017/purecoco
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:3000

# For Testing (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Stripe Keys (optional for now, required for live payments)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CURRENCY=INR
```

**Start MongoDB locally** (if not using Atlas):
```bash
mongod
```

**Run seed script:**
```bash
npm run seed
```

**Start backend:**
```bash
npm run dev
# Server runs on http://localhost:5000
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
# App opens on http://localhost:3000
```

---

## 📋 API Endpoints Summary

### Products
- `GET /api/products` — List all products
- `GET /api/products/:id` — Get product details
- `GET /api/products/search?q=...` — Search

### Orders
- `POST /api/orders` — Create order (requires auth)
- `GET /api/orders/my` — Get my orders (requires auth)
- `GET /api/orders/:id` — Get order details (requires auth)
- `GET /api/orders` — List all orders (admin only)
- `PUT /api/orders/:id/status` — Update order status (admin only)

### Payments
- `POST /api/payments/create-payment-intent` — Create Stripe PaymentIntent (requires auth)
- `POST /api/payments/webhook` — Stripe webhook (public, signature validated)

### Auth
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login & get JWT token

---

## 💳 Payment Flow (End-to-End)

### Scenario 1: Cash on Delivery (COD)
1. Customer fills shipping address → Step 1
2. Selects "Cash on Delivery" → Step 2
3. Clicks "Place Order (COD)"
4. Order created immediately with `paymentStatus: 'pending'`
5. Confirmation email sent
6. Redirected to order tracking page

### Scenario 2: Credit/Debit Card (Stripe)
1. Customer fills shipping address → Step 1
2. Selects "Credit/Debit Card" → Step 2
3. Order created with `paymentStatus: 'pending'`
4. PaymentIntent created (client secret sent to frontend)
5. *[Full integration requires @stripe/react-stripe-js & Elements]*
6. Stripe webhook confirms payment → `paymentStatus: 'paid'`
7. Email receipt sent

---

## 🔐 Environment Variables

**See `.env.example`** for full list. Key variables:

| Variable | Required | Example |
|---|---|---|
| `MONGODB_URI` | Yes | `mongodb://localhost:27017/purecoco` |
| `JWT_SECRET` | Yes | `your_secret_key` |
| `CLIENT_URL` | Yes | `http://localhost:3000` |
| `STRIPE_SECRET_KEY` | For live payments | `sk_test_...` |
| `EMAIL_HOST` | For email | `smtp.gmail.com` |
| `EMAIL_USER` | For email | `your_email@gmail.com` |

---

## 📧 Email Configuration (Gmail)

1. **Enable 2-factor authentication** on your Gmail account
2. **Generate an App Password:**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Copy the 16-character password
3. **Add to `.env`:**
   ```
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=xxxx xxxx xxxx xxxx
   ```

---

## 🎯 Testing the Complete Flow

### Step 1: Register & Login
```
Email: demo@purecoco.com
Password: demo1234
(or register new user)
```

### Step 2: Browse Products
- Go to `/shop` to see 6+ demo products
- Click product → view details
- Add to cart

### Step 3: Checkout
- Go to `/checkout`
- Fill shipping address
- Select payment method (COD for instant test)
- Place order

### Step 4: Verify
- Check console for order confirmation
- See order in `/track/{orderId}`
- Check email inbox for confirmation

---

## 💡 Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Add real Stripe keys (live mode)
- [ ] Configure production MongoDB URI
- [ ] Set up real email service (SendGrid, AWS SES, etc.)
- [ ] Enable HTTPS
- [ ] Set up environment variables on hosting platform
- [ ] Configure Stripe webhook to production URL
- [ ] Test full payment flow with test cards
- [ ] Add SSL certificate
- [ ] Set up monitoring & logging

---

## 🔗 File Structure

```
backend/
├── controllers/
│   ├── orderController.js      (Order CRUD & analytics)
│   ├── paymentController.js    (Stripe integration)
│   └── ...
├── models/
│   ├── Order.js                (Order schema with tracking)
│   ├── Product.js
│   ├── User.js
│   └── ...
├── routes/
│   ├── orderRoutes.js
│   ├── paymentRoutes.js
│   └── ...
├── utils/
│   └── sendEmail.js            (Email utility)
├── seed.js                     (Demo data)
├── server.js                   (Main app entry)
└── .env.example

frontend/
├── src/
│   ├── pages/
│   │   └── Checkout.jsx        (2-step checkout)
│   ├── services/
│   │   ├── api.js
│   │   └── paymentService.js   (Stripe API calls)
│   ├── context/
│   │   └── CartContext.jsx     (Cart state)
│   └── ...
└── package.json
```

---

## 🆘 Troubleshooting

**"Cannot POST /api/orders"**
- Ensure auth token is sent in headers
- Check JWT_SECRET matches

**"Email not sending"**
- Verify EMAIL_HOST, EMAIL_USER, EMAIL_PASS in `.env`
- For Gmail: Enable "Less secure app access" OR use App Password

**"Stripe webhook not working"**
- Install Stripe CLI locally: `brew install stripe/stripe-cli/stripe`
- Run: `stripe listen --forward-to localhost:5000/api/payments/webhook`
- Copy webhook secret to `.env` as `STRIPE_WEBHOOK_SECRET`

**"MongoDB connection error"**
- Ensure `mongod` is running
- Check `MONGODB_URI` format
- For Atlas: ensure IP is whitelisted

---

## 📚 Next Steps (Optional Future Enhancements)

- [ ] Implement UPI payment gateway
- [ ] Add order return/refund flow
- [ ] Implement wishlist feature
- [ ] Add admin dashboard UI
- [ ] Set up real CDN for images
- [ ] Implement coupons/promotions validation
- [ ] Add SMS notifications
- [ ] Implement review moderation
- [ ] Add analytics dashboard
- [ ] Implement subscription products (premium tea club, etc.)

---

**Status:** ✅ **Ready for Testing**

All critical e-commerce modules are integrated and ready to test. Seed the database, set up environment variables, and start selling coconut oil! 🥥
