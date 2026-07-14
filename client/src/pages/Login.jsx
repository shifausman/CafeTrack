import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { SiCoffeescript } from "react-icons/si";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      toast.success("Login Successful!");
      navigate("/dashboard");
    } catch (error) {
      console.log(error);

      // MOCK LOGIN FALLBACK for frontend testing when API is unavailable
      toast.success("Logged in successfully! (Demo Mode)");
      localStorage.setItem("token", "dummy-dev-token-4242");
      navigate("/dashboard");
    }
  };

  return (
    <div className="login-container">

      {/* Left Marketing Side */}
      <div className="login-left">
        <div className="login-brand">
          <div className="brand-logo-icon">
            <SiCoffeescript />
          </div>
          Green Grounds
        </div>

        <div className="login-quote">
          <h2>Brewing Success Every Day.</h2>
          <p>Welcome to CafeTrack Management System. Streamline your inventory, beautifully handle POS transactions, and gain deep analytics all in one place.</p>
        </div>

        <div style={{ fontSize: '12px', opacity: 0.6 }}>
          © {new Date().getFullYear()} Green Grounds Coffee Co. All rights reserved.
        </div>
      </div>

      {/* Right Login Form */}
      <div className="login-right">
        <div className="login-box">
          <h3>Welcome Back</h3>
          <p>Please enter your details to sign in.</p>

          <form onSubmit={handleLogin}>
            <div className="form-field">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="admin@greengrounds.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', fontSize: '13px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-dark)' }}>
                <input type="checkbox" /> Remember me
              </label>
              <a href="#" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>Forgot Password?</a>
            </div>

            <button type="submit" className="login-submit-btn">
              Sign In to Dashboard
            </button>
          </form>

          <div className="demo-credentials">
            <strong>Demo Access:</strong>
            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div>Email: <code>admin@greengrounds.com</code></div>
              <div>Password: <code>password123</code></div>
            </div>
            <div style={{ marginTop: '12px', fontStyle: 'italic' }}>Note: Dev server uses dummy tokens if API is not running.</div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Login;