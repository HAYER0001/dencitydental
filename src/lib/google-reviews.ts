/**
 * Server-only utility for fetching live Google reviews via the Places API (New).
 *
 * Security: reads GOOGLE_PLACES_API_KEY from a non-public env var, so the key is
 * never bundled into the client. This module must only be imported from Server
 * Components / server code (it is consumed by the async Testimonials server
 * component). If the key is missing or the request fails, it returns an empty
 * array so the caller can gracefully fall back to curated testimonials.
 */

export type Testimonial = {
  id: string;
  name: string;
  /** Subtitle shown under the author — the review's relative time for live data. */
  treatment: string;
  rating: number;
  review: string;
  avatarLetter: string;
  /** Author profile photo URL (Google-hosted) when available. */
  photoUrl?: string;
};

// Place ID for the clinic. Overridable via env, defaults to the provided ID.
const PLACE_ID = process.env.GOOGLE_PLACE_ID || "ChIJZe4XqkVyFjkRJz_a4SipVuI";
const PLACES_ENDPOINT = "https://places.googleapis.com/v1/places";

// Once per day: keeps the site fast and stays well under Places API quota.
const REVALIDATE_SECONDS = 86400;

type PlacesReview = {
  name?: string;
  rating?: number;
  text?: { text?: string };
  originalText?: { text?: string };
  relativePublishTimeDescription?: string;
  authorAttribution?: {
    displayName?: string;
    uri?: string;
    photoUri?: string;
  };
};

type PlacesResponse = {
  reviews?: PlacesReview[];
};

/**
 * Fetch 5-star reviews for the clinic's Google Place.
 * Returns [] on any failure so callers can fall back to curated content.
 */
export async function getGoogleReviews(): Promise<Testimonial[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    // Not configured (e.g. local dev without the key) — caller uses fallback.
    return [];
  }

  try {
    const res = await fetch(`${PLACES_ENDPOINT}/${PLACE_ID}?languageCode=en`, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        // Request only the review fields we render — smaller, cheaper responses.
        "X-Goog-FieldMask":
          "reviews.rating,reviews.text,reviews.originalText,reviews.authorAttribution,reviews.relativePublishTimeDescription",
      },
      // Next.js persistent cache: pull fresh data at most once every 24 hours.
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!res.ok) {
      console.error(`Google Places API responded with status ${res.status}`);
      return [];
    }

    const data = (await res.json()) as PlacesResponse;
    const reviews = data.reviews ?? [];

    return reviews
      .filter((review) => {
        const body = review.text?.text || review.originalText?.text;
        return review.rating === 5 && Boolean(body?.trim());
      })
      .map((review, index) => {
        const name = review.authorAttribution?.displayName?.trim() || "Google User";
        const body = (review.text?.text || review.originalText?.text || "").trim();

        return {
          id: review.name || `google-review-${index}`,
          name,
          treatment: review.relativePublishTimeDescription?.trim() || "Verified Google Review",
          rating: 5,
          review: body,
          avatarLetter: name.charAt(0).toUpperCase(),
          photoUrl: review.authorAttribution?.photoUri || undefined,
        } satisfies Testimonial;
      });
  } catch (error) {
    console.error("Failed to fetch Google reviews:", error);
    return [];
  }
}
