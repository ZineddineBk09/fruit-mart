import { checkSessionServer } from "@/lib/auth";
import React from "react";

export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await checkSessionServer();
  return <>{children}</>;
}
