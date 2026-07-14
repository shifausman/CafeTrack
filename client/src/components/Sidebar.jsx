import { NavLink, useNavigate } from "react-router-dom";
import {
  BiSolidDashboard,
  BiTrendingUp,
  BiNotepad,
  BiBox,
  BiBookOpen,
  BiDollarCircle,
  BiBarChartAlt2,
  BiLogOut
} from "react-icons/bi";
import { SiCoffeescript } from "react-icons/si";
import "./Sidebar.css";

const navItems = [
  { path: "/dashboard", name: "Dashboard", icon: <BiSolidDashboard /> },
  { path: "/sales", name: "POS / Sales", icon: <BiTrendingUp /> },
  { path: "/menu", name: "Menu", icon: <BiNotepad /> },
  { path: "/ingredients", name: "Ingredients", icon: <BiBox /> },
  { path: "/recipes", name: "Recipes", icon: <BiBookOpen /> },
  { path: "/expenses", name: "Expenses", icon: <BiDollarCircle /> },
  { path: "/analytics", name: "Analytics", icon: <BiBarChartAlt2 /> },
];

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="sidebar">
      <div className="brand">
        <div className="brand-icon">
          <SiCoffeescript />
        </div>
        <div className="brand-text">
          <h2>GREEN<br />GROUNDS<br />COFFEE</h2>
        </div>
      </div>

      <nav className="nav-links">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <span className="icon">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <button className="nav-item" onClick={handleLogout} style={{ background: 'transparent', border: 'none', outline: 'none', cursor: 'pointer', width: '100%', marginTop: 'auto', textAlign: 'left', fontFamily: 'inherit', fontSize: 'inherit' }}>
        <span className="icon"><BiLogOut /></span>
        <span>Logout</span>
      </button>

    </div>
  );
}

export default Sidebar;