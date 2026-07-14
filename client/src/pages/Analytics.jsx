import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from "recharts";
import { BiTrendingUp, BiTrendingDown, BiCalendar } from "react-icons/bi";
import "./Analytics.css";

function Analytics() {
  const [timeRange, setTimeRange] = useState("This Week");

  // Mock Data
  const monthlyData = [
    { name: 'Mon', revenue: 4000, expenses: 2400, profit: 1600 },
    { name: 'Tue', revenue: 3000, expenses: 1398, profit: 1602 },
    { name: 'Wed', revenue: 2000, expenses: 9800, profit: -7800 },
    { name: 'Thu', revenue: 2780, expenses: 3908, profit: -1128 },
    { name: 'Fri', revenue: 1890, expenses: 4800, profit: -2910 },
    { name: 'Sat', revenue: 2390, expenses: 3800, profit: -1410 },
    { name: 'Sun', revenue: 3490, expenses: 4300, profit: -810 },
  ];

  const categoryData = [
    { name: 'Beverages', value: 65, fill: '#054e38' },
    { name: 'Food', value: 25, fill: '#e4cdad' },
    { name: 'Desserts', value: 10, fill: '#8bbaa9' }
  ];

  const salesVolume = [
    { time: '08:00', orders: 12 },
    { time: '10:00', orders: 25 },
    { time: '12:00', orders: 45 },
    { time: '14:00', orders: 30 },
    { time: '16:00', orders: 42 },
    { time: '18:00', orders: 60 },
    { time: '20:00', orders: 20 },
  ];

  return (
    <MainLayout>
      <div className="menu-container analytics-container">

        <div className="page-header">
          <div className="page-title">
            <h1>Analytics Overview</h1>
            <p>Detailed breakdown of your business performance.</p>
          </div>
          <button className="primary-btn" style={{ backgroundColor: 'white', color: 'var(--text-dark)', border: '1px solid var(--border-color)' }}>
            <BiCalendar size={18} /> {timeRange}
          </button>
        </div>

        {/* KPIs */}
        <div className="analytics-cards-grid">
          <div className="a-card">
            <span className="a-card-title">Gross Revenue</span>
            <span className="a-card-value">₹24,500</span>
            <span className="a-card-trend positive"><BiTrendingUp /> +14.5% vs last week</span>
          </div>
          <div className="a-card">
            <span className="a-card-title">Net Profit</span>
            <span className="a-card-value">₹8,350</span>
            <span className="a-card-trend positive"><BiTrendingUp /> +4.2% vs last week</span>
          </div>
          <div className="a-card">
            <span className="a-card-title">Total Orders</span>
            <span className="a-card-value">342</span>
            <span className="a-card-trend negative"><BiTrendingDown /> -2.1% vs last week</span>
          </div>
          <div className="a-card">
            <span className="a-card-title">Avg Order Value</span>
            <span className="a-card-value">₹71.60</span>
            <span className="a-card-trend positive"><BiTrendingUp /> +8.4% vs last week</span>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="charts-grid">
          <div className="chart-box">
            <div className="chart-header">
              <span className="chart-title">Revenue vs Expenses</span>
              <div className="chart-actions">
                <select><option>This Week</option><option>This Month</option></select>
              </div>
            </div>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={monthlyData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '13px' }} />
                  <Bar dataKey="revenue" name="Revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="expenses" name="Expenses" fill="#e4cdad" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-box">
            <div className="chart-header">
              <span className="chart-title">Sales by Category</span>
            </div>
            <div style={{ width: '100%', height: 300, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie data={categoryData} innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value" stroke="none">
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', gap: '16px', marginTop: 'auto' }}>
                {categoryData.map(c => (
                  <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-dark)' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: c.fill }}></div>
                    {c.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="charts-grid" style={{ gridTemplateColumns: '1fr' }}>
          <div className="chart-box">
            <div className="chart-header">
              <span className="chart-title">Hourly Order Volume</span>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Peak hours identifier</span>
            </div>
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <AreaChart data={salesVolume} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="orders" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorOrders)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Detailed Sales Section */}
        <div className="detailed-stats-section">
          <div className="detailed-stats-header">
            <h3>Top Performing Items</h3>
            <button className="reset-btn" style={{ border: '1px solid var(--border-color)', backgroundColor: 'white' }}>Export CSV</button>
          </div>
          <table className="detailed-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>Sales Volume</th>
                <th>Revenue</th>
                <th>Popularity</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ fontSize: '16px' }}>☕</span> Cappuccino</div></td>
                <td><span className="badge" style={{ backgroundColor: '#e2e8f0', color: 'var(--text-dark)' }}>Beverages</span></td>
                <td>1,240 sold</td>
                <td style={{ fontWeight: 600 }}>₹1,36,400</td>
                <td>
                  <div className="progress-bar-container">
                    <div className="progress-fill" style={{ width: '90%' }}></div>
                  </div>
                </td>
              </tr>
              <tr>
                <td><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ fontSize: '16px' }}>☕</span> Espresso</div></td>
                <td><span className="badge" style={{ backgroundColor: '#e2e8f0', color: 'var(--text-dark)' }}>Beverages</span></td>
                <td>980 sold</td>
                <td style={{ fontWeight: 600 }}>₹41,160</td>
                <td>
                  <div className="progress-bar-container">
                    <div className="progress-fill" style={{ width: '74%' }}></div>
                  </div>
                </td>
              </tr>
              <tr>
                <td><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ fontSize: '16px' }}>🍰</span> Chocolate Cake</div></td>
                <td><span className="badge" style={{ backgroundColor: '#e4cdad', color: 'var(--text-dark)' }}>Desserts</span></td>
                <td>430 sold</td>
                <td style={{ fontWeight: 600 }}>₹64,500</td>
                <td>
                  <div className="progress-bar-container">
                    <div className="progress-fill" style={{ width: '45%' }}></div>
                  </div>
                </td>
              </tr>
              <tr>
                <td><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ fontSize: '16px' }}>🥪</span> Club Sandwich</div></td>
                <td><span className="badge" style={{ backgroundColor: '#8bbaa9', color: 'white' }}>Food</span></td>
                <td>310 sold</td>
                <td style={{ fontWeight: 600 }}>₹37,200</td>
                <td>
                  <div className="progress-bar-container">
                    <div className="progress-fill" style={{ width: '32%' }}></div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </MainLayout>
  );
}

export default Analytics;