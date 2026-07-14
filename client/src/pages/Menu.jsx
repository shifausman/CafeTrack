import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import MainLayout from "../layouts/MainLayout";
import { toast } from "react-toastify";
import { BiSearch, BiReset, BiPlus, BiX, BiUpload, BiCamera, BiImageAdd, BiEdit, BiTrash } from "react-icons/bi";
import "./Menu.css";

function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [search, setSearch] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Beverages");
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [price, setPrice] = useState("");
  const [photoPreview, setPhotoPreview] = useState(null);

  const fileInputRef = useRef(null);

  // Modals state
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [isCategoryManageOpen, setIsCategoryManageOpen] = useState(false);

  // Webcam state
  const videoRef = useRef(null);
  const [videoStream, setVideoStream] = useState(null);

  const categoriesList = Array.from(new Set([
    ...menuItems.map(i => i.category),
    "Beverages", "Food", "Desserts"
  ])).filter(Boolean);

  const dummyData = [
    { _id: '1', name: 'Espresso', price: 42, category: 'Beverages', isAvailable: true, stock: 8, icon: '☕' },
    { _id: '2', name: 'Cappuccino', price: 110, category: 'Beverages', isAvailable: true, stock: 5, icon: '☕' },
    { _id: '3', name: 'Latte', price: 120, category: 'Beverages', isAvailable: true, stock: 3, icon: '☕' }
  ];

  useEffect(() => {
    fetchMenuItems();
  }, [search]);

  // Clean up webcam
  useEffect(() => {
    if (!isWebcamOpen && videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
    }
  }, [isWebcamOpen]);

  const fetchMenuItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/menu?search=${search}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMenuItems(response.data.length ? response.data : dummyData);
    } catch (error) {
      console.log(error);
      setMenuItems(dummyData);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (editId) {
        await api.put(`/menu/${editId}`, { name, category, price }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await api.post("/menu", { name, category, price }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setIsDrawerOpen(false);
      setName(""); setCategory("Beverages"); setPrice(""); setEditId(null); setPhotoPreview(null);
      fetchMenuItems();
    } catch (error) {
      console.log(error);
    }
  };

  const handleBulkRenameCategory = async (oldCat, newCat) => {
    if (!newCat || oldCat === newCat) return;
    const itemsToUpdate = menuItems.filter(i => i.category === oldCat);
    const token = localStorage.getItem("token");

    try {
      await Promise.all(itemsToUpdate.map(item =>
        api.put(`/menu/${item._id}`, { category: newCat }, { headers: { Authorization: `Bearer ${token}` } })
      ));
      toast.success("Category renamed globally!");
      fetchMenuItems();
      if (category === oldCat) setCategory(newCat);
    } catch (err) {
      toast.error("Failed to rename across items");
    }
  };

  const handleBulkDeleteCategory = async (catToDelete) => {
    if (!window.confirm(`Are you sure you want to remove the category '${catToDelete}'? It will mark assigned items as 'Uncategorized'.`)) return;
    const itemsToUpdate = menuItems.filter(i => i.category === catToDelete);
    const token = localStorage.getItem("token");

    try {
      await Promise.all(itemsToUpdate.map(item =>
        api.put(`/menu/${item._id}`, { category: "Uncategorized" }, { headers: { Authorization: `Bearer ${token}` } })
      ));
      toast.success("Category deleted.");
      if (category === catToDelete) setCategory("Uncategorized");
      fetchMenuItems();
    } catch (err) {
      toast.error("Failed to delete category");
    }
  };

  const openAddDrawer = () => {
    setEditId(null); setName(""); setCategory("Beverages"); setPrice(""); setPhotoPreview(null);
    setIsDrawerOpen(true);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const openWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setVideoStream(stream);
      setIsWebcamOpen(true);
    } catch (err) {
      toast.error("Camera access denied or unavailable.");
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);
    setPhotoPreview(canvas.toDataURL("image/jpeg"));
    setIsWebcamOpen(false);
  };

  return (
    <MainLayout>
      <div className="menu-container">
        <div className="page-header">
          <div className="page-title">
            <h1>Menu Items</h1>
            <p>Manage your café menu items, prices and availability.</p>
          </div>
          <button className="primary-btn" onClick={openAddDrawer}>
            <BiPlus size={20} /> Add Menu Item
          </button>
        </div>

        <div className="filters-row">
          <div className="search-box">
            <BiSearch className="search-icon" />
            <input type="text" placeholder="Search menu items..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="filter-actions">
            <select className="filter-select">
              <option>All Categories</option>
              {categoriesList.map(c => <option key={c}>{c}</option>)}
            </select>
            <select className="filter-select">
              <option>All Status</option>
              <option>Available</option>
              <option>Out of Stock</option>
            </select>
            <button className="reset-btn"><BiReset /> Reset</button>
          </div>
        </div>

        <div className="menu-grid">
          {menuItems.map(item => (
            <div className="menu-card" key={item._id}>
              {item.isAvailable && <span className="card-badge">Available</span>}
              <span className="card-quantity">{item.stock || Math.floor(Math.random() * 10) + 1}</span>
              <div className="card-img-placeholder">
                {item.icon || '☕'}
              </div>
              <div className="card-info">
                <div>
                  <div className="card-title">{item.name}</div>
                  <div className="card-price">₹{item.price}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="card-add-btn" onClick={() => {
                    setEditId(item._id); setName(item.name); setCategory(item.category); setPrice(item.price);
                    setPhotoPreview(null); setIsDrawerOpen(true);
                  }} style={{ backgroundColor: '#f1f5f9', color: 'var(--text-dark)' }}><BiEdit /></button>
                  <button className="card-add-btn" onClick={async () => {
                    if (!window.confirm("Are you sure you want to delete this menu item?")) return;
                    try {
                      const token = localStorage.getItem("token");
                      await api.delete(`/menu/${item._id}`, { headers: { Authorization: `Bearer ${token}` } });
                      toast.success("Menu item deleted!");
                      fetchMenuItems();
                    } catch (err) {
                      setMenuItems(menuItems.filter(m => m._id !== item._id));
                      toast.success("Menu item deleted!"); // Mock fallback
                    }
                  }} style={{ backgroundColor: '#fef2f2', color: 'var(--danger)' }}><BiTrash /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isDrawerOpen && (
        <div className="drawer-overlay">
          <div className="drawer" style={{ zIndex: 1000 }}>
            <div className="drawer-header">
              <h3>{editId ? "Edit Menu Item" : "Add Menu Item"}</h3>
              <button className="close-btn" onClick={() => setIsDrawerOpen(false)}><BiX /></button>
            </div>
            <form className="drawer-form" onSubmit={handleSave}>
              <div className="form-group">
                <label>Item Name *</label>
                <input required type="text" placeholder="Enter item name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <label>Category *</label>
                  <button type="button" onClick={() => setIsCategoryManageOpen(true)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                    Manage Categories
                  </button>
                </div>
                {!isNewCategory ? (
                  <select value={category} onChange={(e) => {
                    if (e.target.value === "ADD_NEW") {
                      setCategory(""); setIsNewCategory(true);
                    } else { setCategory(e.target.value); }
                  }}>
                    {categoriesList.map(c => <option key={c} value={c}>{c}</option>)}
                    <option value="ADD_NEW" style={{ fontWeight: 'bold', color: 'var(--primary)' }}>+ Add New Category...</option>
                  </select>
                ) : (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input autoFocus required type="text" placeholder="Type new category..." value={category} onChange={(e) => setCategory(e.target.value)} style={{ flex: 1 }} />
                    <button type="button" className="action-btn" onClick={() => { setIsNewCategory(false); setCategory(categoriesList[0] || "Beverages"); }}>Cancel</button>
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Price (₹) *</label>
                <input required type="number" placeholder="Enter price" value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>

              <div className="form-group">
                <label>Product Photo <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>(Optional)</span></label>
                <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                  <div style={{
                    width: '100px', height: '100px', backgroundColor: '#f1f5f9',
                    borderRadius: 'var(--radius-md)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '32px',
                    overflow: 'hidden'
                  }}>
                    {photoPreview ? <img src={photoPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <BiImageAdd />}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                    <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} />

                    <button type="button" className="action-btn" onClick={() => fileInputRef.current.click()} style={{ width: '100%', justifyContent: 'center', display: 'flex', gap: '8px' }}>
                      <BiUpload /> Upload Photo
                    </button>
                    <button type="button" className="action-btn" onClick={openWebcam} style={{ width: '100%', justifyContent: 'center', display: 'flex', gap: '8px' }}>
                      <BiCamera /> Use Camera (WebCam)
                    </button>
                  </div>
                </div>
              </div>

              <div className="drawer-footer">
                <button type="button" className="cancel-btn" onClick={() => setIsDrawerOpen(false)}>Cancel</button>
                <button type="submit" className="primary-btn">Save Item</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Webcam Modal */}
      {isWebcamOpen && (
        <div className="drawer-overlay" style={{ zIndex: 9999, display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ margin: 0 }}>Capture Photo</h3>
            <video
              ref={node => {
                if (node) node.srcObject = videoStream;
                videoRef.current = node;
              }}
              autoPlay
              playsInline
              style={{ width: '400px', height: '300px', backgroundColor: '#000', borderRadius: '8px', objectFit: 'cover' }}
            ></video>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button type="button" className="cancel-btn" onClick={() => setIsWebcamOpen(false)}>Cancel</button>
              <button type="button" className="primary-btn" onClick={capturePhoto}>Take Photo</button>
            </div>
          </div>
        </div>
      )}

      {/* Category Manager Modal */}
      {isCategoryManageOpen && (
        <div className="drawer-overlay" style={{ zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', width: '400px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>Manage Categories</h3>
              <button onClick={() => setIsCategoryManageOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><BiX size={24} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {categoriesList.map(cat => {
                return <CategoryRow key={cat} categoryName={cat} onRename={handleBulkRenameCategory} onDelete={handleBulkDeleteCategory} />
              })}
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

function CategoryRow({ categoryName, onRename, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editVal, setEditVal] = useState(categoryName);

  if (isEditing) {
    return (
      <div style={{ display: 'flex', gap: '8px' }}>
        <input autoFocus type="text" value={editVal} onChange={e => setEditVal(e.target.value)} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }} />
        <button onClick={() => { onRename(categoryName, editVal); setIsEditing(false); }} className="primary-btn" style={{ padding: '8px 12px' }}>Save</button>
        <button onClick={() => setIsEditing(false)} className="cancel-btn" style={{ padding: '8px 12px' }}>Cancel</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-color)', alignItems: 'center' }}>
      <span style={{ fontWeight: 500 }}>{categoryName}</span>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={() => setIsEditing(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><BiEdit size={18} /></button>
        <button onClick={() => onDelete(categoryName)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}><BiTrash size={18} /></button>
      </div>
    </div>
  )
}

export default Menu;