import Sidebar from "../components/Sidebar";

function MainLayout({ children }) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
      }}
    >
      <Sidebar />

      <div
        style={{
          padding: "20px",
          flex: 1,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default MainLayout;