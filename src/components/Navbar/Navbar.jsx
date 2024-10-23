import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
const Navbar = ({ handleLogout, isLoggedIn }) => {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    console.log("Navbar.jsx");
  }, []);
  // const getUser = async () => {
  //   try {
  //     const response = await fetch(`${base}/user`, {
  //       method: "GET",
  //       credentials: "include",
  //     });

  //     if (!response.ok) {
  //       setError(true);
  //     } else {
  //       const data = await response.json();
  //       if (data.success) {
  //         setIsLoggedIn(true);
  //       }
  //     }
  //   } catch (error) {
  //     setError(true);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  return (
    <div className="bg-gray-800 text-white p-4">
      <h2 className="text-lg font-bold">Navbar</h2>
      <ul className="flex space-x-4 mt-2">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/project/browse">Projects</Link>
        </li>
        {isLoggedIn && (
          <li>
            <Link to="/project/create" className="hover:underline">
              Create Project
            </Link>
          </li>
        )}
        {isLoggedIn && (
          <li>
            <Link to="/profile" className="hover:underline">
              Profile
            </Link>
          </li>
        )}
        {!isLoggedIn && (
          <li>
            <Link to="/register" className="hover:underline">
              Register
            </Link>
          </li>
        )}
        {!isLoggedIn && (
          <li>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
          </li>
        )}
        {isLoggedIn && (
          <li>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-500 text-white py-1 px-3 rounded"
            >
              Logout
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Navbar;
