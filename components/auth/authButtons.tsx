import React from "react";
import { FacebookIcon } from "../icons/FooterIcons";
import { GoogleIcon } from "../icons/FooterIcons";
import { signIn } from "next-auth/react";

export const FacebookRegisterButton = () => {
  return (
    <button className="flex items-center justify-evenly bg-gray-50 border border-gray-300 text-slate-600 sm:text-sm rounded-lg w-full p-2.5  ml-2">
      <p>facebook</p>
      <FacebookIcon className="w-8 h-8" />
    </button>
  );
};

export const FacebookSignInButton = () => {
  return (
    <button className="flex items-center justify-evenly bg-gray-50 border border-gray-300 text-slate-600 sm:text-sm rounded-lg w-full p-2.5  ml-2">
      <p>facebook</p>
      <FacebookIcon className="w-8 h-8" />
    </button>
  );
};

export const GoogleRegisterButton = () => {
  return (
    <button className="flex items-center justify-evenly bg-gray-50 border border-gray-300 text-slate-600 sm:text-sm rounded-lg w-full p-2.5  mr-2">
      <p>google</p>
      <GoogleIcon className="w-8 h-8" />
    </button>
  );
};

export const GoogleSignInButton = () => {
  const handleClick = () => {
    signIn("google");
  };
  return (
    <button
      className="flex items-center justify-center gap-4 bg-gray-50 border border-gray-300 text-slate-600 sm:text-sm rounded-lg w-full p-2.5  mr-2"
      onClick={handleClick}
    >
      <p>google</p>
      <GoogleIcon className="w-8 h-8" />
    </button>
  );
};
