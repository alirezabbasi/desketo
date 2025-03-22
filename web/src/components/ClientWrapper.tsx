"use client";

import { useBootstrap } from "../hooks/useBootstrap";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  useBootstrap(); // Load Bootstrap JS on the client side
  return <>{children}</>;
}