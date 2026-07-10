/**
 * Server-only utility for fetching live Google reviews via the Places Details API.
 *
 * Security: reads GOOGLE_PLACES_API_KEY from a non-public env var, so the key is
 * never bundled into the client. This module must only be imported from Server
 * Components / server code (it is consumed by the async Testimonials server
 * component).
 *
 * There is intentionally NO fake/fallback data: if the request fails or returns
 * nothing, callers render a "temporarily unavailable" state so only the real
 * Google API response is ever shown.
 */

export type Testimonial = {
  id: string;
  name: string;
  /** Subtitle shown under the author — the review's relative time. */
  treatment: string;
  rating: number;
  review: string;
  avatarLetter: string;
  /** Author profile photo URL (Google-hosted) when available. */
  photoUrl?: string;
};

// Once per day: keeps the site fast and stays well under Places API quota.
const REVALIDATE_SECONDS = 86400;

// Legacy Places Details API review shape.
type PlacesReview = {
  author_name?: string;
  profile_photo_url?: string;
  rating?: number;
  text?: string;
  relative_time_description?: string;
  time?: number;
};

type PlacesResponse = {
  result?: { reviews?: PlacesReview[] };
  status?: string;
  error_message?: string;
};

/**
 * Fetch 5-star reviews for the clinic's Google Place.
 * Returns [] on any failure — the caller shows the unavailable state.
 */
export async function getGoogleReviews(): Promise<Testimonial[]> {
  if (!process.env.GOOGLE_PLACES_API_KEY) {
    // Not configured — caller renders the "temporarily unavailable" state.
    return [];
  }

  try {
    const res = await fetch(
      "https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJZe4XqkVyFjkRJz_a4SipVuI&fields=reviews&key=" +
        process.env.GOOGLE_PLACES_API_KEY,
      // Next.js persistent cache: pull fresh data at most once every 24 hours.
      { next: { revalidate: REVALIDATE_SECONDS } },
    );

    if (!res.ok) {
      console.error(`Google Places API responded with status ${res.status}`);
      return [];
    }

    const data = (await res.json()) as PlacesResponse;

    // The API returns HTTP 200 even on logical errors — check the status field.
    if (data.status && data.status !== "OK") {
      console.error(`Google Places API status: ${data.status}`, data.error_message ?? "");
      return [];
    }

    const reviews = data.result?.reviews ?? [];

    return reviews
      .filter((review) => review.rating === 5 && Boolean(review.text?.trim()))
      .map((review, index) => {
        const name = review.author_name?.trim() || "Google User";

        return {
          id: `google-review-${review.time ?? index}`,
          name,
          treatment: review.relative_time_description?.trim() || "Verified Google Review",
          rating: 5,
          review: (review.text ?? "").trim(),
          avatarLetter: name.charAt(0).toUpperCase(),
          photoUrl: review.profile_photo_url || undefined,
        } satisfies Testimonial;
      });
  } catch (error) {
    console.error("Failed to fetch Google reviews:", error);
    return [];
  }
}
