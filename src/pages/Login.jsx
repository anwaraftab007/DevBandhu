import React, { useState, useContext, useEffect } from "react";
import { base } from "../constant";
import { useNavigate, Link } from "react-router-dom";

const Login = ({setIsLoggedIn}) => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${base}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        window.localStorage.setItem('token',data.data.accessToken)
        setIsLoggedIn(true)
        setMessage(data.message);
      } else {
        setMessage("Login failed..");
      }
    } catch (error) {
      console.log(error);
      setMessage("Login Failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={credentials.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
      <Link to={"/reset-password"}>
        <p>Forgot Password?</p>
      </Link>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
