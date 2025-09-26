import React, { useEffect, useState } from 'react';
import { CCard, CCardBody, CCardHeader, CSpinner } from '@coreui/react';
import { cilChart } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { Line } from 'react-chartjs-2';
import { getMonthlySalesVsPurchases } from '../api/dashboard';

const SalesVsPurchasesChart = ({ dateRange }) => {
  const [groupBy, setGroupBy] = useState('daily');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ sales: [], purchases: [] });

  const fetchStats = async (range, group = groupBy) => {
    setLoading(true);
    const params = {
      start_date: range[0].toISOString().slice(0, 10),
      end_date: range[1].toISOString().slice(0, 10),
      group_by: group,
    };
    const res = await getMonthlySalesVsPurchases(params);
    setStats(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchStats(dateRange, groupBy);
    // eslint-disable-next-line
  }, [dateRange, groupBy]);

  const handleGroupByChange = (e) => {
    setGroupBy(e.target.value);
  };

  // Prepare chart data
  const labels = Array.from(new Set([
    ...stats.sales.map(s => s.label),
    ...stats.purchases.map(p => p.label)
  ])).sort();
  const salesDataArr = labels.map(l => {
    const found = stats.sales.find(s => s.label === l);
    return found ? Number(found.total_sales) : 0;
  });
  const purchasesDataArr = labels.map(l => {
    const found = stats.purchases.find(p => p.label === l);
    return found ? Number(found.total_purchases) : 0;
  });

  return (
    <CCard 
      className="h-100 border-0 shadow-sm"
      style={{ 
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
        borderRadius: 16,
        overflow: 'hidden',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      }}
    >
      <CCardHeader 
        className="border-bottom-0 fw-bold text-white d-flex align-items-center justify-content-between" 
        style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px 16px 0 0', 
          padding: '16px 20px' 
        }}
      >
        <span><CIcon icon={cilChart} className="me-2" />Sales vs Purchases</span>
        <select 
          value={groupBy} 
          onChange={handleGroupByChange} 
          style={{ 
            border: 'none', 
            borderRadius: 8, 
            padding: '6px 12px', 
            fontWeight: 500, 
            color: '#667eea', 
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </CCardHeader>
      <CCardBody style={{ padding: '20px' }}>
        {loading ? (
          <div className="text-center py-5">
            <CSpinner />
            <div className="mt-3 text-muted">Loading chart data...</div>
          </div>
        ) : (
          <div style={{ position: 'relative', width: '100%', height: 280 }}>
            <Line
              data={{
                labels,
                datasets: [
                  {
                    label: 'Sales (£)',
                    data: salesDataArr,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    pointBackgroundColor: '#667eea',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    tension: 0.4,
                    fill: true,
                  },
                  {
                    label: 'Purchases (£)',
                    data: purchasesDataArr,
                    borderColor: '#f093fb',
                    backgroundColor: 'rgba(240, 147, 251, 0.1)',
                    borderWidth: 3,
                    pointBackgroundColor: '#f093fb',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    tension: 0.4,
                    fill: true,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                  legend: { 
                    position: 'top',
                    labels: {
                      usePointStyle: true,
                      pointStyle: 'circle',
                      padding: 20,
                      font: {
                        size: 12,
                        weight: '500'
                      }
                    }
                  },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    borderColor: '#667eea',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: true,
                    intersect: false,
                    mode: 'index',
                  }
                },
                scales: {
                  x: {
                    grid: {
                      color: 'rgba(0, 0, 0, 0.05)',
                      drawBorder: false,
                    },
                    ticks: {
                      color: '#666',
                      font: {
                        size: 11
                      }
                    }
                  },
                  y: {
                    grid: {
                      color: 'rgba(0, 0, 0, 0.05)',
                      drawBorder: false,
                    },
                    ticks: {
                      color: '#666',
                      font: {
                        size: 11
                      },
                      callback: function(value) {
                        return '£' + value.toLocaleString();
                      }
                    }
                  }
                },
                interaction: {
                  intersect: false,
                  mode: 'index'
                }
              }}
            />
          </div>
        )}
      </CCardBody>
    </CCard>
  );
};

export default SalesVsPurchasesChart; 