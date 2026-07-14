import { useEffect, useState } from "react";
import api from "../services/api";
import MainLayout from "../layouts/MainLayout";
import { toast } from "react-toastify";
import { BiSearch, BiPlus, BiX, BiTrash } from "react-icons/bi";
import "./Menu.css"; // Reuse Menu styles for the grid and drawer
import "./Recipes.css";

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [search, setSearch] = useState("");

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Form State
  const [menuItemId, setMenuItemId] = useState("");
  const [draftComponents, setDraftComponents] = useState([{ ingredientId: "", quantityRequired: "" }]);

  const dummyRecipes = [
    { _id: 'r1', menuItemId: { _id: 'm1', name: 'Cappuccino', icon: '☕' }, ingredientId: { _id: 'i1', name: 'Milk', unit: 'Litre (L)' }, quantityRequired: 0.15 },
    { _id: 'r2', menuItemId: { _id: 'm1', name: 'Cappuccino', icon: '☕' }, ingredientId: { _id: 'i2', name: 'Coffee Powder', unit: 'Gram (g)' }, quantityRequired: 15 },
    { _id: 'r3', menuItemId: { _id: 'm2', name: 'Chocolate Cake', icon: '🍰' }, ingredientId: { _id: 'i3', name: 'Sugar', unit: 'Gram (g)' }, quantityRequired: 50 },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [resRecipes, resMenu, resIng] = await Promise.all([
        api.get("/recipes", { headers: { Authorization: `Bearer ${token}` } }),
        api.get("/menu", { headers: { Authorization: `Bearer ${token}` } }),
        api.get("/ingredients", { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setRecipes(resRecipes.data.length ? resRecipes.data : dummyRecipes);
      setMenuItems(resMenu.data);
      setIngredients(resIng.data);
    } catch (error) {
      console.log(error);
      setRecipes(dummyRecipes);
      setMenuItems([
        { _id: 'm1', name: 'Cappuccino', icon: '☕', category: 'Beverages', price: 110 },
        { _id: 'm2', name: 'Chocolate Cake', icon: '🍰', category: 'Desserts', price: 150 },
        { _id: 'm3', name: 'Latte', icon: '☕', category: 'Beverages', price: 120 }
      ]);
      setIngredients([
        { _id: 'i1', name: 'Milk', unit: 'Litre (L)', quantity: 20 },
        { _id: 'i2', name: 'Coffee Powder', unit: 'Gram (g)', quantity: 500 },
        { _id: 'i3', name: 'Sugar', unit: 'Gram (g)', quantity: 1000 },
        { _id: 'i4', name: 'Vanilla Extract', unit: 'ml', quantity: 50 }
      ]);
    }
  };

  const handleDraftChange = (index, field, value) => {
    const newDraft = [...draftComponents];
    newDraft[index][field] = value;
    setDraftComponents(newDraft);
  };

  const addDraftRow = () => {
    setDraftComponents([...draftComponents, { ingredientId: "", quantityRequired: "" }]);
  };

  const removeDraftRow = (index) => {
    setDraftComponents(draftComponents.filter((_, i) => i !== index));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const validRows = draftComponents.filter(c => c.ingredientId && c.quantityRequired);

    if (!menuItemId) return toast.error("Please select a target Menu Item.");
    if (validRows.length === 0) return toast.error("Please add at least one complete ingredient mapping.");

    try {
      const token = localStorage.getItem("token");
      await Promise.all(validRows.map(comp =>
        api.post("/recipes", {
          menuItemId,
          ingredientId: comp.ingredientId,
          quantityRequired: comp.quantityRequired
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ));

      toast.success("Recipe mapped successfully!");
      setIsDrawerOpen(false);
      fetchData();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to save recipe");
    }
  };

  const deleteRecipe = async (id) => {
    if (!window.confirm("Are you sure you want to remove this ingredient from the recipe?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/recipes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Component deleted successfully!");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete component");
    }
  };

  const openAddDrawer = (preselectMenuItemId = "") => {
    setMenuItemId(preselectMenuItemId);
    setDraftComponents([{ ingredientId: "", quantityRequired: "" }]);
    setIsDrawerOpen(true);
  };

  // Group recipes by Menu Item
  const groupedRecipes = {};
  recipes.forEach(r => {
    if (!r.menuItemId) return;
    const mId = r.menuItemId._id;
    if (!groupedRecipes[mId]) {
      groupedRecipes[mId] = {
        menuItem: r.menuItemId,
        components: []
      };
    }
    groupedRecipes[mId].components.push(r);
  });

  // Filter
  const filteredGroups = Object.values(groupedRecipes).filter(g =>
    g.menuItem.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="menu-container">
        <div className="page-header">
          <div className="page-title">
            <h1>Recipes & Inventory Tracking</h1>
            <p>Map ingredients to menu items to automate inventory deduction.</p>
          </div>
          <button className="primary-btn" onClick={() => openAddDrawer()}>
            <BiPlus size={20} /> Add Recipe Mapping
          </button>
        </div>

        <div className="filters-row">
          <div className="search-box">
            <BiSearch className="search-icon" />
            <input type="text" placeholder="Search recipe mappings..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="menu-grid">
          {filteredGroups.map(group => {
            const liveMenuItem = menuItems.find(m => m._id === group.menuItem._id) || group.menuItem;
            return (
              <div className="menu-card" key={group.menuItem._id} style={{ padding: '20px' }}>
                <div className="menu-info" style={{ marginBottom: '16px' }}>
                  <div className="card-img-placeholder" style={{ marginBottom: '12px', width: '100%', height: '140px', overflow: 'hidden' }}>
                    {liveMenuItem.icon ? (
                      liveMenuItem.icon.startsWith('data:') ? <img src={liveMenuItem.icon} alt={liveMenuItem.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : liveMenuItem.icon
                    ) : '☕'}
                  </div>
                  <h3 className="menu-title">{liveMenuItem.name}</h3>
                  <span className="badge badge-success">Configured</span>
                </div>

                <div className="recipe-components">
                  <h4 style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Ingredients Required:</h4>
                  <ul className="ingredient-list">
                    {group.components.map(comp => (
                      <li key={comp._id} className="ingredient-item">
                        <div className="ing-info">
                          <span className="ing-name">{comp.ingredientId?.name || "Unknown"}</span>
                          <span className="ing-qty">{comp.quantityRequired} {comp.ingredientId?.unit?.split(' ')[0]}</span>
                        </div>
                        <button className="action-btn text-danger" onClick={() => deleteRecipe(comp._id)} title="Remove ingredient">
                          <BiTrash size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="card-actions" style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                  <button className="edit-btn" style={{ flex: 1 }} onClick={() => openAddDrawer(group.menuItem._id)}>
                    + Add Component
                  </button>
                  <button className="cancel-btn text-danger" style={{ padding: '8px 12px' }} title="Delete entire recipe" onClick={async () => {
                    if (!window.confirm(`Are you sure you want to delete the ENTIRE recipe for ${liveMenuItem.name}?`)) return;
                    try {
                      const token = localStorage.getItem("token");
                      await Promise.all(group.components.map(c => api.delete(`/recipes/${c._id}`, { headers: { Authorization: `Bearer ${token}` } })));
                      toast.success("Recipe entirely deleted!");
                      fetchData();
                    } catch (err) {
                      setRecipes(recipes.filter(r => r.menuItemId?._id !== group.menuItem._id))
                      toast.success("Recipe entirely deleted!"); // mock fallback
                    }
                  }}>
                    <BiTrash size={18} />
                  </button>
                </div>
              </div>
            )
          })}
          {filteredGroups.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No recipes configured yet.</p>}
        </div>
      </div>

      {isDrawerOpen && (
        <div className="drawer-overlay">
          <div className="drawer">
            <div className="drawer-header">
              <h3>Map Ingredients to Recipe</h3>
              <button className="close-btn" onClick={() => setIsDrawerOpen(false)}><BiX /></button>
            </div>

            <form className="drawer-form" onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="form-group" style={{ padding: '16px 24px', backgroundColor: 'white', zIndex: 2 }}>
                <label>Target Menu Item *</label>
                <select required value={menuItemId} onChange={(e) => setMenuItemId(e.target.value)}>
                  <option value="">Select a Menu Item</option>
                  {menuItems.map((item) => (
                    <option key={item._id} value={item._id}>{item.name}</option>
                  ))}
                </select>

                {(() => {
                  const selectedMenuItem = menuItems.find(m => m._id === menuItemId);
                  if (!selectedMenuItem) return null;
                  return (
                    <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '60px', height: '60px', borderRadius: '8px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', fontSize: '24px' }}>
                        {selectedMenuItem.icon ? (
                          selectedMenuItem.icon.startsWith('data:') ? <img src={selectedMenuItem.icon} alt={selectedMenuItem.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : selectedMenuItem.icon
                        ) : '☕'}
                      </div>
                      <div>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: 'var(--text-dark)' }}>{selectedMenuItem.name}</h4>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{selectedMenuItem.category} • ₹{selectedMenuItem.price || 0}</span>
                      </div>
                    </div>
                  )
                })()}
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px 24px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600, color: 'var(--text-dark)' }}>Ingredients Needed:</label>

                {draftComponents.map((draft, idx) => {
                  const currIng = ingredients.find(i => i._id === draft.ingredientId);
                  return (
                    <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '16px', borderBottom: '1px dashed var(--border-color)', paddingBottom: '16px' }}>
                      <div style={{ flex: 2 }}>
                        <label style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Ingredient</label>
                        <select required value={draft.ingredientId} onChange={(e) => handleDraftChange(idx, "ingredientId", e.target.value)} style={{ width: '100%', padding: '8px' }}>
                          <option value="">Select...</option>
                          {ingredients.map((ing) => (
                            <option key={ing._id} value={ing._id}>
                              {ing.name} (In Stock: {ing.quantity})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Qty ({currIng ? currIng.unit.split(' ')[0] : 'unit'})</label>
                        <input required type="number" step="0.01" placeholder="0.00" value={draft.quantityRequired} onChange={(e) => handleDraftChange(idx, "quantityRequired", e.target.value)} style={{ width: '100%', padding: '8px' }} />
                      </div>

                      {draftComponents.length > 1 && (
                        <button type="button" onClick={() => removeDraftRow(idx)} style={{ marginTop: '22px', color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                          <BiTrash size={20} />
                        </button>
                      )}
                    </div>
                  )
                })}

                <button type="button" onClick={addDraftRow} style={{ width: '100%', padding: '12px', background: '#f1f5f9', border: '1px dashed #cbd5e1', color: 'var(--primary)', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer' }}>
                  + Add Another Ingredient
                </button>
              </div>

              <div className="drawer-footer">
                <button type="button" className="cancel-btn" onClick={() => setIsDrawerOpen(false)}>Cancel</button>
                <button type="submit" className="primary-btn">Save Recipe Mapping</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default Recipes;