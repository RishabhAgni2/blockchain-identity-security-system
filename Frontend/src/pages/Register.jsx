import { useState } from "react";
import API from "../services/api";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    await API.post("/auth/register", { email, password });
    alert("Registered successfully. Please login.");
  };

  return (
    <div>
      <h2>Register</h2>
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={submit}>Register</button>
    </div>
  );
}
