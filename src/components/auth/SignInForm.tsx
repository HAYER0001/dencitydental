"use client";

import Link from "next/link";

export default function SignInForm() {
  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
      <div className="flex flex-col">
        <label htmlFor="signin-email" className="text-xs font-semibold text-foreground">
          Email Address
        </label>
        <input
          type="email"
          id="signin-email"
          required
          placeholder="sarah@example.com"
          className="mt-2 rounded-button border border-deep-charcoal/10 bg-background px-4 py-2.5 text-body-sm text-foreground focus:border-clinic-teal focus:outline-none focus:ring-1 focus:ring-clinic-teal dark:border-white/10"
        />
      </div>

      <div className="flex flex-col">
        <div className="flex justify-between items-center">
          <label htmlFor="signin-password" className="text-xs font-semibold text-foreground">
            Password
          </label>
          <a
            href="#forgot"
            onClick={(e) => e.preventDefault()}
            className="text-xs font-medium text-clinic-teal hover:underline dark:text-clinic-teal-soft"
          >
            Forgot password?
          </a>
        </div>
        <input
          type="password"
          id="signin-password"
          required
          placeholder="••••••••"
          className="mt-2 rounded-button border border-deep-charcoal/10 bg-background px-4 py-2.5 text-body-sm text-foreground focus:border-clinic-teal focus:outline-none focus:ring-1 focus:ring-clinic-teal dark:border-white/10"
        />
      </div>

      <div className="flex items-center justify-between pt-1">
        <label className="flex items-center gap-2 text-xs text-muted cursor-pointer">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-deep-charcoal/10 bg-background text-clinic-teal focus:ring-clinic-teal dark:border-white/10"
          />
          Remember this device
        </label>
      </div>

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center rounded-pill bg-clinic-teal px-6 py-3.5 font-semibold text-white shadow-soft transition-colors duration-[var(--duration-fast)] hover:bg-clinic-teal/90"
      >
        Sign In
      </button>
    </form>
  );
}
