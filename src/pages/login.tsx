import React from "react";

export const Login = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-800">
      <div className="bg-white w-full max-w-lg pt-10 pb-7 rounded-lg text-center">
        <h3 className="text-2xl text-gray-800">Log In</h3>
        <form className="grid gap-3 mt-5 px-5">
          <input placeholder="Email" className="input" />
          <input placeholder="Password" className="input" />
          <button className="btn">Log In</button>
        </form>
      </div>
    </div>
  );
};
