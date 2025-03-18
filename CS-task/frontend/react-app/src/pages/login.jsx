import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css"; 

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } else {
      alert(data.message || "Login failed");
    }
  };

  return (
    <section>
      <div className="main-form">
        <form onSubmit={handleLogin}>
          <h2>Admin Login</h2>

          <div className="input1">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Email</label>
          </div>

          <div className="input1">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Password</label>
          </div>

          {/* <div className="forgot">
            <label>
              <a href="#">Forgot password?</a>
            </label>
          </div> */}

          <button type="submit">Login</button>

          
        </form>
      </div>
    </section>
  );
}

export default Login;
