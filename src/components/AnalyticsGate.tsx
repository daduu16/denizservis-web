"use client";

import dynamic from "next/dynamic";
import { analyticsId } from "../lib/analytics";

const ConsentAnalytics = dynamic(() => import("./Analytics").then((module) => module.Analytics), { ssr: false });

export function AnalyticsGate() {
  return analyticsId ? <ConsentAnalytics /> : null;
}
