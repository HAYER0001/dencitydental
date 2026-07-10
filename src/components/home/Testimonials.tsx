"use client";

import Container from "@/components/layout/Container";

export type Testimonial = {
  id: string;
  name: string;
  treatment: string;
  rating: number;
  review: string;
};

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Jenkins",
    treatment: "Smile Makeover",
    rating: 5,
    review: "I couldn't be happier with my smile makeover! Dr. Sharma took the time to explain every option. The whole experience was gentle and completely pain-free.",
  },
  {
    id: "2",
    name: "David Chen",
    treatment: "Dental Implants",
    rating: 5,
    review: "The implant procedure was incredibly smooth. Dr. Daniel Okafor's planning was so precise. I felt absolutely zero discomfort and the result is perfect.",
  },
  {
    id: "3",
    name: "Priya Patel",
    treatment: "Orthodontics",
    rating: 5,
    review: "My clear aligner journey was a breeze. Dr. Arjun Mehta is a master of his craft. The process was unhurried, clean, and extremely professional.",
  },
  {
    id: "4",
    name: "Marcus Vance",
    treatment: "General Dentistry",
    rating: 5,
    review: "Going to the dentist used to cause me anxiety, but DENCITY has completely changed that. The space is calming, the staff is gentle, and they never rush.",
  },
  {
    id: "5",
    name: "Emily Watson",
    treatment: "Pediatric Dentistry",
    rating: 5,
    review: "Dr. Elena Rodrigues is amazing with kids! My 6-year-old daughter actually looks forward to her checkups now. A truly family-friendly practice.",
  },
];

function StarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4.5 w-4.5 fill-clinic-teal text-clinic-teal dark:fill-clinic-teal-soft dark:text-clinic-teal-soft"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="flex h-full w-[22rem] shrink-0 flex-col justify-between rounded-card border border-deep-charcoal/5 bg-background p-7 shadow-soft transition-colors duration-[var(--duration-base)] hover:border-clinic-teal/20 active:border-clinic-teal/20 dark:border-white/10 dark:hover:border-clinic-teal-soft/20 dark:active:border-clinic-teal-soft/20">
      <div>
        <div className="flex items-center gap-1">
          {Array.from({ length: testimonial.rating }).map((_, idx) => (
            <StarIcon key={idx} />
          ))}
          <span className="sr-only">Rated {testimonial.rating} out of 5 stars</span>
        </div>
        <p className="mt-5 text-body-sm leading-relaxed text-foreground/90 whitespace-normal">
          &ldquo;{testimonial.review}&rdquo;
        </p>
      </div>

      <div className="mt-6 flex items-center gap-3.5 border-t border-deep-charcoal/5 pt-5 dark:border-white/10">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-clinic-teal/10 text-body-sm font-semibold text-clinic-teal dark:bg-clinic-teal-soft/10 dark:text-clinic-teal-soft">
          {testimonial.name[0]}
        </div>
        <div>
          <h3 className="text-body-sm font-semibold text-foreground">{testimonial.name}</h3>
          <p className="text-[0.8rem] text-muted">{testimonial.treatment}</p>
        </div>
      </div>
    </article>
  );
}

export default function Testimonials() {
  // Duplicate list to achieve infinite marquee looping seamlessly
  const doubledTestimonials = [...testimonials, ...testimonials];

  return (
    <section aria-labelledby="testimonials-heading" className="py-section overflow-hidden">
      <Container>
        <div className="max-w-2xl">
          <p className="text-eyebrow text-clinic-teal dark:text-clinic-teal-soft">Testimonials</p>
          <h2 id="testimonials-heading" className="mt-3 text-heading-1">
            What our patients say
          </h2>
          <p className="mt-4 text-body-lg text-muted">
            Real feedback from patients who experienced our calm, professional care.
          </p>
        </div>
      </Container>

      {/* Marquee Container */}
      <div className="relative mt-12 w-full select-none overflow-hidden">
        {/* Soft fading edges for premium look */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent pointer-events-none sm:w-24 md:w-32 lg:w-48"
        />
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none sm:w-24 md:w-32 lg:w-48"
        />

        <div className="animate-marquee gap-6 px-6">
          {doubledTestimonials.map((testimonial, idx) => (
            <TestimonialCard
              key={`${testimonial.id}-${idx}`}
              testimonial={testimonial}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
