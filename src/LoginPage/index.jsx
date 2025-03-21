import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Typography,
  Box,
  Alert,
  Snackbar
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import api from "../api";

export default function LoginPage() {
  const { login, logout } = useContext(AuthContext);
  const [mode, setMode] = useState("login"); // 'login' or 'register'
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); // only for register
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "login") {
        const res = await api.post("/login", {
          username,
          password,
        });
        const token = res.data.token;
        login(token);
        setSuccess(true);
        setMessage("Login successful.");
        navigate("/");
      } else {
        await api.post("/register", {
          username,
          email,
          password,
        });
  
        // 注册成功先提示
        setSuccess(true);
        setMessage("Registration successful. You will be logged in shortly...");
  
        // 延迟执行登录
        setTimeout(async () => {
          try {
            const res = await api.post("/login", {
              username,
              password,
            });
            const token = res.data.token;
            login(token);
            setMessage("Auto login successful.");
            navigate("/");
          } catch (loginErr) {
            setSuccess(false);
            const errMsg = loginErr.response?.data?.message || "Auto login failed";
            setMessage(errMsg);
          }
        }, 1000); 
        setMode("login"); 
      }
    } catch (err) {
      setSuccess(false);
      const errMsg = err.response?.data?.message || "Request failed";
      setMessage(errMsg);
    }
  };
  

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("session_token");
      if (!token) return;
      await api.post("/logout", null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      logout(); // 清除 context
      setSuccess(true);
      setMessage("Logged out successfully.");
    } catch (err) {
      setSuccess(false);
      setMessage("Logout failed.");
    }
  };

  return (
    <Box sx={styles.wrapper}>
      <Card sx={styles.card}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom sx={styles.title}>
            {mode === "login" ? "Login" : "Register"}
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            {mode === "register" && (
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            )}
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {mode === "login" && (
              <Box sx={styles.optionsRow}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                    />
                  }
                  label="Remember me"
                />
              </Box>
            )}

            <Button type="submit" variant="contained" color="primary" fullWidth>
              {mode === "login" ? "Sign In" : "Register"}
            </Button>

            <Box mt={2} textAlign="center">
              <Typography variant="body2">
                {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
                <Button onClick={() => setMode(mode === "login" ? "register" : "login")} size="small">
                  {mode === "login" ? "Register" : "Back to Login"}
                </Button>
              </Typography>
            </Box>

            <Box mt={2} textAlign="center">
              <Button variant="text" color="secondary" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>

      <Snackbar
        open={!!message}
        autoHideDuration={4000}
        onClose={() => setMessage("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={success ? "success" : "error"}
          onClose={() => setMessage("")}
          variant="filled"
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f2f5",
    padding: "2rem",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    padding: "1rem",
  },
  title: {
    textAlign: "center",
    fontWeight: "bold",
  },
  optionsRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "1rem 0",
  },
};
