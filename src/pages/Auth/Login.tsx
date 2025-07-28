import React, { useState } from "react";
import "./../../styles/login.css";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import {googleAuth} from "./api.jsx"

type LoginProps = {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
};

const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const token = localStorage.getItem("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Logging in...");

    try {
      const response = await fetch("http://localhost:5001/login", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.token) {
        setMessage("✅ Login successful!");
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        setIsAuthenticated(true);
        const user = result.user;
        if (user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        setMessage(result.error || "❌ Invalid credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage("⚠️ Something went wrong. Please try again.");
    }
  };
const responseFromGoogle = async(authResult : any)=>{
  try {
    // console.log('Result :' ,authResult);
    if(authResult['code']){
     const result = await googleAuth(authResult['code']);
    //  const {email,name,image,role} = result.data.user;
     const {token} = result.data;
    //  console.log("result",result,"token",token);
     setMessage("✅ Login successful!");
        localStorage.setItem("token",token);
        localStorage.setItem("user", JSON.stringify(result.data.user));
        setIsAuthenticated(true);
        const user = result.data.user;
        if (user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        setMessage("❌ Invalid credentials.");
      }
    
  } catch (error) {
    console.log(`Error thrown : ${error}`);
  }
}
    const googleLogin = useGoogleLogin(
      {onSuccess : responseFromGoogle,
        onError : responseFromGoogle,
        flow: 'auth-code'}
    );
  return (
    <div className="auth-container">
      <h2 className="auth-title">Login</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            required
            onChange={handleChange}
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            required
            onChange={handleChange}
            placeholder="Enter your password"
          />
        </div>
        <button id="google" onClick={googleLogin} type="button">
       <img
          id="google-icon"
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google icon"
       />
       
         Login with Google
        </button>
        <button type="submit" className="auth-button">Login</button>

        {message && <p className="auth-message">{message}</p>}
      </form>
    </div>
  );
};

export default Login;
