import type { Metadata } from "next";
import Link from "next/link";

import Container from "@/components/layout/Container";
import SignInForm from "@/components/auth/SignInForm";

export const metadata: Metadata = {
  title: "Patient Portal Login",
  description: "Sign in to the DENCITY Dental Care patient portal to manage your appointments, view dental history, and access invoices.",
};

export default function SignInPage() {
  return (
    <section className="relative flex-1 py-section-sm flex flex-col justify-center">
      {/* Background highlight */}
      <div aria-hidden="true" className="absolute top-1/2 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-clinic-teal/5 blur-3xl pointer-events-none" />

      <Container className="flex justify-center">
        <div className="w-full max-w-md rounded-card border border-deep-charcoal/5 bg-background p-8 shadow-soft dark:border-white/10 sm:p-10">
          <div className="text-center mb-8">
            <p className="text-eyebrow text-clinic-teal dark:text-clinic-teal-soft">Patient Portal</p>
            <h1 className="mt-3 text-heading-2">Welcome Back</h1>
            <p className="mt-2 text-body-sm text-muted">
              Access your dental history, upcoming visits, and health records.
            </p>
          </div>

          <SignInForm />

          <p className="mt-8 text-center text-xs text-muted">
            New to DENCITY?{" "}
            <Link
              href="/book"
              className="font-semibold text-clinic-teal hover:underline active:underline dark:text-clinic-teal-soft"
            >
              Book your first appointment
            </Link>{" "}
            to automatically create an account.
          </p>
        </div>
      </Container>
    </section>
  );
}
