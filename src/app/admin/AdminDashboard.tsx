"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Loader2,
  Check,
  X,
  LogOut,
  LayoutDashboard,
  CheckCircle2,
  AlertTriangle,
  ServerCrash,
  RefreshCw,
} from "lucide-react";
import { auth, db } from "@/lib/firebase";

type Appointment = {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  service: string;
  status: "pending" | "approved" | "denied";
  createdAt: string;
};

type ToastKind = "success" | "error";
type Toast = { id: number; kind: ToastKind; message: string };
type Processing = { id: string; action: "approved" | "denied" } | null;

/** Pulsing dark skeleton mirroring the appointment card layout. */
function SkeletonCard() {
  return (
    <div className="flex flex-col justify-between rounded-card border border-white/10 bg-white/5 p-6 backdrop-blur-md">
      <div className="animate-pulse">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2.5">
            <div className="h-5 w-2/3 rounded-button bg-white/15" />
            <div className="h-4 w-1/2 rounded-button bg-white/10" />
            <div className="h-3 w-2/5 rounded-button bg-white/10" />
          </div>
          <div className="h-6 w-20 rounded-pill bg-white/10" />
        </div>
        <div className="space-y-2">
          <div className="h-12 rounded-button bg-white/5" />
          <div className="h-12 rounded-button bg-white/5" />
        </div>
      </div>
      <div className="mt-6 flex gap-3">
        <div className="h-10 flex-1 rounded-button bg-white/10 animate-pulse" />
        <div className="h-10 flex-1 rounded-button bg-white/5 animate-pulse" />
      </div>
    </div>
  );
}

const SIGN_IN_PATH = "/sign-in?redirect=/admin";

