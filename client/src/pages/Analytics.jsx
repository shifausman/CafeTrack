import { useEffect, useState } from "react";
import api from "../services/api";
import MainLayout from "../layouts/MainLayout";

function Analytics() {
  const [analytics, setAnalytics] =
    useState({});

  const [topSelling, setTopSelling] =
    useState([]);

  const [ingredientReport, setIngredientReport] =
    useState([]);

  const [lowStock, setLowStock] =
    useState([]);

  useEffect(() => {
    fetchAnalytics();
    fetchTopSelling();
    fetchIngredientReport();
    fetchLowStock();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const response = await api.get(
        "/dashboard/analytics",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAnalytics(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTopSelling = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const response = await api.get(
        "/dashboard/top-items",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTopSelling(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchIngredientReport = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const response = await api.get(
        "/dashboard/ingredient-usage",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIngredientReport(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchLowStock = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const response = await api.get(
        "/ingredients/low-stock",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLowStock(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <MainLayout>
      <h1>Analytics</h1>

      <h2>Monthly Summary</h2>

      <p>
        Revenue:
        ₹{analytics.salesThisMonth || 0}
      </p>

      <p>
        Expenses:
        ₹{analytics.expensesThisMonth || 0}
      </p>

      <p>
        Profit:
        ₹{analytics.profitThisMonth || 0}
      </p>

      <hr />

      <h2>Top Selling Items</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity Sold</th>
          </tr>
        </thead>

        <tbody>
          {topSelling.map((item, index) => (
            <tr key={index}>
              <td>{item._id?.name}</td>
              <td>{item.quantitySold}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      <h2>Ingredient Usage Report</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Ingredient</th>
            <th>Total Used</th>
          </tr>
        </thead>

        <tbody>
          {Object.entries(
            ingredientReport
          ).map(([name, used]) => (
            <tr key={name}>
              <td>{name}</td>
              <td>{used}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      <h2>Low Stock Items</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Current Stock</th>
            <th>Minimum Stock</th>
          </tr>
        </thead>

        <tbody>
          {lowStock.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>

              <td>{item.quantity}</td>

              <td>{item.minimumStock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </MainLayout>
  );
}

export default Analytics;