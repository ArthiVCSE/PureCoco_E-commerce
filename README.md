# PureCoco — Premium Coconut Oil E-Commerce

Farm-to-bottle traceability e-commerce platform for PureCoco, a premium coconut oil brand sourced from Pollachi farms.

## Project Structure

```
E-Commerce/
├── frontend/          # React frontend (Create React App)
│   └── src/
│       ├── components/   # UI, common, product, cart, checkout, dashboard, admin
│       ├── context/      # Auth, Cart, Theme providers
│       ├── hooks/        # useAuth, useCart, useProducts, useFetch
│       ├── pages/        # All route pages
│       ├── services/     # API, auth, product services
│       ├── styles/       # globals.css, variables, animations
│       └── utils/        # constants, validators, formatCurrency
└── backend/           # Node.js + Express API
    ├── config/        # Database connection
    ├── controllers/   # Route handlers
    ├── middleware/    # Auth middleware
    ├── models/        # Mongoose schemas
    ├── routes/        # API routes
    └── utils/         # Email, token helpers
```

## Design System

| Token | Value |
|-------|-------|
| Coconut Brown | `#5A4633` |
| Warm Cream | `#F7F3EC` |
| Golden Accent | `#C89B3C` |
| Natural Green | `#4F7942` |
| Border Radius | `12px` |
| Fonts | Inter (body), Playfair Display (headings) |

## Setup

### Frontend
1. Open `frontend/` folder
2. Run `npm install`
3. Run `npm start` → opens at http://localhost:3000

### Backend
1. Open `backend/` folder
2. Run `npm install`
3. Update `.env` with your MongoDB URI
4. Run `npm run dev` → API at http://localhost:5000
5. Ensure `REACT_APP_API_URL` is set in `.env` for frontend deployment.
6. Deploy the frontend to Vercel (or your preferred host) – Vercel will automatically pick up the env variable set in the project settings.

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| User | demo@purecoco.com | demo1234 |
| Admin | admin@purecoco.com | admin1234 |

## Features

- Farm-to-Bottle Traceability with batch verification
- Purity Score Indicator on every product
- Subscription delivery plans
- Usage recommendation system
- Product comparison (up to 3 products)
- Harvest story section
- Customer reviews with images
- Dark mode support
- Sticky cart sidebar
- Loading skeletons
- Mobile-first responsive design

## Pages

Home · Shop · Product Detail · Cart · Checkout · Login · Register · Dashboard · Admin Dashboard · Order Tracking · Subscription · Blog · Traceability · Compare
