import { checkNotSessionServer } from "@/lib/auth";
import React from "react";

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await checkNotSessionServer();
  return <>{children}</>;
}
