import { Link } from "react-router";

function Navigation() {
  return (
    <nav className="navigation">
      <Link to="/">Tic Stack Toe</Link>
      <Link to="/manual">Manual Player</Link>
      <Link to="/auto">Auto Player</Link>
    </nav>
  );
}

export default Navigation;
