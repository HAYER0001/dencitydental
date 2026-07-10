import type { Testimonial } from "@/lib/google-reviews";

/**
 * Curated REAL 5-star Google reviews for Dencity Dental Care (Place ID
 * ChIJZe4XqkVyFjkRJz_a4SipVuI), transcribed from the clinic's public Google
 * profile. These are genuine patient reviews — NOT placeholder/fake data —
 * used as a fallback so the Testimonials section shows real content while the
 * live Places API is unavailable (e.g. billing not yet enabled). Once the API
 * is live, fetched reviews take precedence.
 *
 * Aggregate at time of transcription: 4.9 average across 131 reviews.
 */
export const AGGREGATE_RATING = 4.9;
export const AGGREGATE_REVIEW_COUNT = 131;

export const CURATED_REVIEWS: Testimonial[] = [
  {
    id: "gr-vikas-arora",
    name: "Vikas Arora",
    treatment: "Verified Google Review",
    rating: 5,
    review:
      "Great clinic for dental problems. Dr. Jagjeet Singh provides satisfactory results in terms of treatment. The new clinic interior is awesome — you feel positive when you enter, with calm, positive music all around. Recommended.",
    avatarLetter: "V",
    photoUrl:
      "https://lh3.googleusercontent.com/a-/ALV-UjWZKeWQv9J7yJvmrmYcvnpjErFoCVk_FBp95skST47_gfIdCfV_=s64-c-rp-mo-ba12-br100",
  },
  {
    id: "gr-shyamak-nagpal",
    name: "Shyamak Nagpal",
    treatment: "Verified Google Review",
    rating: 5,
    review:
      "Best dental clinic in Suratgarh. Painless treatment, friendly doctors, hygienic setup.",
    avatarLetter: "S",
    photoUrl:
      "https://lh3.googleusercontent.com/a-/ALV-UjW2MbPbXXn-Jh-Ea8fZ1GQeuhmFVI75_Do8hP09HZoW1pGsN5r6=s64-c-rp-mo-ba12-br100",
  },
  {
    id: "gr-nishan-thind",
    name: "Nishan Singh Thind",
    treatment: "Root Canal · Verified Google Review",
    rating: 5,
    review:
      "I recently visited Dr. Jagjeet Singh for an RCT. I was a bit nervous, but the team did a fantastic job of putting me at ease. The procedure itself was quick and surprisingly painless. Dr. Jagjeet Singh took the time to explain every step and ensured I was comfortable throughout.",
    avatarLetter: "N",
    photoUrl:
      "https://lh3.googleusercontent.com/a-/ALV-UjVWRl93-b31TF-CfzcUgYwLA_0x1CRpi3mFTp6RG3fJVbDjL4I=s64-c-rp-mo-br100",
  },
  {
    id: "gr-archit-dhanukaa",
    name: "Archit Dhanukaa",
    treatment: "Braces · Verified Google Review",
    rating: 5,
    review:
      "I have been coming to Dencity Dental Care for a long time and taken many treatments here. Dr. Jagjeet is a very good doctor — kind, helpful, and always makes you feel comfortable. Dr. Varun is the best doctor for braces; he fixed everything properly and today my treatment is fully complete. All the doctors are always available whenever you have a problem. Strongly recommend Dencity Dental Care.",
    avatarLetter: "A",
    photoUrl:
      "https://lh3.googleusercontent.com/a/ACg8ocIfH0d9aTU3JxePCsLAi0SnwjV908Qo69O-5kEME3CdzA9niw=s64-c-rp-mo-br100",
  },
  {
    id: "gr-parth-arora",
    name: "Parth Arora",
    treatment: "Pediatric Dentistry · Verified Google Review",
    rating: 5,
    review:
      "Visited Dencity for my child's procedure, and I am very pleased with the care we received. Dr. Jagjeet Singh was amazing at keeping my child comfortable, and the pediatric staff was incredibly patient and supportive.",
    avatarLetter: "P",
    photoUrl:
      "https://lh3.googleusercontent.com/a/ACg8ocJ9t6QaUS9JEKX1nBwD0yxzTibrE8XdoX2dZrwrWbBHkC0Sfw=s64-c-rp-mo-br100",
  },
  {
    id: "gr-the-stranger",
    name: "Sandeep Kour",
    treatment: "Root Canal · Verified Google Review",
    rating: 5,
    review:
      "We visited the clinic for an RCT. Dr. Jagjeet Singh and Dr. Manisha were very polite and professional. Dr. Jagjeet is highly skilled in his field. We are fully satisfied with the service. Highly recommended for dental care.",
    avatarLetter: "S",
    photoUrl:
      "https://lh3.googleusercontent.com/a/ACg8ocIlre_UbBDoelYU-E3nIqFOXpvBcZTj3eWM29W2cKRemXCuEw=s64-c-rp-mo-br100",
  },
  {
    id: "gr-meet-studio",
    name: "Meet Studio",
    treatment: "Family Dentistry · Verified Google Review",
    rating: 5,
    review:
      "We visited Dr. Jagjeet Singh for our family dental check-up and had a wonderful experience. The doctor is very gentle and explains everything clearly. The clinic is clean and staff is very polite. Perfect place for kids and adults. Highly recommended for family dental care!",
    avatarLetter: "M",
    photoUrl:
      "https://lh3.googleusercontent.com/a-/ALV-UjWbMsW3JCrMT5nIKJ12lBTeAfohNL6HLH5FiIhs48jxi2pyXSE=s64-c-rp-mo-br100",
  },
  {
    id: "gr-nikhil-verma",
    name: "Nikhil Verma",
    treatment: "Dental Implant · Verified Google Review",
    rating: 5,
    review:
      "Complete dental care under one roof with the latest and sterilised instruments. Staff is polite and cooperative. Thanks Dr. Jagjeet for the implant and for making me comfortable during the procedure.",
    avatarLetter: "N",
    photoUrl:
      "https://lh3.googleusercontent.com/a/ACg8ocKlzJ8VxQ8byU66ssDb92IH4JZ47Y7SKv4nkd6_C_Jwp6lxDA=s64-c-rp-mo-ba12-br100",
  },
  {
    id: "gr-kumar-niwalikar",
    name: "Kumar Niwalikar",
    treatment: "Full-Mouth Rehabilitation · Verified Google Review",
    rating: 5,
    review:
      "One of the best dental clinics in Suratgarh, with all the latest dental equipment and a very good doctor in a pleasant environment. You can have all dental treatments here — root canal, implant, full mouth rehabilitation and braces. Thanks Dr. Jagjeet Singh.",
    avatarLetter: "K",
    photoUrl:
      "https://lh3.googleusercontent.com/a-/ALV-UjUwW4D8kopjt7gIbqZozp2XN7-b0uzTLjWPC6_ZGby8cQ6zPydA=s64-c-rp-mo-ba12-br100",
  },
  {
    id: "gr-amarendra-punati",
    name: "Amarendra Punati",
    treatment: "Verified Google Review",
    rating: 5,
    review:
      "I had a complicated dental problem and sought treatment even from Australia, yet still had lingering issues despite spending a lot. On a good reference I visited Dr. Jagjeet Singh, who has vast experience in dentistry. I found him very professional, understanding, empathetic and extremely skilled. After his treatment I have no issues with my teeth. Strongly recommend him.",
    avatarLetter: "A",
    photoUrl:
      "https://lh3.googleusercontent.com/a/ACg8ocLsCloK-EIiGqytnEavQj2IThIlHSfpScfIUqoUX4_3BSHJxdA=s64-c-rp-mo-br100",
  },
  {
    id: "gr-rise-classical",
    name: "Rise Classical",
    treatment: "Verified Google Review",
    rating: 5,
    review:
      "I like the ambience very much — Indian classical music, books, everything. Feels homely. Dr. Jagjeet explained things like a younger brother. Highly recommended.",
    avatarLetter: "R",
    photoUrl:
      "https://lh3.googleusercontent.com/a-/ALV-UjUByFqUmNbno_cv1JZCNqO9FSHH8KQC-GtW7xTHJHc26dzs-i00=s64-c-rp-mo-br100",
  },
  {
    id: "gr-parwathi-kumari",
    name: "Parwathi Kumari",
    treatment: "Verified Google Review",
    rating: 5,
    review:
      "Thorough professional doctors, all specialities under one roof. Highly recommended.",
    avatarLetter: "P",
    photoUrl:
      "https://lh3.googleusercontent.com/a/ACg8ocLJCniiehv0fACeMz6h2-jL6VtDLRVXDOhM4L9rjitUZ4Jryg=s64-c-rp-mo-br100",
  },
];
