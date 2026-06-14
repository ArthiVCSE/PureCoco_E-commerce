# Payment & Order Tracking Flow Documentation

## Complete End-to-End Payment & Order Flow

### 1️⃣ **Checkout Phase** (User Side)

```
Browser: Checkout Page
├── Step 1: Shipping Address Form
│   ├── Validate address fields
│   ├── User proceeds → Step 2
│   └── Address data stored in form state
│
└── Step 2: Payment Method Selection
    ├── Option A: Cash on Delivery (COD)
    ├── Option B: Credit/Debit Card (Stripe)
    └── Option C: UPI (Coming Soon)
```

---

### 2️⃣ **Payment Method: Cash on Delivery (COD)**

#### Frontend Flow:
```
User clicks "Place Order (COD)"
    ↓
POST /api/orders (with paymentMethod: 'cod')
    ↓
Backend creates Order:
  - orderStatus: 'processing'
  - paymentStatus: 'pending' (waits for admin confirmation)
  - tracking: { carrier, trackingId, estimatedDelivery }
    ↓
Send Email: Order Confirmation
    ↓
Frontend: Navigate to /track/{orderId}
    ↓
User sees: Order Details + Tracking Info
```

#### Backend Order Structure (COD):
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "user": "507f1f77bcf86cd799439012",
  "items": [
    {
      "product": "607f1f77bcf86cd799439013",
      "name": "Virgin Cold-Pressed Coconut Oil",
      "quantity": 2,
      "price": 549
    }
  ],
  "shippingAddress": {
    "fullName": "Raj Kumar",
    "email": "raj@example.com",
    "phone": "+919876543210",
    "address": "123 Main St",
    "city": "Bangalore",
    "state": "Karnataka",
    "pincode": "560001"
  },
  "paymentMethod": "cod",
  "paymentStatus": "pending",
  "status": "processing",
  "subtotal": 1098,
  "shipping": 0,
  "total": 1098,
  "tracking": {
    "carrier": "BlueDart",
    "trackingId": "BD1234567890",
    "estimatedDelivery": "2026-06-18"
  },
  "createdAt": "2026-06-13T10:30:00Z"
}
```

---

### 3️⃣ **Payment Method: Credit/Debit Card (Stripe)**

#### Frontend Flow:
```
User selects "Credit/Debit Card"
    ↓
Frontend: handlePaymentMethod('card')
    ↓
Backend creates Order with paymentMethod: 'card'
    ↓
POST /api/payments/create-payment-intent
    ↓
Stripe creates PaymentIntent
    ↓
Return clientSecret to frontend
    ↓
[HERE: Full Stripe Elements form would load]
User enters card details
    ↓
Frontend: confirmCardPayment(clientSecret)
    ↓
Stripe processes payment
    ↓
Stripe sends webhook to server
```

#### Stripe Webhook Flow:
```
Stripe Event: payment_intent.succeeded
    ↓
POST /api/payments/webhook
    ↓
Backend validates webhook signature
    ↓
Extract orderId from paymentIntent metadata
    ↓
Update Order:
  - paymentStatus: 'paid'
  - status: 'processing' (moves to fulfillment)
    ↓
Send Email: Payment Confirmation + Receipt
    ↓
Frontend: Navigate to /track/{orderId}
```

#### Stripe Payment Intent Structure:
```json
{
  "id": "pi_1234567890",
  "client_secret": "pi_123...secret",
  "amount": 109800,
  "currency": "inr",
  "status": "requires_payment_method",
  "metadata": {
    "orderId": "507f1f77bcf86cd799439011"
  }
}
```

---

### 4️⃣ **Order Tracking** (Post-Purchase)

#### User-Facing Order Tracking:
```
GET /api/orders/:id
    ↓
Return:
{
  "_id": "507f1f77bcf86cd799439011",
  "status": "shipped",           // pending → processing → shipped → out-for-delivery → delivered
  "paymentStatus": "paid",       // pending → paid → failed (COD shows pending)
  "tracking": {
    "carrier": "BlueDart",
    "trackingId": "BD1234567890",
    "estimatedDelivery": "2026-06-18"
  },
  "items": [...],
  "total": 1098,
  "createdAt": "2026-06-13T10:30:00Z",
  "updatedAt": "2026-06-13T12:00:00Z"
}
```

#### Admin Order Management:
```
GET /api/orders (admin only)
    ↓
List all orders with filters:
  - Sort by date
  - Filter by status
  - Filter by payment status
    ↓
PUT /api/orders/:id/status (admin only)
    ↓
Admin can update:
  - order status
  - tracking info (carrier, ID, delivery date)
    ↓
