import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/login/LoginPage";
import AdminPage from "./pages/admin/AdminPage";
import RequestAccountPage from "./pages/requestaccount/RequestAccountPage";
import ApsCallback from "./pages/ApsCallback";
import ProtectedRoute from "./components/ProtectedRoute";
import EstateTeamPage from "./pages/estateteam/EstateTeamPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<ApsCallback />} />
      <Route path="/request-account" element={<RequestAccountPage />} />
      <Route path="/estateteam/EstateTeamPage" element={<EstateTeamPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;