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
    <CCard color="light" textColor="dark" style={{ background: '#fff', minHeight: 320, border: '1px solid #e9ecef', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      <CCardHeader className="bg-light border-bottom-0 fw-bold d-flex align-items-center justify-content-between" style={{ borderRadius: '12px 12px 0 0', padding: '12px 16px' }}>
        <span><CIcon icon={cilChart} className="me-2 text-primary" />Sales vs Purchases</span>
        <select value={groupBy} onChange={handleGroupByChange} style={{ border: '1px solid #e9ecef', borderRadius: 6, padding: '2px 10px', fontWeight: 500, color: '#321fdb', background: '#f5f6fa' }}>
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </CCardHeader>
      <CCardBody>
        {loading ? (
          <div className="text-center py-5"><CSpinner /></div>
        ) : (
          <Line
            data={{
              labels,
              datasets: [
                {
                  label: 'Sales (£)',
                  data: salesDataArr,
                  borderColor: '#321fdb',
                  backgroundColor: 'rgba(50,31,219,0.1)',
                  tension: 0.4,
                },
                {
                  label: 'Purchases (£)',
                  data: purchasesDataArr,
                  borderColor: '#2eb85c',
                  backgroundColor: 'rgba(46,184,92,0.1)',
                  tension: 0.4,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { position: 'top' } },
            }}
          />
        )}
      </CCardBody>
    </CCard>
  );
};

export default SalesVsPurchasesChart; 