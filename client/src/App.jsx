import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Ingredients from "./pages/Ingredients";
import Menu from "./pages/Menu";


function App() {
  return (
  <BrowserRouter>
    <Routes>
      <Route
        path="/"
        element={<Login />}
      />

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      <Route
        path="/ingredients"
        element={<Ingredients />}
      />

      <Route path="/menu" element={<Menu />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;