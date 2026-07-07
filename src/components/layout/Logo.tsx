import Link from "next/link";

type LogoProps = {
  /** "inverse" is for dark surfaces such as the footer. */
  tone?: "default" | "inverse";
};

export default function Logo({ tone = "default" }: LogoProps) {
  const inverse = tone === "inverse";

  return (
    <Link
      href="/"
      aria-label="DENCITY Dental Care — home"
      className="inline-flex items-center gap-2.5"
    >
      <svg
        viewBox="0 0 24 24"
        className={`h-8 w-8 ${inverse ? "text-clinic-teal-soft" : "text-clinic-teal"}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 5.2C10.8 4.3 9.5 3.8 8.2 3.8 5.6 3.8 4 5.9 4 8.3c0 1.5.5 2.7 1 4 .6 1.6 1 4.3 1.3 6.4.1.9.9 1.6 1.8 1.6s1.7-.7 1.8-1.6l.5-3.7c.1-.8.7-1.4 1.6-1.4s1.5.6 1.6 1.4l.5 3.7c.1.9.9 1.6 1.8 1.6s1.7-.7 1.8-1.6c.3-2.1.7-4.8 1.3-6.4.5-1.3 1-2.5 1-4 0-2.4-1.6-4.5-4.2-4.5-1.3 0-2.6.5-3.8 1.4z" />
      </svg>
      <span className="flex flex-col">
        <span
          className={`text-base font-semibold leading-none tracking-[0.12em] ${
            inverse ? "text-white" : "text-foreground"
          }`}
        >
          DENCITY
        </span>
        <span
          className={`mt-1 text-[0.58rem] font-medium uppercase leading-none tracking-[0.3em] ${
            inverse ? "text-white/60" : "text-muted"
          }`}
        >
          Dental Care
        </span>
      </span>
    </Link>
  );
}