export default function AdminDashboard() {
  const reduceMotion = useReducedMotion();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<Processing>(null);

  // Data-fetch lifecycle
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [retryNonce, setRetryNonce] = useState(0);

  const failFetch = useCallback((message: string) => {
    setFetchError(message);
    setAppointmentsLoading(false);
  }, []);

  // Toast queue
  const [toasts, setToasts] = useState<Toast[]>([]);
  const pushToast = useCallback((kind: ToastKind, message: string) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, kind, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3800);
  }, []);

  useEffect(() => {
    // Firebase Auth is browser-only. This dashboard is loaded with `ssr: false`,
    // but guard explicitly so the Auth subscription never runs during SSR.
    if (typeof window === "undefined" || !auth) return;

    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      },
      (error) => {
        console.error("Auth state error:", error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Not authenticated → send them to the sign-in page (which returns here on success).
  useEffect(() => {
    if (!loading && !user) {
      router.replace(SIGN_IN_PATH);
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;

    // `appointmentsLoading` starts true and is re-armed by handleRetry; the
    // snapshot success/error callbacks below own the state from here on.
    let unsubscribe = () => {};
    try {
      const q = query(collection(db, "appointments"), orderBy("createdAt", "desc"));
      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const appts: Appointment[] = [];
          snapshot.forEach((doc) => {
            appts.push({ id: doc.id, ...doc.data() } as Appointment);
          });
          setAppointments(appts);
          setFetchError(null);
          setAppointmentsLoading(false);
        },
        (error) => {
          console.error("Firestore subscription failed:", error);
          // Missing/expired permissions → bounce to sign-in elegantly.
          if (error?.code === "permission-denied" || error?.code === "unauthenticated") {
            router.replace(SIGN_IN_PATH);
            return;
          }
          failFetch(
            error?.message || "We couldn't reach the appointments database. Check your connection and try again."
          );
        }
      );
    } catch (error) {
      console.error("Failed to initialize appointments query:", error);
      // Synchronous Firestore init failure (bad query/config) is a rare error
      // path — surfacing it immediately is intended, cascading render is harmless.
      failFetch(error instanceof Error ? error.message : "Failed to initialize the data connection.");
    }

    return () => unsubscribe();
  }, [user, retryNonce, failFetch, router]);

  const handleRetry = () => {
    setFetchError(null);
    setAppointmentsLoading(true);
    setRetryNonce((n) => n + 1);
  };

  const handleStatusUpdate = async (id: string, status: "approved" | "denied") => {
    if (processing) return; // guard against overlapping requests
    setProcessing({ id, action: status });
    try {
      const res = await fetch(`/api/appointments/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (!res.ok) {
        throw new Error(`Request failed (${res.status})`);
      }

      pushToast("success", status === "approved" ? "Appointment approved." : "Appointment denied.");
    } catch (error) {
      console.error("Status update failed:", error);
      pushToast("error", "Could not update the appointment. Please try again.");
    } finally {
      setProcessing(null);
    }
  };

  // Toast overlay — rendered on every authenticated view.
  const ToastViewport = (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex w-full max-w-xs flex-col items-end gap-3">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 48, scale: 0.96 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, x: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 48, scale: 0.96 }}
            transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 30 }}
            className={`pointer-events-auto flex w-full items-center gap-3 rounded-button border px-4 py-3 text-sm font-medium text-white backdrop-blur-xl ${
              t.kind === "success"
                ? "border-clinic-teal/40 bg-clinic-teal/20"
                : "border-red-500/40 bg-red-500/20"
            }`}
          >
            {t.kind === "success" ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-clinic-teal-soft" />
            ) : (
              <AlertTriangle className="h-5 w-5 shrink-0 text-red-300" />
            )}
            <span className="leading-snug">{t.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-deep-charcoal">
        <Loader2 className="h-8 w-8 animate-spin text-clinic-teal" />
      </div>
    );
  }

  // Unauthenticated: the effect above is redirecting to /sign-in — show a calm
  // hand-off state rather than a flash of the dashboard or an inline form.
  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-deep-charcoal text-center">
        <Loader2 className="h-8 w-8 animate-spin text-clinic-teal" />
        <p className="text-sm text-white/60">Redirecting to sign in…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-8">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-card border border-white/10 bg-white/5 p-6 backdrop-blur-md">
        <div className="flex items-center gap-4 text-white">
          <div className="rounded-full bg-clinic-teal/20 p-3">
            <LayoutDashboard className="h-6 w-6 text-clinic-teal-soft" />
          </div>
          <div>
            <h1 className="text-heading-3">Dashboard</h1>
            <p className="text-sm text-white/60">Manage your clinic appointments</p>
          </div>
        </div>
        <button
          onClick={() => signOut(auth)}
          className="flex items-center gap-2 rounded-pill border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10 active:bg-white/10 transition-colors"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </header>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {fetchError ? (
          <div className="col-span-full flex flex-col items-center justify-center gap-5 rounded-card border border-red-500/20 bg-red-500/5 p-16 text-center backdrop-blur-sm">
            <div className="rounded-full bg-red-500/10 p-4">
              <ServerCrash className="h-8 w-8 text-red-300" />
            </div>
            <div>
              <h3 className="text-heading-3 text-white">Couldn&apos;t load appointments</h3>
              <p className="mt-2 max-w-md text-sm text-white/60">{fetchError}</p>
            </div>
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 rounded-pill border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10 active:bg-white/10 transition-colors"
            >
              <RefreshCw className="h-4 w-4" /> Try again
            </button>
          </div>
        ) : appointmentsLoading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        ) : appointments.length === 0 ? (
          <div className="col-span-full rounded-card border border-white/10 bg-white/5 p-16 text-center text-white/70 backdrop-blur-sm">
            No appointments found.
          </div>
        ) : (
          appointments.map((appt) => {
            const isProcessing = processing?.id === appt.id;
            return (
              <div
                key={appt.id}
                className="group flex flex-col justify-between rounded-card border border-white/10 bg-white/5 p-6 backdrop-blur-md hover:bg-white/10 active:bg-white/10 transition-all duration-300"
              >
                <div>
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div className="overflow-hidden">
                      <h3 className="font-medium text-white text-lg truncate">{appt.name}</h3>
                      <a href={`mailto:${appt.email}`} className="text-sm text-clinic-teal-soft hover:underline active:underline truncate block">{appt.email}</a>
                      {appt.phone && <a href={`tel:${appt.phone}`} className="text-sm text-white/50 hover:text-white/80 active:text-white/80 transition-colors block mt-1">{appt.phone}</a>}
                    </div>
                    <span className={`shrink-0 rounded-pill px-3 py-1 text-xs font-semibold capitalize border ${
                      appt.status === "pending" ? "bg-yellow-500/10 text-yellow-300 border-yellow-500/20" :
                      appt.status === "approved" ? "bg-green-500/10 text-green-300 border-green-500/20" :
                      "bg-red-500/10 text-red-300 border-red-500/20"
                    }`}>
                      {appt.status}
                    </span>
                  </div>

                  <div className="mb-6 space-y-2 text-sm text-white/80">
                    <div className="flex justify-between rounded-button bg-black/20 px-4 py-3">
                      <span className="text-white/50">Service</span>
                      <span className="font-medium text-white text-right">{appt.service}</span>
                    </div>
                    <div className="flex justify-between rounded-button bg-black/20 px-4 py-3">
                      <span className="text-white/50">Date</span>
                      <span className="font-medium text-white text-right">{appt.date}</span>
                    </div>
                  </div>
                </div>

                {appt.status === "pending" && (
                  <div className="flex gap-3 mt-auto">
                    <button
                      onClick={() => handleStatusUpdate(appt.id, "approved")}
                      disabled={isProcessing}
                      className="flex flex-1 items-center justify-center gap-2 rounded-button bg-clinic-teal px-4 py-2.5 text-sm font-medium text-white hover:bg-clinic-teal-soft active:bg-clinic-teal-soft transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isProcessing && processing?.action === "approved" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(appt.id, "denied")}
                      disabled={isProcessing}
                      className="flex flex-1 items-center justify-center gap-2 rounded-button border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 active:bg-white/10 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isProcessing && processing?.action === "denied" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                      Deny
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {ToastViewport}
    </div>
  );
}
