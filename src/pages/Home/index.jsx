import { useState } from "react";
import "./home.css";

import { Link } from "react-router-dom";

import { auth } from "../../services/firebaseConnection";
import { signInWithEmailAndPassword } from "firebase/auth";

import { useNavigate } from "react-router-dom";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPulsing, setIsPulsing] = useState(false);

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    setTimeout(async () => {

      setIsPulsing(true);

      if (email !== "" && password !== "") {

        await signInWithEmailAndPassword(auth, email, password)
          .then(() => {
            navigate("/admin", { replace: true })
          })
          .catch(() => {
            console.log("ERROR WHILE LOGGING IN")
          })

      } else {
        alert("Please fill in all fields!")
      }

      setTimeout(() => {
        setIsPulsing(false);
      }, 1000);

    }, 1000);

  }

  return (
    <div className="home-container animation-fade-in-downbig-1s">
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

        <button
          type="submit"
          className={isPulsing ? 'animation-pulse-1s' : ''}
        >
          Access
        </button>

      </form>

      <Link className="button-link" to="/register">
        Don"t have an account? Sign up
      </Link>

    </div>
  )
}