Email notification sent to customer
```

---

### 5️⃣ **Email Notifications**

#### Notification Triggers:

**#1 - Order Confirmation (On Order Create)**
```
To: shippingAddress.email
Subject: "PureCoco Order Confirmation #{orderId}"
Body: 
  - Order ID
  - Items ordered
  - Total amount
  - Tracking link: /track/{orderId}
```

**#2 - Payment Confirmation (On Stripe Success)**
```
To: shippingAddress.email
Subject: "Payment received — Order #{orderId}"
Body:
  - Payment confirmation
  - Amount paid
  - Order processing notice
  - Tracking link
```

**#3 - Shipping Update (On Admin Status Change)**
```
To: user.email
Subject: "Order #{orderId} shipped"
Body:
  - Carrier info (BlueDart, etc.)
  - Tracking ID
  - Estimated delivery date
  - Track link
```

---

### 6️⃣ **Order Status Lifecycle**

```
COD Order:
pending → processing → shipped → out-for-delivery → delivered
  |          |
  ↓          ↓
Payment   Fulfillment
pending   processing
```

```
Card Order:
pending → processing → shipped → out-for-delivery → delivered
  |          |
  ↓          ↓
Payment    Fulfillment
pending    processing
  ↓
Stripe webhook confirms
Payment: paid
```

---

### 7️⃣ **API Reference**

#### Create Order
```
POST /api/orders
Authorization: Bearer {token}

Request Body:
{
  "items": [
    {
      "product": "607f...",
      "name": "Virgin Oil",
      "price": 549,
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "fullName": "Raj Kumar",
    "email": "raj@example.com",
    "phone": "+919876543210",
    "address": "123 Main",
    "city": "Bangalore",
    "state": "Karnataka",
    "pincode": "560001"
  },
  "paymentMethod": "cod",
  "subtotal": 1098,
  "shipping": 0,
  "total": 1098
}

Response:
{
  "_id": "507f...",
  "status": "processing",
  "paymentStatus": "pending",
  "tracking": {...}
}
```

#### Get Order
```
GET /api/orders/:id
Authorization: Bearer {token}

Response: Full order object with all details
```

#### Get My Orders
```
GET /api/orders/my
Authorization: Bearer {token}

Response: [Array of orders for logged-in user]
```

#### Update Order Status (Admin)
```
PUT /api/orders/:id/status
Authorization: Bearer {admin_token}

Request Body:
{
  "status": "shipped",
  "tracking": {
    "carrier": "BlueDart",
    "trackingId": "BD1234567890",
    "estimatedDelivery": "2026-06-18"
  }
}

Response: Updated order object
```

#### Create Payment Intent
```
POST /api/payments/create-payment-intent
Authorization: Bearer {token}

Request Body:
{
  "orderId": "507f..."
}

Response:
{
  "clientSecret": "pi_123...secret"
}
```

---

### 8️⃣ **Testing Checklist**

- [ ] **COD Flow**
  - [ ] Fill shipping form
  - [ ] Select COD
  - [ ] Click "Place Order"
  - [ ] See confirmation email
  - [ ] View order in `/track/{orderId}`

- [ ] **Stripe Flow** (requires test keys)
  - [ ] Fill shipping form
  - [ ] Select Card
  - [ ] See clientSecret created
  - [ ] Complete Stripe form
  - [ ] Payment processes
  - [ ] Webhook confirms payment
  - [ ] Order status changes to "paid"
  - [ ] See payment confirmation email

- [ ] **Admin Panel**
  - [ ] View all orders
  - [ ] Update order status
  - [ ] Update tracking info
  - [ ] See customer notification sent

- [ ] **Email Notifications**
  - [ ] Order confirmation received
  - [ ] Payment confirmation received
  - [ ] Shipping update received

---

### 9️⃣ **Error Handling**

| Scenario | Response | Action |
|---|---|---|
| Order create fails | 400 error | Show toast, stay on checkout |
| Payment intent fails | 500 error | Show error, try again |
| Webhook signature invalid | 400 | Log, ignore event |
| Email send fails | Logged in console | Order still created, email can retry |
| Order not found | 404 | Show "Order not found" |

---

### 🔟 **Production Deployment Notes**

1. **Stripe Webhook Setup**
   - Stripe Dashboard → Webhooks → Add endpoint
   - URL: `https://yourdomain.com/api/payments/webhook`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Get webhook secret → add to `.env`

2. **Email Configuration**
   - Switch from Gmail to production service (SendGrid, AWS SES)
   - Update `.env` with production credentials
   - Test with real domain email (noreply@purecoco.in)

3. **Database**
   - Use MongoDB Atlas for production
   - Set up backups
   - Enable authentication

4. **HTTPS**
   - Stripe requires HTTPS for production
   - Get SSL certificate
   - Update `CLIENT_URL` in backend `.env`

---

**Status:** ✅ Ready to accept real orders!
