import { BrowserRouter } from "react-router-dom";
import RoutesApp from "./routes";
import "./App.css";
import { ToastContainer } from "react-toastify";

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <RoutesApp />
      </BrowserRouter>
      <ToastContainer autoClose={3000} />
    </div>
  );
}
