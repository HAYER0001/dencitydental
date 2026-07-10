import TestimonialsMarquee from "./TestimonialsMarquee";
import { getGoogleReviews } from "@/lib/google-reviews";
import { CURATED_REVIEWS, AGGREGATE_RATING, AGGREGATE_REVIEW_COUNT } from "@/lib/reviews-data";

// Server Component: fetches live 5-star Google reviews (cached 24h) on the
// server, keeping the API key off the client. If the live API is unavailable
// (e.g. billing not yet enabled), it falls back to CURATED_REVIEWS — genuine,
// transcribed Google reviews, never placeholder/fake data.
export default async function Testimonials() {
  const liveReviews = await getGoogleReviews();
  const reviews = liveReviews.length > 0 ? liveReviews : CURATED_REVIEWS;

  return (
    <section
      aria-labelledby="testimonials-section-title"
      className="py-section-sm overflow-hidden bg-background"
    >
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="max-w-2xl mb-12">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-[#0A5C5C]">
            Google Reviews
          </p>
          <h2 id="testimonials-section-title" className="mt-3 text-3xl font-bold tracking-tight text-[#0F1717]">
            What Our Patients Say on{" "}
            <span className="text-[#0A5C5C]">Google Reviews</span>
          </h2>
          <p className="mt-4 text-base text-[#0F1717]/70 leading-relaxed">
            Rated{" "}
            <span className="font-semibold text-[#0F1717]">
              {AGGREGATE_RATING.toFixed(1)}★
            </span>{" "}
            across {AGGREGATE_REVIEW_COUNT}+ verified Google reviews — real feedback
            from patients who experienced our calm, professional care.
          </p>
        </div>
      </div>

      <TestimonialsMarquee testimonials={reviews} />
    </section>
  );
}
