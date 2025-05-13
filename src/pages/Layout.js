import { Link } from "react-router";

function Layout({ children }) {
  return (
    <div className="app">
      <nav className="navigation">
        <Link to="/">Tic Stack Toe</Link>
        <Link to="/manual">🫳 Manual Player</Link>
        <Link to="/auto">🤖 Auto Player</Link>
      </nav>
      <div className="body">{children}</div>
      <div className="footer" />
    </div>
  );
}

export default Layout;
