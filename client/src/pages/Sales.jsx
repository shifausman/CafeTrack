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

  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchSales();
    fetchMenuItems();
  }, [status]);

  const fetchSales = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const response = await api.get(
         `/sales?status=${status}`,
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

  const cancelSale = async (id) => {
  try {
    const token = localStorage.getItem("token");

    await api.put(
      `/sales/${id}/cancel`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchSales();
  } catch (error) {
    console.log(error);
  }
};

const revertSale = async (id) => {
  try {
    const token = localStorage.getItem("token");

    await api.put(
      `/sales/${id}/revert`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchSales();
  } catch (error) {
    console.log(error);
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
      
      <div style={{ marginBottom: "20px" }}>
        <label>Status: </label>

        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
        >
          <option value="">All</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Reverted">Reverted</option>
        </select>
      </div>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Menu Item</th>
            <th>Quantity</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Actions</th>
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

              <td>{sale.status}</td>

              <td>
                {sale.status === "Completed" && (
                  <>
                    <button
                      onClick={() => {
                        const confirmCancel =
                          window.confirm(
                            "Cancel this sale? Ingredients will NOT be restored."
                          );

                        if (confirmCancel) {
                          cancelSale(sale._id);
                        }
                      }}
                    >
                      Cancel
                    </button>

                    <button
                      onClick={() => {
                        const confirmRevert =
                          window.confirm(
                            "Revert this sale? All ingredients will be restored."
                          );

                        if (confirmRevert) {
                          revertSale(sale._id);
                        }
                      }}
                    >
                      Revert
                    </button>
                  </>
                )}
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