import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div
      style={{
        width: "200px",
        padding: "20px",
        borderRight: "1px solid #ccc",
      }}
    >
      <h2>CafeTrack</h2>

      <p>
        <Link to="/dashboard">
          Dashboard
        </Link>
      </p>

      <p>
        <Link to="/ingredients">
          Ingredients
        </Link>
      </p>

      <p>
        <Link to="/menu">
          Menu
        </Link>
      </p>

      <p>
        <Link to="/expenses">
          Expenses
        </Link>
      </p>

      <p>
        <Link to="/sales">
          Sales
        </Link>
      </p>

      <p>
        <Link to="/recipes">
          Recipes
        </Link>
      </p>

      <p>
        <Link to="/analytics">
          Analytics
        </Link>
      </p>

      <button onClick={handleLogout}>
        Logout
      </button>

    </div>
  );
}

export default Sidebar;