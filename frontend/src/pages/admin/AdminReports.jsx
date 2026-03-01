import { useState, useEffect } from 'react';
import { TrendingUp, Package, Users, DollarSign, Download } from 'lucide-react';
import { adminAPI } from '../../utils/api';

const AdminReports = () => {
  const [financialReport, setFinancialReport] = useState(null);
  const [productReport, setProductReport] = useState(null);
  const [customerReport, setCustomerReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
  try {
    const [financial, products, customers] = await Promise.all([
      adminAPI.getFinancialReport(),
      adminAPI.getProductReport(),
      adminAPI.getCustomerReport()
    ]);

    console.log('💰 Financial report:', financial.data);
    console.log('📦 Product report:', products.data);
    console.log('👥 Customer report:', customers.data);

    setFinancialReport(financial.data.summary || {});
    setProductReport(products.data || {});
    setCustomerReport(customers.data.summary || {});
    
  } catch (error) {
    console.error('Error fetching reports:', error);
  } finally {
    setLoading(false);
  }
};

  const exportReport = (reportName, data) => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportName}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  if (loading) {
    return (
      <div style={{ padding: 'clamp(32px, 5vw, 48px)' }}>
        <p style={{ textAlign: 'center', color: 'var(--stone-600)', fontFamily: 'Jost, sans-serif' }}>
          Loading reports...
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: 'clamp(24px, 4vw, 48px)', maxWidth: 1400, margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <h1 className="font-display" style={{ 
          fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', 
          fontWeight: 400,
          color: 'var(--charcoal)',
          marginBottom: 8
        }}>
          Reports & Analytics
        </h1>
        <p style={{ 
          fontSize: 'clamp(0.85rem, 2vw, 0.9rem)', 
          color: 'var(--stone-600)',
          fontFamily: 'Jost, sans-serif'
        }}>
          Comprehensive business insights and performance metrics
        </p>
      </div>

      {/* Financial Report */}
      <div style={{ 
        background: 'white', 
        border: '1px solid var(--stone-200)', 
        borderRadius: 2,
        marginBottom: 32
      }}>
        <div style={{ 
          padding: 'clamp(20px, 4vw, 32px)',
          borderBottom: '1px solid var(--stone-200)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: '#C9A96E15',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <DollarSign size={24} style={{ color: 'var(--accent)' }} />
            </div>
            <h2 className="font-display" style={{ 
              fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', 
              fontWeight: 400,
              color: 'var(--charcoal)'
            }}>
              Financial Report
            </h2>
          </div>
          <button
            onClick={() => exportReport('financial-report', financialReport)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              background: 'white',
              border: '1px solid var(--stone-300)',
              fontSize: '0.85rem',
              fontFamily: 'Jost, sans-serif',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--stone-50)';
              e.target.style.borderColor = 'var(--accent)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'white';
              e.target.style.borderColor = 'var(--stone-300)';
            }}
          >
            <Download size={16} />
            Export
          </button>
        </div>

        <div style={{ 
          padding: 'clamp(24px, 4vw, 32px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 24
        }}>
          <div>
            <p style={{ 
              fontSize: '0.75rem',
              color: 'var(--stone-500)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 8,
              fontFamily: 'Jost, sans-serif'
            }}>
              Total Revenue
            </p>
            <p className="font-display" style={{ 
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 600,
              color: 'var(--accent)'
            }}>
              R {(financialReport?.totalRevenue || 0).toLocaleString()}
            </p>
          </div>

          <div>
            <p style={{ 
              fontSize: '0.75rem',
              color: 'var(--stone-500)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 8,
              fontFamily: 'Jost, sans-serif'
            }}>
              Total Profit
            </p>
            <p className="font-display" style={{ 
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 600,
              color: '#4caf50'
            }}>
              R {(financialReport?.totalProfit || 0).toLocaleString()}
            </p>
            <p style={{ 
              fontSize: '0.8rem',
              color: 'var(--stone-600)',
              fontFamily: 'Jost, sans-serif'
            }}>
              {financialReport?.profitMargin || 0}% margin
            </p>
          </div>

          <div>
            <p style={{ 
              fontSize: '0.75rem',
              color: 'var(--stone-500)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 8,
              fontFamily: 'Jost, sans-serif'
            }}>
              Total Orders
            </p>
            <p className="font-display" style={{ 
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 600,
              color: 'var(--charcoal)'
            }}>
              {financialReport?.totalOrders || 0}
            </p>
          </div>

          <div>
            <p style={{ 
              fontSize: '0.75rem',
              color: 'var(--stone-500)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 8,
              fontFamily: 'Jost, sans-serif'
            }}>
              Avg Order Value
            </p>
            <p className="font-display" style={{ 
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 600,
              color: 'var(--charcoal)'
            }}>
              R {(financialReport?.avgOrderValue || 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Product Report */}
      <div style={{ 
        background: 'white', 
        border: '1px solid var(--stone-200)', 
        borderRadius: 2,
        marginBottom: 32
      }}>
        <div style={{ 
          padding: 'clamp(20px, 4vw, 32px)',
          borderBottom: '1px solid var(--stone-200)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: '#ff980015',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Package size={24} style={{ color: '#ff9800' }} />
            </div>
            <h2 className="font-display" style={{ 
              fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', 
              fontWeight: 400,
              color: 'var(--charcoal)'
            }}>
              Product Performance
            </h2>
          </div>
          <button
            onClick={() => exportReport('product-report', productReport)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              background: 'white',
              border: '1px solid var(--stone-300)',
              fontSize: '0.85rem',
              fontFamily: 'Jost, sans-serif',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--stone-50)';
              e.target.style.borderColor = 'var(--accent)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'white';
              e.target.style.borderColor = 'var(--stone-300)';
            }}
          >
            <Download size={16} />
            Export
          </button>
        </div>

        <div style={{ padding: 'clamp(24px, 4vw, 32px)' }}>
          <h3 style={{ 
            fontSize: '1rem',
            fontWeight: 500,
            color: 'var(--charcoal)',
            marginBottom: 20,
            fontFamily: 'Jost, sans-serif'
          }}>
            Top Selling Products
          </h3>

          {productReport?.topProducts?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {productReport.topProducts.slice(0, 5).map((product, idx) => (
                <div 
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    background: 'var(--stone-50)',
                    borderRadius: 2,
                    gap: 16
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                    <span style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: 'var(--accent)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      flexShrink: 0
                    }}>
                      {idx + 1}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ 
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        color: 'var(--charcoal)',
                        fontFamily: 'Jost, sans-serif',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {product.name}
                      </p>
                      <p style={{ 
                        fontSize: '0.75rem',
                        color: 'var(--stone-500)',
                        fontFamily: 'Jost, sans-serif'
                      }}>
                        {product.salesCount || 0} sold
                      </p>
                    </div>
                  </div>
                  <p style={{ 
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: 'var(--accent)',
                    fontFamily: 'Jost, sans-serif',
                    whiteSpace: 'nowrap'
                  }}>
                    R {((product.price || 0) * (product.salesCount || 0)).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ 
              color: 'var(--stone-500)',
              fontFamily: 'Jost, sans-serif',
              fontSize: '0.9rem',
              textAlign: 'center',
              padding: '40px 20px'
            }}>
              No product data available
            </p>
          )}
        </div>
      </div>

      {/* Customer Report */}
      <div style={{ 
        background: 'white', 
        border: '1px solid var(--stone-200)', 
        borderRadius: 2
      }}>
        <div style={{ 
          padding: 'clamp(20px, 4vw, 32px)',
          borderBottom: '1px solid var(--stone-200)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: '#2196f315',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Users size={24} style={{ color: '#2196f3' }} />
            </div>
            <h2 className="font-display" style={{ 
              fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', 
              fontWeight: 400,
              color: 'var(--charcoal)'
            }}>
              Customer Insights
            </h2>
          </div>
          <button
            onClick={() => exportReport('customer-report', customerReport)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              background: 'white',
              border: '1px solid var(--stone-300)',
              fontSize: '0.85rem',
              fontFamily: 'Jost, sans-serif',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--stone-50)';
              e.target.style.borderColor = 'var(--accent)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'white';
              e.target.style.borderColor = 'var(--stone-300)';
            }}
          >
            <Download size={16} />
            Export
          </button>
        </div>

        <div style={{ 
          padding: 'clamp(24px, 4vw, 32px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 24
        }}>
          <div>
            <p style={{ 
              fontSize: '0.75rem',
              color: 'var(--stone-500)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 8,
              fontFamily: 'Jost, sans-serif'
            }}>
              Total Customers
            </p>
            <p className="font-display" style={{ 
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 600,
              color: 'var(--charcoal)'
            }}>
              {customerReport?.totalCustomers || 0}
            </p>
          </div>

          <div>
            <p style={{ 
              fontSize: '0.75rem',
              color: 'var(--stone-500)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 8,
              fontFamily: 'Jost, sans-serif'
            }}>
              New This Month
            </p>
            <p className="font-display" style={{ 
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 600,
              color: '#4caf50'
            }}>
              {customerReport?.newThisMonth || 0}
            </p>
          </div>

          <div>
            <p style={{ 
              fontSize: '0.75rem',
              color: 'var(--stone-500)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 8,
              fontFamily: 'Jost, sans-serif'
            }}>
              Repeat Customers
            </p>
            <p className="font-display" style={{ 
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 600,
              color: 'var(--charcoal)'
            }}>
              {customerReport?.repeatCustomers || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;