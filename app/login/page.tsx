import dynamic from "next/dynamic";
const LoginForm = dynamic(() => import("@/components/signin/LoginForm"), {
  ssr: false,
});
import React from "react";

const page = () => {
  return (
    <>
      <LoginForm />
    </>
  );
};

export default page;
