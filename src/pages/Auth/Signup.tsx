import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../../styles/login.css"; // Shared style for login & signup
import { useGoogleLogin } from "@react-oauth/google";
import {googleAuth} from "./api.jsx"
const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Sending...");

    try {
      const response = await fetch("http://localhost:5001/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("✅ Signup successful!");
        navigate("/login");
      } else {
        setMessage(result.message || "Signup failed.");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      setMessage("Something went wrong. Try again.");
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
          // setIsAuthenticated(true);
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
      <h2 className="auth-title">Sign Up</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="Enter your name" />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="Enter your email" />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" name="password" required value={formData.password} onChange={handleChange} placeholder="Enter your password" />
        </div>
        <button id="google" onClick={googleLogin}>
       <img
          id="google-icon"
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google icon"
       />
         Signup with Google
        </button>
        <button type="submit" className="auth-button">Sign Up</button>
        {message && <p className="auth-message">{message}</p>}
      </form>
    </div>
  );
};

export default Signup;
