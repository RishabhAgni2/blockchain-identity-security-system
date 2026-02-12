import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Verify from "./pages/Verify";

function App() {
  const [auth, setAuth] = useState(!!localStorage.getItem("token"));

  if (!auth) {
    return (
      <>
        <Login setAuth={setAuth} />
        <Register />
      </>
    );
  }

  return (
    <>
      <Dashboard />
      <Verify />
    </>
  );
}

export default App;
