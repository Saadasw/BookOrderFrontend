# 📚 BookOrderFrontend

Modern, responsive frontend for a secure book ordering system with SMS OTP verification.

## 🌟 Features

- 📱 **Mobile-First Design**: Responsive UI that works on all devices
- 🔐 **2FA Integration**: Seamless OTP verification flow
- 🛒 **Shopping Cart**: Add, remove, and manage book orders
- 💳 **Multiple Payment Options**: Cash, bKash, Nagad, Card
- 📊 **Order Tracking**: Real-time order status updates
- 🎨 **Modern UI/UX**: Clean, intuitive interface
- ⚡ **Fast & Optimized**: Built with performance in mind
- 🌍 **Internationalization Ready**: Support for multiple languages

## 🔗 Related Repository

Backend API: [BookOrderBackend](https://github.com/yourusername/BookOrderBackend)

## 🏗️ Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│                 │         │                  │         │                 │
│   This Frontend │ ──API──▶│  FastAPI Backend │ ──SMS──▶│  Infobip API   │
│   Application   │         │                  │         │   (2FA/OTP)     │
│                 │         │                  │         │                 │
└─────────────────┘         └──────────────────┘         └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm/yarn
- Backend API running (see [BookOrderBackend](https://github.com/yourusername/BookOrderBackend))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/BookOrderFrontend.git
cd BookOrderFrontend
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Book Order System
```

4. **Start development server**
```bash
npm run dev
# or
yarn dev
```

The app will be available at `http://localhost:5173` (Vite) or `http://localhost:3000` (Create React App)

## 📁 Project Structure

```
BookOrderFrontend/
├── src/
│   ├── components/
│   │   ├── Cart/
│   │   ├── OrderForm/
│   │   ├── OTPVerification/
│   │   └── BookList/
│   ├── services/
│   │   ├── api.js
│   │   └── auth.js
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Checkout.jsx
│   │   └── OrderSuccess.jsx
│   ├── hooks/
│   │   ├── useCart.js
│   │   └── useOrder.js
│   ├── utils/
│   └── App.jsx
├── public/
├── .env.example
├── package.json
└── README.md
```

## 🔄 Order Flow Implementation

### 1. Order Form Component
```javascript
// components/OrderForm/OrderForm.jsx
import { useState } from 'react';
import { initiateOrder } from '../../services/api';

function OrderForm({ cart, onSuccess }) {
  const [formData, setFormData] = useState({
    phone_number: '',
    address: '',
    payment_method: 'cash_on_delivery'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const orderData = {
        ...formData,
        books: cart.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity
        }))
      };
      
      const response = await initiateOrder(orderData);
      onSuccess(response.session_token);
    } catch (error) {
      console.error('Order failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

### 2. OTP Verification Component
```javascript
// components/OTPVerification/OTPVerification.jsx
import { useState, useEffect } from 'react';
import { verifyOTP, resendOTP } from '../../services/api';

function OTPVerification({ sessionToken, onSuccess }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(600); // 10 minutes

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleVerify = async () => {
    setLoading(true);
    try {
      const pin = otp.join('');
      const order = await verifyOTP(sessionToken, pin);
      onSuccess(order);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendOTP(sessionToken);
      setTimer(600);
      alert('New code sent!');
    } catch (error) {
      alert('Failed to resend code');
    }
  };

  return (
    <div className="otp-verification">
      <h2>Enter Verification Code</h2>
      <p>We've sent a 6-digit code to your phone</p>
      
      <div className="otp-inputs">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            onKeyUp={(e) => handleKeyUp(index, e)}
          />
        ))}
      </div>
      
      <div className="timer">
        Time remaining: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
      </div>
      
      <button onClick={handleVerify} disabled={loading || otp.includes('')}>
        Verify Order
      </button>
      
      <button onClick={handleResend} disabled={timer > 0}>
        Resend Code
      </button>
    </div>
  );
}
```

### 3. API Service
```javascript
// services/api.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function initiateOrder(orderData) {
  const response = await fetch(`${API_URL}/orders/initiate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Order failed');
  }
  
  return response.json();
}

export async function verifyOTP(sessionToken, pinCode) {
  const response = await fetch(`${API_URL}/orders/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_token: sessionToken,
      pin_code: pinCode
    })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Verification failed');
  }
  
  return response.json();
}

