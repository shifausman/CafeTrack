import { useEffect, useState } from "react";
import api from "../services/api";
import MainLayout from "../layouts/MainLayout";

function Sales() {
  const [sales, setSales] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  const [menuItemId, setMenuItemId] =
    useState("");

  const [quantitySold, setQuantitySold] =
    useState("");

  useEffect(() => {
    fetchSales();
    fetchMenuItems();
  }, []);

  const fetchSales = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const response = await api.get(
        "/sales",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSales(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const response = await api.get(
        "/menu",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMenuItems(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const createSale = async (e) => {
    e.preventDefault();

    try {
      const token =
        localStorage.getItem("token");

      await api.post(
        "/sales",
        {
          menuItemId,
          quantitySold,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMenuItemId("");
      setQuantitySold("");

      fetchSales();
    } catch (error) {
      alert(
        error.response?.data?.message
      );
    }
  };

  return (
    <MainLayout>
      <h1>Sales</h1>

      <form onSubmit={createSale}>
        <select
          value={menuItemId}
          onChange={(e) =>
            setMenuItemId(e.target.value)
          }
        >
          <option value="">
            Select Menu Item
          </option>

          {menuItems.map((item) => (
            <option
              key={item._id}
              value={item._id}
            >
              {item.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Quantity"
          value={quantitySold}
          onChange={(e) =>
            setQuantitySold(e.target.value)
          }
        />

        <button type="submit">
          Record Sale
        </button>
      </form>

      <br />

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Menu Item</th>
            <th>Quantity</th>
            <th>Total Amount</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {sales.map((sale) => (
            <tr key={sale._id}>
              <td>
                {sale.menuItemId?.name}
              </td>

              <td>
                {sale.quantitySold}
              </td>

              <td>
                ₹{sale.totalAmount}
              </td>

              <td>
                {new Date(
                  sale.createdAt
                ).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </MainLayout>
  );
}

export default Sales;