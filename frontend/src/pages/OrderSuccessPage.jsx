import { useNavigate } from 'react-router-dom';
import { CheckCircle, Package } from 'lucide-react';

const OrderSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      minHeight: '80vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'var(--warm-white)',
      padding: '48px 32px'
    }}>
      <div style={{ textAlign: 'center', maxWidth: 500 }}>
        <CheckCircle 
          size={80} 
          style={{ color: '#4caf50', marginBottom: 24 }} 
          strokeWidth={1.5}
        />
        
        <h1 className="font-display" style={{ 
          fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', 
          fontWeight: 400, 
          color: 'var(--charcoal)', 
          marginBottom: 16 
        }}>
          Order Placed Successfully!
        </h1>
        
        <p style={{ 
          fontSize: 'clamp(0.9rem, 2vw, 1rem)', 
          color: 'var(--stone-600)', 
          marginBottom: 32,
          lineHeight: 1.7,
          fontFamily: 'Jost, sans-serif'
        }}>
          Thank you for your order. We've sent a confirmation email with your order details.
        </p>

        <div style={{ 
          background: 'var(--stone-100)', 
          padding: '20px 24px', 
          marginBottom: 32,
          borderLeft: '4px solid var(--accent)'
        }}>
          <p style={{ 
            fontSize: '0.85rem', 
            color: 'var(--stone-700)',
            fontFamily: 'Jost, sans-serif',
            lineHeight: 1.6
          }}>
            📧 Check your email for order confirmation<br/>
            📦 We'll notify you when your order ships
          </p>
        </div>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={() => navigate('/orders/my-orders')}
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <Package size={18} />
            View My Orders
          </button>
          <button 
            onClick={() => navigate('/products')}
            className="btn-outline"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;