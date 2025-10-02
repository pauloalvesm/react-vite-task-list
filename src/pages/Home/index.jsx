import { useState } from "react";
import "./home.css";

import { Link } from "react-router-dom";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e) {
    e.preventDefault();

    if (email !== "" && password !== "") {
      alert("Test");
    } else {
      alert("Fill in all the fields!");
    }

  }

  return (
    <div className="home-container">
      <h1>Task List</h1>
      <span>Manage your schedule easily.</span>

      <form className="form" onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Enter your email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          autoComplete="off"
          type="password"
          placeholder="******"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Access</button>
      </form>

      <Link className="button-link" to="/register">
        Don't have an account? Sign up
      </Link>

    </div>
  )
}
