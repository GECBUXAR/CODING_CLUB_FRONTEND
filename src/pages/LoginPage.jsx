import React from "react";
import { NavLink, Link } from "react-router";
import Login from "../components/Login.jsx";

const LoginPage = () => {
  return (
    <>
      <div className="flex min-h-svh flex-col items-center justify-center bg-muted ">
        <div className="w-full max-w-sm md:max-w-3xl">
          <Login />
        </div>
      </div>
    </>
  );
};

export default LoginPage;