export async function resendOTP(sessionToken) {
  const response = await fetch(`${API_URL}/orders/resend-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_token: sessionToken })
  });
  
  if (!response.ok) {
    throw new Error('Failed to resend code');
  }
  
  return response.json();
}
```

## 🎨 UI Components

### Book List
```javascript
// components/BookList/BookList.jsx
function BookList({ books, onAddToCart }) {
  return (
    <div className="book-grid">
      {books.map(book => (
        <div key={book.id} className="book-card">
          <img src={book.cover} alt={book.title} />
          <h3>{book.title}</h3>
          <p>{book.author}</p>
          <div className="price">৳{book.price}</div>
          <button onClick={() => onAddToCart(book)}>
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Shopping Cart
```javascript
// components/Cart/Cart.jsx
function Cart({ items, onUpdateQuantity, onRemove }) {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  return (
    <div className="cart">
      <h2>Shopping Cart ({items.length})</h2>
      {items.map(item => (
        <div key={item.id} className="cart-item">
          <span>{item.title}</span>
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => onUpdateQuantity(item.id, e.target.value)}
            min="1"
          />
          <span>৳{item.price * item.quantity}</span>
          <button onClick={() => onRemove(item.id)}>Remove</button>
        </div>
      ))}
      <div className="total">Total: ৳{total}</div>
    </div>
  );
}
```

## 🎯 State Management

### Using Context API
```javascript
// context/OrderContext.jsx
import { createContext, useContext, useState } from 'react';

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  
  const addToCart = (book) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === book.id);
      if (existing) {
        return prev.map(item =>
          item.id === book.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...book, quantity: 1 }];
    });
  };
  
  return (
    <OrderContext.Provider value={{
      cart,
      addToCart,
      currentOrder,
      setCurrentOrder
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrder = () => useContext(OrderContext);
```

## 🎨 Styling Examples

### Tailwind CSS Setup
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        secondary: '#8b5cf6'
      }
    }
  },
  plugins: []
}
```

### OTP Input Styling
```css
/* styles/OTPVerification.css */
.otp-inputs {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin: 2rem 0;
}

.otp-inputs input {
  width: 3rem;
  height: 3rem;
  text-align: center;
  font-size: 1.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  transition: border-color 0.2s;
}

.otp-inputs input:focus {
  outline: none;
  border-color: #6366f1;
}
```

## 🌐 Internationalization

### Setup i18n
```javascript
// i18n/config.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        'order.title': 'Place Your Order',
        'order.verify': 'Verify Your Phone',
        'order.success': 'Order Confirmed!'
      }
    },
    bn: {
      translation: {
        'order.title': 'আপনার অর্ডার দিন',
        'order.verify': 'ফোন যাচাই করুন',
        'order.success': 'অর্ডার নিশ্চিত!'
      }
    }
  },
  lng: 'en',
  fallbackLng: 'en'
});
```

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### E2E Tests
```bash
npm run test:e2e
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
vercel --prod
```

### Deploy to Netlify
```bash
netlify deploy --prod
```

### Environment Variables for Production
```env
VITE_API_URL=https://api.yourdomain.com
VITE_APP_NAME=Book Order System
VITE_GA_ID=your-google-analytics-id
```

## 📱 Mobile App Considerations

If building with React Native:
- Use `react-native-otp-textinput` for OTP input
- Implement deep linking for SMS autofill
- Handle keyboard properly for better UX

## 🔧 Troubleshooting

### CORS Issues
Ensure backend allows your frontend URL:
```python
# In backend .env
ALLOWED_ORIGINS=http://localhost:5173,https://yourdomain.com
```

### OTP Not Received
- Check phone number format (+country code)
- Verify backend Infobip configuration
- Check network connectivity

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- React/Vue team for the framework
- Tailwind CSS for styling
- All contributors

---

Built with ❤️ for seamless book ordering
