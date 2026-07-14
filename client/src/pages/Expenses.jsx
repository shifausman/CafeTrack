import { useEffect, useState } from "react";
import api from "../services/api";
import MainLayout from "../layouts/MainLayout";
import DashboardCard from "../components/DashboardCard";
import { toast } from "react-toastify";
import { BiSearch, BiReset, BiPlus, BiX, BiWalletAlt, BiCalendar, BiTrendingUp, BiPieChartAlt2, BiEdit, BiTrash } from "react-icons/bi";
import "./Menu.css"; // Reuse general styles
import "./Ingredients.css"; // Reuse table styles
import "./Expenses.css";

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Rent");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [description, setDescription] = useState("");

  const dummyExpenses = [
    { _id: '1', date: '2024-06-23', name: 'Monthly Rent', category: 'Rent', amount: 5000, paymentMethod: 'Bank Transfer', description: 'Shop rent for June' },
    { _id: '2', date: '2024-06-22', name: 'Electricity Bill', category: 'Utilities', amount: 1250, paymentMethod: 'UPI', description: 'May month bill' },
    { _id: '3', date: '2024-06-21', name: 'Milk Supplier Payment', category: 'Ingredients', amount: 2850, paymentMethod: 'Bank Transfer', description: '4 days milk supply' },
    { _id: '4', date: '2024-06-20', name: 'Staff Salary', category: 'Salary', amount: 8000, paymentMethod: 'Cash', description: 'Paid to 2 staff' },
    { _id: '5', date: '2024-06-19', name: 'Packaging Materials', category: 'Supplies', amount: 650, paymentMethod: 'UPI', description: 'Cups, lids, straws' },
  ];

  useEffect(() => {
    fetchExpenses();
  }, [search]);

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/expenses?search=${search}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpenses(response.data.length ? response.data : dummyExpenses);
    } catch (error) {
      console.log(error);
      setExpenses(dummyExpenses);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const payload = { date: date || new Date().toISOString(), name, category, amount, paymentMethod, description };
      if (editId) {
        await api.put(`/expenses/${editId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await api.post("/expenses", payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      toast.success(editId ? "Expense updated successfully!" : "Expense added successfully!");
      setIsDrawerOpen(false);
      resetForm();
      fetchExpenses();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to save expense");
    }
  };

  const deleteExpense = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Expense deleted successfully!");
      fetchExpenses();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete expense");
    }
  };

  const openAddDrawer = () => {
    resetForm();
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (item) => {
    setEditId(item._id);
    setDate(item.date ? item.date.split('T')[0] : "");
    setName(item.name || item.description); // Fallback for old schema
    setCategory(item.category);
    setAmount(item.amount);
    setPaymentMethod(item.paymentMethod || "Cash");
    setDescription(item.description);
    setIsDrawerOpen(true);
  };

  const resetForm = () => {
    setEditId(null); setDate(""); setName(""); setCategory("Rent"); setAmount(""); setPaymentMethod("Cash"); setDescription("");
  };

  const formatPaymentMethod = (method) => {
    const pm = method?.toLowerCase() || '';
    if (pm.includes('upi')) return 'payment-upi';
    if (pm.includes('cash')) return 'payment-cash';
    if (pm.includes('bank')) return 'payment-bank';
    if (pm.includes('card')) return 'payment-card';
    return '';
  };

  return (
    <MainLayout>
      <div className="expenses-container">
        <div className="page-header">
          <div className="page-title">
            <h1>Expenses</h1>
            <p>Track and manage all your café expenses.</p>
          </div>
          <button className="primary-btn" onClick={openAddDrawer}>
            <BiPlus size={20} /> Add Expense
          </button>
        </div>

        <div className="kpi-row">
          <DashboardCard title="Total Expenses (This Month)" value="₹12,450.75" icon={<BiWalletAlt />} iconBg="#D1FAE5" iconColor="#10B981" trendText="~ 8.5% from last month" isPositive={true} />
          <DashboardCard title="Total Expenses (This Year)" value="₹85,230.50" icon={<BiCalendar />} iconBg="#FEF3C7" iconColor="#F59E0B" trendText="~ 12.4% from last year" isPositive={false} />
          <DashboardCard title="Average / Month" value="₹7,102.54" icon={<BiTrendingUp />} iconBg="#FEE2E2" iconColor="#EF4444" trendText="This year average" isPositive={true} />
          <DashboardCard title="Top Category" value="Rent" icon={<BiPieChartAlt2 />} iconBg="#E0E7FF" iconColor="#6366F1" trendText="32% of total expenses" isPositive={true} />
        </div>

        <div className="table-wrapper">
          <div className="filters-row" style={{ padding: '24px', marginBottom: 0, borderBottom: '1px solid var(--border-color)' }}>
            <div className="search-box">
              <BiSearch className="search-icon" />
              <input type="text" placeholder="Search expenses..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="filter-actions">
              <select className="filter-select"><option>All Categories</option></select>
              <select className="filter-select"><option>All Payment Methods</option></select>
              <div className="filter-select" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}><BiCalendar /> <span>01 May - 23 Jun</span></div>
              <button className="reset-btn"><BiReset /> Reset</button>
            </div>
          </div>

          <table className="ing-table">
            <thead>
              <tr>
                <th>Date</th><th>Expense Name</th><th>Category</th><th>Amount (₹)</th><th>Payment Method</th><th>Notes</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(expense => {
                const dateStr = new Date(expense.date || expense.createdAt || new Date()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                return (
                  <tr key={expense._id} className="expense-row">
                    <td>{dateStr}</td>
                    <td className="expense-name">{expense.name || 'Expense Item'}</td>
                    <td><span className="pill" style={{ padding: '4px 8px', fontSize: '12px', border: 'none', backgroundColor: '#f1f5f9', color: 'var(--success)' }}>{expense.category}</span></td>
                    <td style={{ fontWeight: 600 }}>₹{expense.amount}</td>
                    <td>
                      <span className={`payment-tag ${formatPaymentMethod(expense.paymentMethod)}`}>
                        {expense.paymentMethod || 'Cash'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{expense.description}</td>
                    <td>
                      <div className="action-btns">
                        <button className="action-btn" onClick={() => openEditDrawer(expense)}><BiEdit /></button>
                        <button className="action-btn" onClick={() => deleteExpense(expense._id)} style={{ color: 'var(--danger)' }}><BiTrash /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isDrawerOpen && (
        <div className="drawer-overlay">
          <div className="drawer">
            <div className="drawer-header">
              <h3>{editId ? "Edit Expense" : "Add Expense"}</h3>
              <button className="close-btn" onClick={() => setIsDrawerOpen(false)}><BiX /></button>
            </div>
            <form className="drawer-form" onSubmit={handleSave}>
              <div className="form-group"><label>Expense Name *</label><input required type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} /></div>
              <div className="form-group"><label>Category *</label><select value={category} onChange={(e) => setCategory(e.target.value)}><option>Rent</option><option>Utilities</option><option>Ingredients</option><option>Salary</option><option>Supplies</option><option>Marketing</option></select></div>
              <div className="form-group"><label>Amount (₹) *</label><input required type="number" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
              <div className="form-group"><label>Payment Method *</label><select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}><option>Cash</option><option>Bank Transfer</option><option>UPI</option><option>Card</option></select></div>
              <div className="form-group"><label>Date *</label><input required type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
              <div className="form-group"><label>Notes (Optional)</label><textarea placeholder="Enter notes" value={description} onChange={(e) => setDescription(e.target.value)} rows="3" /></div>

              <div className="drawer-footer">
                <button type="button" className="cancel-btn" onClick={() => setIsDrawerOpen(false)}>Cancel</button>
                <button type="submit" className="primary-btn">Save Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default Expenses;