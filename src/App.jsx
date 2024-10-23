import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthRedirectRoute from "./Auth/AuthRedirectRoute";
import AuthRedirectRoute2 from "./Auth/AuthRedirectRoute2";
import Layout from "./components/Layout/Layout";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import AllProject from "./pages/Projects/AllProjects";
import ProjectDetails from "./pages/Projects/ProjectDetails";
import "./App.css";
import CreateProject from "./pages/CreateProject";
import ForgetPassword from "./Auth/ForgetPassword";
import VerifyEmail from "./Auth/VerifyEmail";
import { base } from "./constant";
import ResetPassword from "./Auth/ResetPassword";
const App = () => {
  // const {changeLog, isLoggedIn, setIsLoggedIn} = useContext(LoggedIn)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [user, setUser] = useState({});

  useEffect(()=>{
    console.log("App.jsx");
    console.log(isLoggedIn);
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${base}/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          },
          })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setIsLoggedIn(true);
              window.localStorage.setItem('user', JSON.stringify(data.data))
              setUser(data.data);
              } else {
                setIsLoggedIn(false);
                setError(true);
                }
              })
              .catch((err) => console.log(err));
              }
              
  },[])

  // if (isLoading) {
  //   return <Loading />;
  // }

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} setUser={setUser}/>}>
        <Route index element={<Home />} />
        <Route path="/register" element={<AuthRedirectRoute isLoggedIn={isLoggedIn}>
            <Register />
          </AuthRedirectRoute>} />
        <Route path="/login" element={
          <AuthRedirectRoute isLoggedIn={isLoggedIn}>
            <Login setIsLoggedIn={setIsLoggedIn}/>
          </AuthRedirectRoute>
        } />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        {<Route path="/verify-email" element={<VerifyEmail />} />}
        <Route path="/profile" element={<AuthRedirectRoute2 isLoggedIn={isLoggedIn}>
            <Profile />
          </AuthRedirectRoute2>} />
        <Route path="/project/browse" element={<AllProject />} />
        <Route path="/project/create" element={<AuthRedirectRoute2 isLoggedIn={isLoggedIn}>
            <CreateProject />
          </AuthRedirectRoute2>} />
        <Route path="/project" element={<ProjectDetails isLoggedIn={isLoggedIn} userId={user._id}/>} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
  
  );
};
//Dark: #35374B || #393053 || #002233
//Light: #E7F6F2 || #EEEEEE || edf2fb
export default App;
