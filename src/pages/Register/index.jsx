import { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../services/firebaseConnection";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa6";
import { FaSave } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import notificationService from "../../utils/notificationService";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [isPulsing, setIsPulsing] = useState(false);
  const [isClearPulsing, setIsClearPulsing] = useState(false);

  function handleClearInputs() {
    setIsClearPulsing(true);
    setEmail("");
    setPassword("");
  }
  
  async function handleRegister(e) {
    e.preventDefault();

    setIsPulsing(true);

    if (email.trim() !== "" && password.trim() !== "") {
      await createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          notificationService.success("Successfully registered user! Welcome.");
          navigate("/admin", { replace: true })
        })
        .catch(() => {
          console.log("ERROR WHEN REGISTERING");
        });

    } else {
      notificationService.error("Please fill in all fields!");
    }
  }

  return (
    <div className="home-container animation-fade-in-downbig-1s">
      <h1 className="title-container">
        <FaUserPlus className="icon-title" /> Register
      </h1>

      <span>Let"s create your account!</span>

      <form className="form" onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Enter your email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="******"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className={isPulsing ? "animation-pulse-1s" : ""} >
          <span className="button-content">
            Register <FaSave className="icon-button" />
          </span>
        </button>

        <button type="button"
          id="clear-button-home"
          onClick={handleClearInputs}
          className={isClearPulsing ? "animation-pulse-1s" : ""}
        >
          <span className="button-content">
            Clear <FiTrash2 className="icon-button" />
          </span>
        </button>

      </form>

      <Link className="button-link" to="/">
        Already have an account? Log in!
      </Link>

    </div>
  );
}