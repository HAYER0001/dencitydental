"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

/**
 * The admin dashboard is Firebase- and browser-only. It must never be
 * server-rendered or statically prerendered: evaluating the Firebase Auth
 * module on the server (where the runtime API key is absent) throws
 * `auth/invalid-api-key` and fails the Vercel build.
 *
 * `ssr: false` — the documented Next.js mechanism for a browser-only Client
 * Component — guarantees the dashboard and its Firebase imports load exclusively
 * in the browser. (Route Segment Config like `export const dynamic` cannot live
 * in a Client Component, so this is the correct way to bypass SSR here.)
 */
const AdminDashboard = dynamic(() => import("./AdminDashboard"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center bg-deep-charcoal">
      <Loader2 className="h-8 w-8 animate-spin text-clinic-teal" />
    </div>
  ),
});

export default function AdminPage() {
  return <AdminDashboard />;
}
