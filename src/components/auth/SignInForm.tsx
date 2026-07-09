"use client";

import { Suspense, useEffect, useState, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { AlertTriangle, Loader2 } from "lucide-react";

import { auth } from "@/lib/firebase";
import Magnetic from "@/components/ui/Magnetic";

/** Firebase error codes are never surfaced verbatim — always a curated message. */
function messageForCode(code: string | undefined): string {
  if (code?.startsWith("auth/api-key-not-valid")) {
    return "Unable to authenticate. Please verify credentials.";
  }
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Unable to authenticate. Please verify credentials.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact support.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    default:
      return "Unable to authenticate. Please verify credentials.";
  }
}

/** Only permit same-origin relative paths — guards against open-redirect abuse. */
function safeRedirect(param: string | null): string {
  if (param && param.startsWith("/") && !param.startsWith("//")) return param;
  return "/admin";
}

type FieldProps = {
  id: string;
  label: string;
  type: string;
  value: string;
  onValueChange: (value: string) => void;
  autoComplete?: string;
  placeholder?: string;
  rightSlot?: ReactNode;
};

/** Minimalist field: no box, no browser chrome — just a bottom hairline that
 *  blooms into a spring-driven teal glow on focus. */
function Field({ id, label, type, value, onValueChange, autoComplete, placeholder, rightSlot }: FieldProps) {
  const reduceMotion = useReducedMotion();
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-eyebrow text-muted">
          {label}
        </label>
        {rightSlot}
      </div>
      <div className="relative mt-1">
        <input
          id={id}
          type={type}
          required
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="w-full appearance-none border-0 bg-transparent px-0 py-2.5 text-body-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-0"
        />
        {/* Resting hairline */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-deep-charcoal/15 dark:bg-white/15"
        />
        {/* Focus glow underline */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-left bg-clinic-teal shadow-[0_1px_12px_rgba(10,92,92,0.6)] dark:bg-clinic-teal-soft"
          initial={false}
          animate={{ scaleX: focused ? 1 : 0, opacity: focused ? 1 : 0 }}
          transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 30 }}
        />
      </div>
    </div>
  );
}

function SignInFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reduceMotion = useReducedMotion();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Auto-dismiss the toast (setState lives in a timer callback, not the effect body).
  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(null), 5000);
    return () => clearTimeout(t);
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // Keep the spinner through the navigation to the authenticated area.
      router.push(safeRedirect(searchParams.get("redirect")));
    } catch (err) {
      const code = err instanceof FirebaseError ? err.code : undefined;
      console.error("Sign-in failed:", code ?? err);
      setError(messageForCode(code));
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Point 4: physics-driven toast, fixed to the top — never jolts the layout. */}
      <AnimatePresence>
        {error && (
          <motion.div
            key="signin-toast"
            role="alert"
            initial={reduceMotion ? { opacity: 0, x: "-50%" } : { opacity: 0, y: -80, x: "-50%", scale: 0.96 }}
            animate={reduceMotion ? { opacity: 1, x: "-50%" } : { opacity: 1, y: 0, x: "-50%", scale: 1 }}
            exit={reduceMotion ? { opacity: 0, x: "-50%" } : { opacity: 0, y: -80, x: "-50%", scale: 0.96 }}
            transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 360, damping: 28 }}
            className="fixed left-1/2 top-6 z-50 flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-button border border-red-500/30 bg-red-500/10 px-5 py-3 text-body-sm font-medium text-red-600 shadow-lifted backdrop-blur-xl dark:text-red-300"
          >
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <Field
          id="signin-email"
          label="Email Address"
          type="email"
          autoComplete="email"
          placeholder="sarah@example.com"
          value={email}
          onValueChange={(v) => {
            setEmail(v);
            if (error) setError(null);
          }}
        />

        <Field
          id="signin-password"
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onValueChange={(v) => {
            setPassword(v);
            if (error) setError(null);
          }}
          rightSlot={
            <a
              href="#forgot"
              onClick={(e) => e.preventDefault()}
              className="text-xs font-medium text-clinic-teal hover:underline dark:text-clinic-teal-soft"
            >
              Forgot password?
            </a>
          }
        />

        <label className="flex items-center gap-2 text-xs text-muted cursor-pointer select-none">
          <input
            type="checkbox"
            className="h-4 w-4 appearance-none rounded-none border border-deep-charcoal/20 bg-transparent checked:border-clinic-teal checked:bg-clinic-teal focus:outline-none focus:ring-1 focus:ring-clinic-teal dark:border-white/20"
          />
          Remember this device
        </label>

        <Magnetic className="block w-full" strength={0.12} glow>
          <motion.button
            type="submit"
            disabled={submitting}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 24 }}
            className="inline-flex w-full items-center justify-center gap-2 rounded-pill bg-clinic-teal px-6 py-3.5 font-semibold text-white transition-colors duration-[var(--duration-fast)] hover:bg-clinic-teal/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in…
              </>
            ) : (
              "Sign In"
            )}
          </motion.button>
        </Magnetic>
      </form>
    </>
  );
}

export default function SignInForm() {
  // useSearchParams requires a Suspense boundary during prerender.
  return (
    <Suspense fallback={<div className="h-72" aria-hidden="true" />}>
      <SignInFormContent />
    </Suspense>
  );
}
