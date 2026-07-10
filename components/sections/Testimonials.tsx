import TestimonialsMarquee from "./TestimonialsMarquee";
import { getGoogleReviews, type Testimonial } from "@/lib/google-reviews";

// Curated fallback shown only when live Google reviews can't be fetched
// (missing API key locally, quota/network error, or an empty result).
const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Sarah Jenkins",
    treatment: "Smile Makeover",
    rating: 5,
    review: "I couldn't be happier with my smile makeover! Dr. Sharma took the time to explain every option. The whole experience was gentle and completely pain-free.",
    avatarLetter: "S",
  },
  {
    id: "t2",
    name: "David Chen",
    treatment: "Dental Implants",
    rating: 5,
    review: "The implant procedure was incredibly smooth. Dr. Daniel Okafor's planning was so precise. I felt absolutely zero discomfort and the result is perfect.",
    avatarLetter: "D",
  },
  {
    id: "t3",
    name: "Priya Patel",
    treatment: "Orthodontics",
    rating: 5,
    review: "My clear aligner journey was a breeze. Dr. Arjun Mehta is a master of his craft. The process was unhurried, clean, and extremely professional.",
    avatarLetter: "P",
  },
  {
    id: "t4",
    name: "Marcus Vance",
    treatment: "General Dentistry",
    rating: 5,
    review: "Going to the dentist used to cause me anxiety, but DENCITY has completely changed that. The space is calming, the staff is gentle, and they never rush.",
    avatarLetter: "M",
  },
  {
    id: "t5",
    name: "Emily Watson",
    treatment: "Pediatric Dentistry",
    rating: 5,
    review: "Dr. Elena Rodrigues is amazing with kids! My 6-year-old daughter actually looks forward to her checkups now. A truly family-friendly practice.",
    avatarLetter: "E",
  },
];

// Server Component: fetches live 5-star Google reviews (cached 24h) on the
// server, keeping the API key off the client, then hands the data to the
// client marquee which owns the Framer Motion anti-gravity physics.
export default async function Testimonials() {
  const liveReviews = await getGoogleReviews();
  const testimonials = liveReviews.length > 0 ? liveReviews : FALLBACK_TESTIMONIALS;

  return <TestimonialsMarquee testimonials={testimonials} />;
}
