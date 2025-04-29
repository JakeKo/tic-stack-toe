import { Link } from "react-router";
import "./App.css";

function App() {
  return (
    <div>
      <Link to="/auto">
        <h1>Auto Player</h1>
      </Link>
      <Link to="/manual">
        <h1>Manual Player</h1>
      </Link>
    </div>
  );
}

export default App;
