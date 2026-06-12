import { useEffect, useState } from "react";
import api from "../services/api";
import MainLayout from "../layouts/MainLayout";

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [ingredients, setIngredients] =
    useState([]);

  const [menuItemId, setMenuItemId] =
    useState("");

  const [ingredientId, setIngredientId] =
    useState("");

  const [
    quantityRequired,
    setQuantityRequired,
  ] = useState("");

  useEffect(() => {
    fetchRecipes();
    fetchMenuItems();
    fetchIngredients();
  }, []);

  const fetchRecipes = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const response = await api.get(
        "/recipes",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRecipes(response.data);
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
  
  const addRecipe = async (e) => {
    e.preventDefault();

    try {
      const token =
        localStorage.getItem("token");

      await api.post(
        "/recipes",
        {
          menuItemId,
          ingredientId,
          quantityRequired,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMenuItemId("");
      setIngredientId("");
      setQuantityRequired("");

      fetchRecipes();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteRecipe = async (id) => {
    try {
      const token =
        localStorage.getItem("token");

      await api.delete(
        `/recipes/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchRecipes();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <MainLayout>
      <h1>Recipes</h1>

      <form onSubmit={addRecipe}>
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

        <select
          value={ingredientId}
          onChange={(e) =>
            setIngredientId(e.target.value)
          }
        >
          <option value="">
            Select Ingredient
          </option>

          {ingredients.map(
            (ingredient) => (
              <option
                key={ingredient._id}
                value={ingredient._id}
              >
                {ingredient.name}
              </option>
            )
          )}
        </select>

        <input
          type="number"
          placeholder="Quantity Required"
          value={quantityRequired}
          onChange={(e) =>
            setQuantityRequired(
              e.target.value
            )
          }
        />

        <button type="submit">
          Add Recipe
        </button>
      </form>

      <br />

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Menu Item</th>
            <th>Ingredient</th>
            <th>Quantity Required</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {recipes.map((recipe) => (
            <tr key={recipe._id}>
              <td>
                {recipe.menuItemId?.name}
              </td>

              <td>
                {recipe.ingredientId?.name}
              </td>

              <td>
                {recipe.quantityRequired}
                {" "}
                {
                  recipe.ingredientId?.unit
                }
              </td>

              <td>
                <button
                  onClick={() =>
                    deleteRecipe(
                      recipe._id
                    )
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

export default Recipes;