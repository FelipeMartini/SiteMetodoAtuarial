"use client";
import { CacheProvider } from "@emotion/react";

import createEmotionCache from "./cache-emotion";
const emotionCache = createEmotionCache();

export default function ProvedorCliente({ children }: { children: React.ReactNode }) {
  return <CacheProvider value={emotionCache}>{children}</CacheProvider>;
}
