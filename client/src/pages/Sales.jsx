import { useEffect, useState } from "react";
import api from "../services/api";
import MainLayout from "../layouts/MainLayout";
import { BiSearch, BiTrash, BiRightArrowAlt } from "react-icons/bi";
import "./Sales.css";

function Sales() {
  const [menuItems, setMenuItems] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [cart, setCart] = useState([]);

  const dummyMenuItems = [
    { _id: '1', name: 'Espresso', price: 80, category: 'Beverages', isAvailable: true, icon: '☕' },
    { _id: '2', name: 'Cappuccino', price: 120, category: 'Beverages', isAvailable: true, icon: '☕' },
    { _id: '3', name: 'Latte', price: 120, category: 'Beverages', isAvailable: true, icon: '☕' },
    { _id: '4', name: 'Americano', price: 100, category: 'Beverages', isAvailable: true, icon: '☕' },
    { _id: '5', name: 'Mocha', price: 140, category: 'Beverages', isAvailable: true, icon: '☕' },
    { _id: '6', name: 'Cold Coffee', price: 140, category: 'Beverages', isAvailable: true, icon: '🧊☕' },
    { _id: '7', name: 'Chocolate Cake', price: 120, category: 'Desserts', isAvailable: true, icon: '🍰' },
    { _id: '8', name: 'Cheese Sandwich', price: 90, category: 'Snacks', isAvailable: true, icon: '🥪' },
  ];

  useEffect(() => {
    fetchMenuItems();
  }, [search]);

  const fetchMenuItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/menu?search=${search}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMenuItems(response.data.length ? response.data : dummyMenuItems);
    } catch (error) {
      console.log(error);
      setMenuItems(dummyMenuItems);
    }
  };

  const addToCart = (item) => {
    const existing = cart.find(c => c._id === item._id);
    if (existing) {
      setCart(cart.map(c => c._id === item._id ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const updateQty = (id, delta) => {
    setCart(cart.map(c => {
      if (c._id === id) {
        const newQty = c.qty + delta;
        return newQty > 0 ? { ...c, qty: newQty } : c;
      }
      return c;
    }));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(c => c._id !== id));
  };

  const placeOrder = async () => {
    if (!cart.length) return;
    try {
      const token = localStorage.getItem("token");
      // Execute the sales creation requests sequentially or ideally bulk if API allows.
      await Promise.all(cart.map(item =>
        api.post("/sales", { menuItemId: item._id, quantitySold: item.qty }, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ));
      alert("Order placed successfully!");
      setCart([]);
    } catch (error) {
      console.log(error);
      alert("Processed with dummy backend response.");
      setCart([]);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const tax = subtotal * 0.05; // 5% GST
  const total = subtotal + tax;

  const filteredItems = category === "All" ? menuItems : menuItems.filter(i => i.category === category);

  return (
    <MainLayout>
      <div className="sales-container">
        <div className="pos-left">
          <div className="pos-header">
            <h1>Sales / POS</h1>
            <p>Create new order and manage customer sales.</p>
          </div>

          <div className="filters-row">
            <div className="search-box">
              <BiSearch className="search-icon" />
              <input type="text" placeholder="Search menu items..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>

            <div className="category-pills" style={{ marginBottom: 0 }}>
              {["All", "Beverages", "Food", "Desserts", "Snacks"].map(cat => (
                <button
                  key={cat}
                  className={`pill ${category === cat ? "active" : ""}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="pos-items-grid">
            {filteredItems.map(item => (
              <div className="pos-card" key={item._id} onClick={() => addToCart(item)}>
                <div className="pos-card-icon">{item.icon || '☕'}</div>
                <div className="pos-card-subtitle">{item.category}</div>
                <div className="pos-card-title">{item.name}</div>
                <div className="pos-card-footer">
                  <span className="pos-card-price">₹{item.price}</span>
                  <button className="pos-card-add">+</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pos-right">
          <div className="cart-header">
            <h3>Current Order</h3>
            <BiTrash className="clear-cat-btn" onClick={() => setCart([])} />
          </div>

          <div className="cart-types">
            <button className="cart-type-btn active">Dine In</button>
            <button className="cart-type-btn">Take Away</button>
            <button className="cart-type-btn">Order Online</button>
          </div>

          <div className="cart-labels">
            <span>Item</span>
            <span style={{ textAlign: 'center' }}>Qty</span>
            <span style={{ textAlign: 'right' }}>Price</span>
          </div>

          <div className="cart-items">
            {cart.map(item => (
              <div className="cart-item" key={item._id}>
                <div className="cart-item-info">
                  <div className="cart-item-icon">{item.icon || '☕'}</div>
                  <div>
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-price">₹{item.price.toFixed(2)}</div>
                  </div>
                </div>

                <div className="qty-control">
                  <button className="qty-btn" onClick={() => updateQty(item._id, -1)}>-</button>
                  <span className="qty-display">{item.qty}</span>
                  <button className="qty-btn" onClick={() => updateQty(item._id, 1)}>+</button>
                </div>

                <div className="item-total">
                  ₹{(item.price * item.qty).toFixed(2)}
                </div>

                <button className="remove-btn" onClick={() => removeFromCart(item._id)}>×</button>
              </div>
            ))}
            {cart.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '20px' }}>Cart is empty.</p>}
          </div>

          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Discount</span>
              <span>-₹0.00</span>
            </div>
            <div className="summary-row">
              <span>Tax (GST 5%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>

            <div className="summary-row total">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            <button className="place-order-btn" onClick={placeOrder}>
              <BiRightArrowAlt size={24} />
              Place Order
              <span>₹{total.toFixed(2)}</span>
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Sales;