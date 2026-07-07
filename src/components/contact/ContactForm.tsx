"use client";

export default function ContactForm() {
  return (
    <form onSubmit={(e) => e.preventDefault()} className="mt-8 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col">
          <label htmlFor="contact-name" className="text-xs font-semibold text-foreground">
            Name
          </label>
          <input
            type="text"
            id="contact-name"
            required
            placeholder="Sarah Jenkins"
            className="mt-2 rounded-button border border-deep-charcoal/10 bg-background px-4 py-2.5 text-body-sm text-foreground focus:border-clinic-teal focus:outline-none focus:ring-1 focus:ring-clinic-teal dark:border-white/10"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="contact-email" className="text-xs font-semibold text-foreground">
            Email
          </label>
          <input
            type="email"
            id="contact-email"
            required
            placeholder="sarah@example.com"
            className="mt-2 rounded-button border border-deep-charcoal/10 bg-background px-4 py-2.5 text-body-sm text-foreground focus:border-clinic-teal focus:outline-none focus:ring-1 focus:ring-clinic-teal dark:border-white/10"
          />
        </div>
      </div>
      <div className="flex flex-col">
        <label htmlFor="contact-subject" className="text-xs font-semibold text-foreground">
          Subject
        </label>
        <input
          type="text"
          id="contact-subject"
          required
          placeholder="Inquiry about Smile Makeover"
          className="mt-2 rounded-button border border-deep-charcoal/10 bg-background px-4 py-2.5 text-body-sm text-foreground focus:border-clinic-teal focus:outline-none focus:ring-1 focus:ring-clinic-teal dark:border-white/10"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="contact-message" className="text-xs font-semibold text-foreground">
          Message
        </label>
        <textarea
          id="contact-message"
          required
          rows={4}
          placeholder="Tell us how we can help..."
          className="mt-2 rounded-button border border-deep-charcoal/10 bg-background px-4 py-2.5 text-body-sm text-foreground focus:border-clinic-teal focus:outline-none focus:ring-1 focus:ring-clinic-teal dark:border-white/10"
        />
      </div>

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center rounded-pill bg-clinic-teal px-6 py-3.5 font-semibold text-white shadow-soft transition-colors duration-[var(--duration-fast)] hover:bg-clinic-teal/90"
      >
        Send Message
      </button>
    </form>
  );
}
