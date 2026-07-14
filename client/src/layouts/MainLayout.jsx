import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function MainLayout({ children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--bg-color)" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
        <Navbar />
        <main style={{ flex: 1, overflowY: "auto", padding: "12px 32px 32px" }}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;