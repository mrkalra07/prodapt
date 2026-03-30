import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-shell__main">
        <Navbar />
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
