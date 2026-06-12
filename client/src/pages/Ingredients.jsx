import { useEffect, useState } from "react";
import api from "../services/api";
import MainLayout from "../layouts/MainLayout";

function Ingredients() {
  const [ingredients, setIngredients] =
    useState([]);

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [minimumStock, setMinimumStock] =
    useState("");

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const response = await api.get(
        "/ingredients",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIngredients(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addIngredient = async (e) => {
    e.preventDefault();

    try {
      const token =
        localStorage.getItem("token");

      await api.post(
        "/ingredients",
        {
          name,
          quantity,
          unit,
          minimumStock,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setName("");
      setQuantity("");
      setUnit("");
      setMinimumStock("");

      fetchIngredients();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteIngredient = async (id) => {
    try {
      const token =
        localStorage.getItem("token");

      await api.delete(
        `/ingredients/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      fetchIngredients();
    } catch (error) {
      console.log(error);
    }
  };

  const updateIngredient = async (e) => {
    e.preventDefault();

    try {
      const token =
        localStorage.getItem("token");

      await api.put(
        `/ingredients/${editId}`,
        {
          name,
          quantity,
          unit,
          minimumStock,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setEditId(null);

      setName("");
      setQuantity("");
      setUnit("");
      setMinimumStock("");

      fetchIngredients();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <MainLayout>
        <h1>Ingredients</h1>

      <h2>Add Ingredient</h2>

      <form
        onSubmit={
          editId
            ? updateIngredient
            : addIngredient
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
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) =>
            setQuantity(e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Unit"
          value={unit}
          onChange={(e) =>
            setUnit(e.target.value)
          }
        />

        <input
          type="number"
          placeholder="Minimum Stock"
          value={minimumStock}
          onChange={(e) =>
            setMinimumStock(e.target.value)
          }
        />

        <button type="submit">
          {editId
            ? "Update Ingredient"
            : "Add Ingredient"}
        </button>
      </form>

      <br />

        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th>Unit</th>
              <th>Minimum Stock</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {ingredients.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.unit}</td>
                <td>{item.minimumStock}</td>
                <td>
                  <button
                    onClick={() => {
                      setEditId(item._id);
                      setName(item.name);
                      setQuantity(item.quantity);
                      setUnit(item.unit);
                      setMinimumStock(item.minimumStock);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteIngredient(item._id)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
  </MainLayout>
);
}

export default Ingredients;