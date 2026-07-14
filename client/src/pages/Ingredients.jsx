import { useEffect, useState } from "react";
import api from "../services/api";
import MainLayout from "../layouts/MainLayout";
import DashboardCard from "../components/DashboardCard";
import { toast } from "react-toastify";
import { BiSearch, BiReset, BiPlus, BiX, BiBox, BiBell, BiCartAlt, BiTrendingUp, BiEdit, BiTrash } from "react-icons/bi";
import "./Menu.css"; // Reuse drawer, form, and header styles from Menu
import "./Ingredients.css";

function Ingredients() {
  const [ingredients, setIngredients] = useState([]);
  const [search, setSearch] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Dairy");
  const [unit, setUnit] = useState("Litre (L)");
  const [quantity, setQuantity] = useState("");
  const [minimumStock, setMinimumStock] = useState("");
  const [price, setPrice] = useState(""); // Unit Price

  const dummyIngredients = [
    { _id: '1', name: 'Milk', description: 'Fresh cow milk', category: 'Dairy', unit: 'Litre (L)', quantity: 12.5, price: 60, minimumStock: 5, icon: '🥛' },
    { _id: '2', name: 'Coffee Powder', description: 'Arabica blend', category: 'Beverages', unit: 'Gram (g)', quantity: 850, price: 0.5, minimumStock: 200, icon: '🫘' },
    { _id: '3', name: 'Tea Powder', description: 'Premium dust tea', category: 'Beverages', unit: 'Gram (g)', quantity: 300, price: 0.3, minimumStock: 500, icon: '🍵' },
    { _id: '4', name: 'Sugar', description: 'Refined white sugar', category: 'Bakery', unit: 'Kilogram (kg)', quantity: 2.2, price: 45, minimumStock: 5, icon: '🍬' },
  ];

  useEffect(() => {
    fetchIngredients();
  }, [search]);

  const fetchIngredients = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/ingredients?search=${search}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIngredients(response.data.length ? response.data : dummyIngredients);
    } catch (error) {
      console.log(error);
      setIngredients(dummyIngredients);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (editId) {
        await api.put(`/ingredients/${editId}`, { name, quantity, unit, minimumStock }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await api.post("/ingredients", { name, quantity, unit, minimumStock }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      toast.success(editId ? "Ingredient updated successfully!" : "Ingredient added successfully!");
      setIsDrawerOpen(false);
      resetForm();
      fetchIngredients();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to save ingredient");
    }
  };

  const deleteIngredient = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ingredient?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/ingredients/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Ingredient deleted successfully!");
      fetchIngredients();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete ingredient");
    }
  };

  const openAddDrawer = () => {
    resetForm();
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (item) => {
    setEditId(item._id);
    setName(item.name);
    setCategory(item.category || "General");
    setUnit(item.unit);
    setQuantity(item.quantity);
    setMinimumStock(item.minimumStock);
    setPrice(item.price || 0);
    setIsDrawerOpen(true);
  };

  const resetForm = () => {
    setEditId(null); setName(""); setCategory("Dairy"); setUnit("Litre (L)"); setQuantity(""); setMinimumStock(""); setPrice("");
  };

  return (
    <MainLayout>
      <div className="ingredients-container">

        <div className="page-header">
          <div className="page-title">
            <h1>Ingredients</h1>
            <p>Manage your raw materials and track stock levels.</p>
          </div>
          <button className="primary-btn" onClick={openAddDrawer}>
            <BiPlus size={20} /> Add Ingredient
          </button>
        </div>

        <div className="kpi-row">
          <DashboardCard title="Total Ingredients" value="32" icon={<BiBox />} iconBg="#E0E7FF" iconColor="#6366F1" trendText="All raw materials" isPositive={true} />
          <DashboardCard title="Low Stock" value="5" icon={<BiBell />} iconBg="#FEF3C7" iconColor="#F59E0B" trendText="Requiring attention" isPositive={false} />
          <DashboardCard title="Total Stock Value" value="₹12,450.75" icon={<BiCartAlt />} iconBg="#FEE2E2" iconColor="#EF4444" trendText="Current inventory value" isPositive={true} />
          <DashboardCard title="This Month Purchases" value="₹4,250.00" icon={<BiTrendingUp />} iconBg="#D1FAE5" iconColor="#10B981" trendText="Total spent" isPositive={true} />
        </div>

        <div className="table-wrapper">
          <div className="filters-row" style={{ padding: '24px', marginBottom: 0, borderBottom: '1px solid var(--border-color)' }}>
            <div className="search-box">
              <BiSearch className="search-icon" />
              <input type="text" placeholder="Search ingredients..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="filter-actions">
              <select className="filter-select"><option>All Categories</option></select>
              <select className="filter-select"><option>All Units</option></select>
              <select className="filter-select"><option>All Status</option></select>
              <button className="reset-btn"><BiReset /> Reset</button>
            </div>
          </div>

          <table className="ing-table">
            <thead>
              <tr>
                <th>Ingredient</th><th>Category</th><th>Unit</th><th>Current Stock</th><th>Unit Price</th><th>Stock Value</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ingredients.map(item => {
                const stockVal = ((item.price || 0) * item.quantity).toFixed(2);
                const isLow = item.quantity <= item.minimumStock;
                return (
                  <tr key={item._id}>
                    <td>
                      <div className="ing-name-cell">
                        <div className="ing-icon">{item.icon || '📦'}</div>
                        <div className="ing-details">
                          <span className="ing-title">{item.name}</span>
                          <span className="ing-sub">{item.description || "General item"}</span>
                        </div>
                      </div>
                    </td>
                    <td><span className="pill" style={{ padding: '4px 8px', fontSize: '12px', border: 'none', backgroundColor: '#f1f5f9' }}>{item.category || 'General'}</span></td>
                    <td>{item.unit}</td>
                    <td style={{ fontWeight: 600 }}>{item.quantity} {item.unit.split(' ')[0]}</td>
                    <td>₹{item.price || 0} / {item.unit.split(' ')[0]}</td>
                    <td>₹{stockVal}</td>
                    <td>
                      <span className={`status-badge ${isLow ? 'status-low' : 'status-instock'}`}>
                        {isLow ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="action-btn" onClick={() => openEditDrawer(item)}><BiEdit /></button>
                        <button className="action-btn" onClick={() => deleteIngredient(item._id)} style={{ color: 'var(--danger)' }}><BiTrash /></button>
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
              <h3>{editId ? "Edit Ingredient" : "Add Ingredient"}</h3>
              <button className="close-btn" onClick={() => setIsDrawerOpen(false)}><BiX /></button>
            </div>
            <form className="drawer-form" onSubmit={handleSave}>
              <div className="form-group"><label>Ingredient Name *</label><input required type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} /></div>
              <div className="form-group"><label>Category *</label><select value={category} onChange={(e) => setCategory(e.target.value)}><option>Dairy</option><option>Beverages</option><option>Bakery</option><option>Other</option></select></div>
              <div className="form-group"><label>Unit *</label><select value={unit} onChange={(e) => setUnit(e.target.value)}><option>Litre (L)</option><option>Gram (g)</option><option>Kilogram (kg)</option><option>Piece</option></select></div>
              <div className="form-group"><label>Unit Price (₹) *</label><input required type="number" placeholder="Enter unit price" value={price} onChange={(e) => setPrice(e.target.value)} /></div>
              <div className="form-group"><label>Initial Stock *</label><input required type="number" placeholder="Enter stock" value={quantity} onChange={(e) => setQuantity(e.target.value)} /></div>
              <div className="form-group"><label>Low Stock Alert</label><input type="number" placeholder="Enter threshold" value={minimumStock} onChange={(e) => setMinimumStock(e.target.value)} /></div>

              <div className="drawer-footer">
                <button type="button" className="cancel-btn" onClick={() => setIsDrawerOpen(false)}>Cancel</button>
                <button type="submit" className="primary-btn">Save Ingredient</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default Ingredients;