import { useEffect, useState } from "react";
import api from "../services/api";
import MainLayout from "../layouts/MainLayout";

function Expenses() {
  const [expenses, setExpenses] = useState([]);

  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] =
    useState("");

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const response = await api.get(
        "/expenses",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setExpenses(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addExpense = async (e) => {
    e.preventDefault();

    try {
      const token =
        localStorage.getItem("token");

      await api.post(
        "/expenses",
        {
          category,
          amount,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCategory("");
      setAmount("");
      setDescription("");

      fetchExpenses();
    } catch (error) {
      console.log(error);
    }
  };

  const updateExpense = async (e) => {
    e.preventDefault();

    try {
      const token =
        localStorage.getItem("token");

      await api.put(
        `/expenses/${editId}`,
        {
          category,
          amount,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEditId(null);

      setCategory("");
      setAmount("");
      setDescription("");

      fetchExpenses();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteExpense = async (id) => {
    try {
      const token =
        localStorage.getItem("token");

      await api.delete(
        `/expenses/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchExpenses();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <MainLayout>
      <h1>Expenses</h1>

      <form
        onSubmit={
          editId
            ? updateExpense
            : addExpense
        }
      >
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
          placeholder="Amount"
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <button type="submit">
          {editId
            ? "Update Expense"
            : "Add Expense"}
        </button>
      </form>

      <br />

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Category</th>
            <th>Amount</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {expenses.map((expense) => (
            <tr key={expense._id}>
              <td>{expense.category}</td>
              <td>₹{expense.amount}</td>
              <td>{expense.description}</td>

              <td>
                <button
                  onClick={() => {
                    setEditId(
                      expense._id
                    );

                    setCategory(
                      expense.category
                    );

                    setAmount(
                      expense.amount
                    );

                    setDescription(
                      expense.description
                    );
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() => {
                    const confirmDelete = window.confirm(
                      "Are you sure you want to delete this expense?"
                    );

                    if (confirmDelete) {
                      deleteExpense(item._id);
                    }
                  }}
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

export default Expenses;