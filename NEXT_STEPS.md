# E-Commerce App - Next Steps Guide

## Overview
Backend infrastructure for messages, notifications, and wishlist has been created. Frontend integration is the next phase.

---

## Phase 1: Frontend Integration - Wishlist (PRIORITY: HIGH)

### Task 1.1: Update Dashboard.jsx Wishlist Fetch

**File**: `frontend/src/pages/Dashboard.jsx`
**Current State**: Uses only localStorage
**Fix**: Load from backend on mount

```javascript
import wishlistService from '../services/wishlistService';

const Dashboard = () => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchWishlist();
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const data = await wishlistService.getWishlist();
      setWishlist(data);
      // Optionally sync to localStorage for offline access
      localStorage.setItem('purecoco_wishlist', JSON.stringify(data.map(p => p._id)));
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
      // Fall back to localStorage
      const saved = JSON.parse(localStorage.getItem('purecoco_wishlist') || '[]');
      setWishlist(saved);
    } finally {
      setLoading(false);
    }
  };

  // ... rest of component
};
```

---

### Task 1.2: Update ProductCard.jsx Wishlist Toggle

**File**: `frontend/src/components/product/ProductCard.jsx`
**Current State**: Likely uses localStorage only via context
**Fix**: Integrate with backend API

```javascript
import wishlistService from '../../services/wishlistService';
import { useAuth } from '../../hooks/useAuth';

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    
    if (!user) {
      addToast('Please login to add to wishlist', 'warning');
      return;
    }

    setLoading(true);
    try {
      if (isInWishlist) {
        await wishlistService.removeFromWishlist(product._id);
        setIsInWishlist(false);
        addToast('Removed from wishlist', 'info');
      } else {
        await wishlistService.addToWishlist(product._id);
        setIsInWishlist(true);
        addToast('Added to wishlist', 'success');
      }
    } catch (error) {
      addToast(error?.response?.data?.message || 'Error updating wishlist', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ... rest of component
};
```

---

## Phase 2: Admin Panel Integration

### Task 2.1: Create Messages View Component

**New File**: `frontend/src/components/admin/Messages.jsx`

**Features**:
- List all contact messages
- Show status (new/read/replied)
- Click to view full message
- Mark as read/replied
- Delete message
- Search/filter by email or name

```javascript
// Component structure
const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const data = await messageService.getMessages();
      setMessages(data);
    } catch (error) {
      addToast('Failed to fetch messages', 'error');
    }
  };

  const handleStatusUpdate = async (messageId, status) => {
    try {
      await messageService.updateMessageStatus(messageId, status);
      fetchMessages(); // Refresh
    } catch (error) {
      addToast('Failed to update message', 'error');
    }
  };

  const handleDelete = async (messageId) => {
    if (window.confirm('Delete this message?')) {
      try {
        await messageService.deleteMessage(messageId);
        fetchMessages();
      } catch (error) {
        addToast('Failed to delete message', 'error');
      }
    }
  };

  return (
    <div className="card p-6">
      <h2 className="text-2xl font-bold mb-4">Contact Messages ({messages.length})</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left p-2">Name</th>
            <th className="text-left p-2">Email</th>
            <th className="text-left p-2">Date</th>
            <th className="text-left p-2">Status</th>
            <th className="text-left p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {messages.map(msg => (
            <tr key={msg._id} className="border-t">
              <td className="p-2">{msg.name}</td>
              <td className="p-2">{msg.email}</td>
              <td className="p-2">{new Date(msg.createdAt).toLocaleDateString()}</td>
              <td className="p-2">
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  msg.status === 'new' ? 'bg-blue-100 text-blue-800' :
                  msg.status === 'read' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {msg.status.toUpperCase()}
                </span>
              </td>
              <td className="p-2 space-x-2">
                <button onClick={() => setSelectedMessage(msg)} className="text-blue-600">View</button>
                <button onClick={() => handleStatusUpdate(msg._id, 'replied')} className="text-green-600">Mark Replied</button>
                <button onClick={() => handleDelete(msg._id)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedMessage && (
        <div className="mt-6 p-4 bg-gray-50 rounded">
          <h3 className="font-bold mb-2">Message Details</h3>
          <p><strong>From:</strong> {selectedMessage.name} ({selectedMessage.email})</p>
          <p><strong>Date:</strong> {new Date(selectedMessage.createdAt).toLocaleString()}</p>
          <p className="mt-4"><strong>Message:</strong></p>
          <p className="p-2 bg-white rounded">{selectedMessage.message}</p>
        </div>
      )}
    </div>
  );
};
```

---

### Task 2.2: Create Notifications Management Component

**New File**: `frontend/src/components/admin/NotificationManager.jsx`

**Features**:
- Form to create new notifications (select user, type, message)
- List sent notifications
- Toggle email/SMS delivery
- View notification delivery status

---

## Phase 3: Testing

### Task 3.1: Test Contact Message Flow

