import { useEffect, useState } from "react";
import api from "../services/api";
import MainLayout from "../layouts/MainLayout";

function Menu() {
  const [menuItems, setMenuItems] = useState([]);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchMenuItems();
  }, []);

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

  const addMenuItem = async (e) => {
    e.preventDefault();

    try {
      const token =
        localStorage.getItem("token");

      await api.post(
        "/menu",
        {
          name,
          category,
          price,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setName("");
      setCategory("");
      setPrice("");

      fetchMenuItems();
    } catch (error) {
      console.log(error);
    }
  };

  const updateMenuItem = async (e) => {
    e.preventDefault();

    try {
      const token =
        localStorage.getItem("token");

      await api.put(
        `/menu/${editId}`,
        {
          name,
          category,
          price,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEditId(null);

      setName("");
      setCategory("");
      setPrice("");

      fetchMenuItems();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteMenuItem = async (id) => {
    try {
      const token =
        localStorage.getItem("token");

      await api.delete(
        `/menu/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      fetchMenuItems();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <MainLayout>
      <h1>Menu Management</h1>

      <form
        onSubmit={
          editId
            ? updateMenuItem
            : addMenuItem
        }
      >
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) =>
            setPrice(e.target.value)
          }
        />

        <button type="submit">
          {editId
            ? "Update Menu Item"
            : "Add Menu Item"}
        </button>
      </form>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Available</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {menuItems.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>₹{item.price}</td>
              <td>
                {item.isAvailable
                  ? "Yes"
                  : "No"}
              </td>

              <td>
                <button
                  onClick={() => {
                    setEditId(item._id);
                    setName(item.name);
                    setCategory(item.category);
                    setPrice(item.price);
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    deleteMenuItem(item._id)
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />
    </MainLayout>
  );
}

export default Menu;