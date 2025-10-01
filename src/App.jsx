import { BrowserRouter } from "react-router-dom";
import RoutesApp from "./routes";
import "./App.css";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <RoutesApp />
      </BrowserRouter>
    </>
  );
}
