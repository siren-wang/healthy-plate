import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import LoginPage from "./LoginPage";
import ContactPage from "./ContactPage";
import HealthyPlate from "./HealthyPlate";
import Header from "./components/Header";
import { useContext } from "react";

const theme = createTheme({
  palette: {
    primary: { main: "#67439c" },
    secondary: { main: "#ffffff" },
  },
});

function AppRoutes() {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <HealthyPlate /> : <Navigate to="/login" replace />}
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/contact" element={<ContactPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Header />
            <main style={{ flex: 1 }}>
              <AppRoutes />
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
