import React, { useContext, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import { useNavigate } from 'react-router-dom'
import { base } from '../../constant'
const Layout = ({setIsLoggedIn, isLoggedIn}) => {
  const navigate = useNavigate();
  const handleLogout = async (e) => {
    e.preventDefault();
    const res = await fetch(`${base}/user/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) {
      console.log('Error');
    } else {
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('user');
      setIsLoggedIn(false);
      navigate('/');
    }
  };
  return (
    <>
        <Navbar handleLogout={handleLogout} isLoggedIn={isLoggedIn}/>
        <Outlet />
    {/* <Footer /> */}
    </>
  )
}

export default Layout