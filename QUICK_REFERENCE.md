# 🚀 PureCoco Quick Reference Card

## ⚡ Get Started in 5 Steps

```bash
# 1. Install (Windows)
setup.bat

# 2. Configure
cp backend/.env.example backend/.env
# (Fill in: MONGODB_URI, JWT_SECRET, EMAIL_*, STRIPE_*)

# 3. Seed Database
cd backend
npm run seed

# 4. Start Backend (Terminal 1)
npm run dev

# 5. Start Frontend (Terminal 2)
cd frontend
npm start
```

**URLs:** Frontend: http://localhost:3000 | Backend: http://localhost:5000

---

## 👤 Test Accounts

| Role | Email | Password |
|---|---|---|
| Customer | demo@purecoco.com | demo1234 |
| Admin | admin@purecoco.com | admin1234 |

---

## ✅ What's Ready to Test

- [x] **Browse Products** → Visit `/shop`
- [x] **Add to Cart** → Click "Add to Cart" on any product
- [x] **Checkout (COD)** → Go to `/checkout` → Select "Cash on Delivery"
- [x] **Place Order** → Click "Place Order (COD)"
- [x] **Track Order** → View order in `/track/{orderId}`
- [x] **Order History** → See all orders in `/dashboard`
- [x] **Admin Orders** → Admin can view & update order status
- [x] **Email Confirmation** → Check email for confirmation

---

## 📡 API Quick Links

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/api/products` | ❌ | List products |
| POST | `/api/orders` | ✅ | Create order |
| GET | `/api/orders/my` | ✅ | My orders |
| GET | `/api/orders/:id` | ✅ | Order details |
| PUT | `/api/orders/:id/status` | ✅ Admin | Update order status |
| POST | `/api/payments/create-payment-intent` | ✅ | Create Stripe PaymentIntent |
| POST | `/api/payments/webhook` | ❌ | Stripe webhook |
| POST | `/api/auth/login` | ❌ | Login |
| POST | `/api/auth/register` | ❌ | Register |

---

## 🔑 Environment Variables Needed

```env
# Database
MONGODB_URI=mongodb://localhost:27017/purecoco

# Auth
JWT_SECRET=your_secret_key

# CORS
CLIENT_URL=http://localhost:3000

# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Stripe (Optional for live payments)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Gmail Setup:**
1. Enable 2FA on Gmail account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use 16-char password in `.env`

---

## 📦 Demo Products Included

| Product | Price | Category | Stock |
|---|---|---|---|
| Virgin Cold-Pressed Oil | ₹549 | Cooking | 120 |
| Extra Virgin Premium (1L) | ₹899 | Cooking | 85 |
| Hair & Skin Care Oil | ₹699 | Beauty | 200 |
| Family Pack (2L) | ₹1499 | Cooking | 60 |
| Ayurvedic Wellness Oil | ₹799 | Wellness | 95 |
| Organic Farm Reserve | ₹1299 | Cooking | 40 |

---

## 🎯 Complete Payment Flow

### Cash on Delivery (COD)
```
Checkout → Select COD → Place Order
↓
Order created (status: processing, paymentStatus: pending)
↓
Email sent to customer
↓
Order appears in Admin dashboard
↓
Admin updates status → Customer gets email
```

### Credit Card (Stripe)
```
Checkout → Select Card → Order created
↓
Stripe PaymentIntent created (clientSecret sent)
↓
Enter card details → Confirm payment
↓
Stripe processes → Webhook confirms
↓
Order status: paid
↓
Email sent + redirected to tracking
```

---

## 📝 File Locations

**Key Files:**
- Backend entry: `backend/server.js`
- Frontend entry: `frontend/src/App.jsx`
- Product data: `backend/seed.js` (6 demo products)
- Checkout logic: `frontend/src/pages/Checkout.jsx`
- Order API: `backend/controllers/orderController.js`
- Payment API: `backend/controllers/paymentController.js`
- Email setup: `backend/utils/sendEmail.js`

**Documentation:**
- Full guide: `IMPLEMENTATION_GUIDE.md`
- Payment details: `PAYMENT_FLOW.md`
- Project summary: `COMPLETION_SUMMARY.md`
- This file: `QUICK_REFERENCE.md`

---

## ⚠️ Common Issues & Fixes

| Issue | Solution |
|---|---|
| "Cannot connect to MongoDB" | Start mongod or use MongoDB Atlas URI |
| "Email not sending" | Check EMAIL_USER, EMAIL_PASS in .env |
| "Stripe webhook not working" | Install Stripe CLI: `stripe listen --forward-to localhost:5000/api/payments/webhook` |
| "Port 5000 already in use" | Change PORT in .env or kill process |
| "Cannot POST /api/orders" | Check auth token in headers |

---

## 🎨 Tech Stack

**Backend:**
- Node.js 16+
- Express.js
- MongoDB
- Stripe SDK
- Nodemailer
- JWT

**Frontend:**
- React 19
- React Router
- Tailwind CSS
- Axios
- Lucide Icons

---

## 💡 Key Features

✅ 6+ demo coconut oil products  
✅ Shopping cart with state management  
✅ 2-step checkout flow  
✅ Payment via Cash on Delivery  
✅ Stripe card integration (ready)  
✅ Order tracking with carrier info  
✅ Email notifications (order + payment)  
✅ Admin order management  
✅ Analytics dashboard (API ready)  
✅ User authentication with roles  
✅ Responsive design  
✅ Dark mode support  

---

## 🚢 Ready for Production?

**Before deploying:**
- [ ] Get Stripe live keys
- [ ] Set up MongoDB Atlas
- [ ] Use production email service
- [ ] Enable HTTPS
- [ ] Set secure JWT_SECRET
- [ ] Configure Stripe webhook to production URL
- [ ] Update CLIENT_URL to production domain
- [ ] Run security audit
- [ ] Test full payment flow

---

## 📊 Database Structure

**Collections:**
- `users` - Customer & admin accounts
- `products` - Coconut oil products (6 demo)
- `orders` - Customer orders with full details
- `reviews` - Product reviews
- `coupons` - Discount codes
- `blogs` - Blog posts

---

## 🔗 Important URLs

| Page | URL | Notes |
|---|---|---|
| Home | `/` | Landing page |
| Shop | `/shop` | Browse products |
| Product | `/shop/:slug` | Product details |
| Cart | `/cart` | Shopping cart |
| Checkout | `/checkout` | Place order |
| Track Order | `/track/:id` | Order tracking |
| Dashboard | `/dashboard` | User orders & profile |
| Admin Orders | `/admin/orders` | Admin panel (API only) |

---

## 📞 Need Help?

1. **Setup Issues** → Read `IMPLEMENTATION_GUIDE.md`
2. **Payment Questions** → Read `PAYMENT_FLOW.md`
3. **API Errors** → Check backend console
4. **Frontend Errors** → Check browser console
5. **Email Issues** → Verify Gmail App Password

---

**Status:** ✅ READY TO LAUNCH  
**Last Updated:** June 13, 2026

---

**Happy Selling! 🥥**
