import { Link } from "react-router-dom";

function Sidebar() {
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
    </div>
  );
}

export default Sidebar;