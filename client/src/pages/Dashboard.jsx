import { useEffect, useState } from "react";
import api from "../services/api";
import DashboardCard from "../components/DashboardCard";
import MainLayout from "../layouts/MainLayout";


function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const response = await api.get(
        "/dashboard",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!data) {
    return <h2>Loading...</h2>;
  }

  return (
    <MainLayout>
      <h1>CafeTrack Dashboard</h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        <DashboardCard
          title="Revenue"
          value={`₹${data.totalRevenue}`}
        />

        <DashboardCard
          title="Expenses"
          value={`₹${data.totalExpenses}`}
        />

        <DashboardCard
          title="Profit"
          value={`₹${data.profit}`}
        />

        <DashboardCard
          title="Sales"
          value={data.totalSales}
        />

        <DashboardCard
          title="Ingredients"
          value={data.totalIngredients}
        />

        <DashboardCard
          title="Menu Items"
          value={data.totalMenuItems}
        />

        <DashboardCard
          title="Low Stock"
          value={data.lowStockCount}
        />
      </div>
    </MainLayout>
  );
}

export default Dashboard;