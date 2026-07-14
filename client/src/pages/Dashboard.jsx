import { useEffect, useState } from "react";
import api from "../services/api";
import DashboardCard from "../components/DashboardCard";
import MainLayout from "../layouts/MainLayout";
import { BiDollarCircle, BiWalletAlt, BiTrendingUp, BiCartAlt, BiCube } from "react-icons/bi";
import { GiSugarCane, GiCoffeeBeans, GiMilkCarton } from "react-icons/gi";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import "./Dashboard.css";

function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/dashboard", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(response.data);
    } catch (error) {
      console.log(error);
      // Dummy data for design visualization if API fails or is empty
      setData({
        totalRevenue: 360,
        totalExpenses: 600,
        profit: -240,
        totalSales: 28
      });
    }
  };

  const salesData = [
    { name: '1 Jun', uv: 200 }, { name: '7 Jun', uv: 250 }, { name: '14 Jun', uv: 220 },
    { name: '21 Jun', uv: 330 }, { name: '30 Jun', uv: 440 },
  ];
  const expenseData = [
    { name: 'Raw Materials', value: 240 }, { name: 'Utilities', value: 150 },
    { name: 'Salaries', value: 130 }, { name: 'Other Expenses', value: 80 },
  ];
  const COLORS = ['#88DEC0', '#FFB775', '#A5B4FC', '#93C5FD'];

  if (!data) return <MainLayout><h2>Loading...</h2></MainLayout>;

  return (
    <MainLayout>
      <div className="dashboard-container">

        {/* Header Message */}
        <div style={{ marginBottom: "4px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "700" }}>Welcome back, Barista! 👋</h2>
        </div>

        {/* KPI Cards Row */}
        <div className="kpi-row">
          <DashboardCard
            title="Total Revenue"
            value={`₹${data.totalRevenue}`}
            icon={<BiDollarCircle />}
            iconBg="#D1FAE5" iconColor="#10B981"
            trendText="+12% from last month" isPositive={true}
          />
          <DashboardCard
            title="Total Expenses"
            value={`₹${data.totalExpenses}`}
            icon={<BiWalletAlt />}
            iconBg="#FFEDD5" iconColor="#F97316"
            trendText="+8% from last month" isPositive={false}
          />
          <DashboardCard
            title="Profit"
            value={`₹${data.profit}`}
            icon={<BiTrendingUp />}
            iconBg="#D1FAE5" iconColor="#10B981"
            trendText="-4% from last month" isPositive={false}
          />
          <DashboardCard
            title="Total Sales"
            value={data.totalSales}
            icon={<BiCartAlt />}
            iconBg="#E0E7FF" iconColor="#6366F1"
            trendText="Orders this month" isPositive={true}
          />
        </div>

        {/* First Grid Row */}
        <div className="dashboard-grid">
          <div className="dashboard-section">
            <div className="section-header">
              <h3>Recent Sales</h3>
              <button className="view-all-btn">View All</button>
            </div>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Order ID</th><th>Item</th><th>Quantity</th><th>Amount</th><th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="order-id">#ORD28</td><td>Cappuccino</td><td>1</td><td>₹120</td><td>23 Jun, 10:30 AM</td>
                </tr>
                <tr>
                  <td className="order-id">#ORD27</td><td>Latte</td><td>2</td><td>₹240</td><td>23 Jun, 09:45 AM</td>
                </tr>
                <tr>
                  <td className="order-id">#ORD26</td><td>Americano</td><td>1</td><td>₹100</td><td>22 Jun, 04:20 PM</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h3>Low Stock Items</h3>
              <button className="view-all-btn-red">View All</button>
            </div>
            <div className="low-stock-list">
              <div className="low-stock-item">
                <div className="item-icon"><GiSugarCane color="#D97706" /></div>
                <div className="item-info">
                  <h4>Sugar</h4><p>5 / 10 kg</p>
                </div>
                <span className="low-badge">Low</span>
              </div>
              <div className="low-stock-item">
                <div className="item-icon"><GiCoffeeBeans color="#6B21A8" /></div>
                <div className="item-info">
                  <h4>Coffee Beans</h4><p>200 / 500 g</p>
                </div>
                <span className="low-badge">Low</span>
              </div>
            </div>
          </div>
        </div>

        {/* Second Grid Row */}
        <div className="dashboard-grid">
          <div className="dashboard-section" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <div className="section-header"><h3>Sales Overview</h3></div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                    <YAxis axisLine={false} tickLine={false} fontSize={12} />
                    <Tooltip />
                    <Area type="monotone" dataKey="uv" stroke="#10B981" fillOpacity={1} fill="url(#colorUv)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div>
              <div className="section-header"><h3>Expense Overview</h3></div>
              <div className="chart-wrapper" style={{ display: 'flex', alignItems: 'center' }}>
                <ResponsiveContainer width="50%" height="100%">
                  <PieChart>
                    <Pie data={expenseData} innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                      {expenseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ flex: 1, fontSize: '12px' }}>
                  {expenseData.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: COLORS[idx] }}></div>
                        {item.name}
                      </span>
                      <strong>₹{item.value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h3>Top Selling Items</h3>
              <button className="view-all-btn">View All</button>
            </div>
            <div className="top-selling-list">
              <div className="top-selling-item">
                <div className="item-icon" style={{ width: 32, height: 32 }}>☕</div>
                <div className="top-selling-info">
                  <div className="ts-header"><span>Cappuccino</span><span>12</span></div>
                  <div className="progress-bar"><div className="progress-fill" style={{ width: '90%' }}></div></div>
                </div>
              </div>
              <div className="top-selling-item">
                <div className="item-icon" style={{ width: 32, height: 32 }}>☕</div>
                <div className="top-selling-info">
                  <div className="ts-header"><span>Latte</span><span>8</span></div>
                  <div className="progress-bar"><div className="progress-fill" style={{ width: '60%' }}></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </MainLayout>
  );
}

export default Dashboard;