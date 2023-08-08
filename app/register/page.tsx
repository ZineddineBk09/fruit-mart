import dynamic from "next/dynamic";
const RegisterForm = dynamic(
  () => import("@/components/register/RegisterForm"),
  {
    ssr: false,
  }
);
import React from "react";

const Page = () => {
  return (
    <>
      <RegisterForm />
    </>
  );
};

export default Page;