1. Go to Home page
2. Fill contact form and submit
3. Check browser console for any errors
4. Verify toast shows "Message sent successfully"
5. **Backend verification**: 
   ```bash
   # In MongoDB
   db.messages.find().pretty()
   # Should show your test message
   ```

### Task 3.2: Test Wishlist Integration

1. Login as user
2. Add product to wishlist
3. Verify in browser DevTools Network tab - `POST /api/users/wishlist/add` should succeed
4. Refresh page - wishlist should persist
5. Go to Dashboard - wishlist should show products from backend
6. Remove from wishlist - should update immediately

### Task 3.3: Test Blog Pages

1. Visit `/blog` - should load blog list
2. Click on a blog - should load `/blog/slug`
3. Check browser console for errors
4. If 404 or blank - check `productService.getBlogs()` and `getBlogBySlug()`

---

## Phase 4: Fix Payment Flow (If Broken)

### Issue Diagnosis
The Checkout.jsx card payment flow may be stuck because:
1. `clientSecret` isn't being returned from backend
2. Button conditional rendering is wrong
3. Stripe Elements UI is missing

### Fix Steps:

**Step 1**: Check `backend/controllers/paymentController.js`
```javascript
// Should return clientSecret
exports.createPaymentIntent = async (req, res) => {
  try {
    const { orderId, amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'inr',
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

**Step 2**: Check `frontend/src/pages/Checkout.jsx` payment form
- Ensure `clientSecret` state is updated after API call
- Show Stripe Elements form when `clientSecret` exists
- Disable button only while loading or if no clientSecret

---

## Implementation Checklist

- [ ] **Wishlist Backend**: Already done ✅
  - [ ] Dashboard loads from backend
  - [ ] ProductCard can add/remove
  
- [ ] **Messages Backend**: Already done ✅
  - [ ] Home.jsx saves messages
  - [ ] Admin can view messages
  
- [ ] **Notifications Backend**: Already done ✅
  - [ ] Admin can create notifications
  - [ ] Users can view notifications
  
- [ ] **Blog Testing**: Pending
  - [ ] Verify blog list page loads
  - [ ] Verify blog detail page loads
  
- [ ] **Payment Flow Testing**: Pending
  - [ ] Test card payment endpoint
  - [ ] Verify clientSecret returns
  - [ ] Test full checkout flow

---

## File Modifications Summary

### Backend (NEW/UPDATED):
- ✅ `models/Message.js` (NEW)
- ✅ `models/Notification.js` (NEW)
- ✅ `models/User.js` (UPDATED - added wishlist field)
- ✅ `controllers/messageController.js` (NEW)
- ✅ `controllers/notificationController.js` (NEW)
- ✅ `controllers/userController.js` (UPDATED - added wishlist methods)
- ✅ `routes/messageRoutes.js` (NEW)
- ✅ `routes/notificationRoutes.js` (NEW)
- ✅ `routes/userRoutes.js` (UPDATED - added wishlist routes)
- ✅ `server.js` (UPDATED - registered new routes)

### Frontend (NEW/UPDATED):
- ✅ `services/messageService.js` (NEW)
- ✅ `services/notificationService.js` (NEW)
- ✅ `services/wishlistService.js` (NEW)
- ✅ `pages/Home.jsx` (UPDATED - contact form sends to backend)
- ⏳ `pages/Dashboard.jsx` (TODO - integrate wishlist)
- ⏳ `components/product/ProductCard.jsx` (TODO - integrate wishlist toggle)
- ⏳ `components/admin/Messages.jsx` (TODO - create)
- ⏳ `components/admin/NotificationManager.jsx` (TODO - create)

---

## API Endpoints Reference

### Messages
```
POST   /api/messages              Create message (public)
GET    /api/messages              Get all (admin)
GET    /api/messages/:id          Get one (admin)
PUT    /api/messages/:id          Update status (admin)
DELETE /api/messages/:id          Delete (admin)
```

### Wishlist
```
GET    /api/users/wishlist        Get user wishlist (protected)
POST   /api/users/wishlist/add    Add to wishlist (protected)
POST   /api/users/wishlist/remove Remove from wishlist (protected)
```

### Notifications
```
POST   /api/notifications              Create (admin)
GET    /api/notifications              Get all (admin)
GET    /api/notifications/user/:userId Get user notifications (protected)
PUT    /api/notifications/:id/read     Mark as read (protected)
PUT    /api/notifications/user/:userId/read-all Mark all read (protected)
DELETE /api/notifications/:id          Delete (protected)
```

---

## Quick Start After Backend Restart

1. **Restart Backend**:
   ```bash
   cd backend
   npm start
   ```

2. **Test Contact Form**:
   - Home page → Contact section → Submit message
   - Should see "Message sent successfully" toast
   - Check MongoDB: `db.messages.find()`

3. **Test Wishlist** (After Dashboard update):
   - Login → Shop → Add to wishlist
   - Go to Dashboard → Wishlist tab
   - Wishlist should show products

4. **Check Admin Messages**:
   - Admin Dashboard → Add Messages tab
   - Should show submitted contact messages
