"use client"
import { useFlag } from "@unleash/nextjs/client";

interface FeatureFlagStatusProps {
  flag: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function FeatureFlagStatus({ flag, children, fallback = null }: FeatureFlagStatusProps) {
  const isEnabled = useFlag(flag);
  if (!isEnabled) return <>{fallback}</>;
  return <>{children}</>;
}
