import { BrowserRouter, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import AppRoutes from "./routes/AppRoutes";

function AppLayout() {
  const location = useLocation();

  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />

      {hideLayout ? (
        <AppRoutes />
      ) : (
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1">
              <AppRoutes />
            </main>
          </div>
        </div>
      )}
    </>
  );
}

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;