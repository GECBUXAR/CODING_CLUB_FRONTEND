import React from "react";
import { NavLink, Link } from "react-router";
import Login from "../components/Login.jsx";

const LoginPage = () => {
  return (
    <>
      <div className="h-dvh flex justify-center items-center">
        <Login />
      </div>
    </>
  );
};

export default LoginPage;
