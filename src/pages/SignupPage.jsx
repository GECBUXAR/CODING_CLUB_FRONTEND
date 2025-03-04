import React from "react";
import Signup from "../components/Signup";

const SignupPage = () => {
  return (
    <>
      <div className="flex min-h-svh flex-col items-center justify-center bg-muted ">
        <div className="w-full max-w-sm md:max-w-3xl py-8">
          <Signup />
        </div>
      </div>
    </>
  );
};

export default SignupPage;
