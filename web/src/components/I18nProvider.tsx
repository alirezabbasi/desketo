"use client";

import { useEffect, useState } from "react";
import i18n, { initI18n } from "../i18n";

export default function I18nProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initI18n().then(() => {
      setIsInitialized(true);
    });
  }, []);

  // Render children only after i18n is initialized
  return isInitialized ? <>{children}</> : null;
}

// Export a function to get the current language (for use in server components)
export function getI18nLanguage(): string {
  return i18n.language || "en";
}