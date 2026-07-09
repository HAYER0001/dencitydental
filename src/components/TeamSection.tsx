import Image from "next/image";
import { Quote } from "lucide-react";

export default function TeamSection() {
  const doctors = [
    {
      name: "Dr. Jagjeet Singh | Prosthodontist",
      title: "Smile Rehabilitation & Aesthetic Expert",
      bio: "With years of experience in advanced dental rehabilitation, Dr. Jagjeet Singh specializes in restoring smiles with precision, function, and natural beauty. He focuses on dental crowns, bridges, full & partial dentures, dental implants, veneers, and complete smile makeovers. Using digital scans and modern materials, he designs teeth that look great and feel perfect. At Dencity Dental Care, his patient-first approach ensures comfortable treatment and long-lasting results.",
      quote: "A confident smile should work as beautifully as it looks.",
      image: "/doctors/jagjeet.jpg",
    },
    {
      name: "Dr. Varun Ahuja | Orthodontist",
      title: "Braces & Invisible Aligners Specialist",
      bio: "Dr. Varun Ahuja is dedicated to creating straight, healthy, and beautiful smiles. As an Orthodontist, he specializes in metal braces, ceramic braces, and clear/invisible aligners for teens and adults. With expertise in smile analysis, bite correction, and facial aesthetics, Dr. Varun uses the latest 3D scanning technology to plan treatments that are faster, more comfortable, and more predictable. Whether it’s closing gaps, correcting crowding, or perfecting your alignment — he believes every smile deserves to shine without hesitation.",
      quote: "Straight teeth, confident you.",
      image: "/doctors/varun.jpg",
    },
    {
      name: "Dr. Nitish Goyal | Endodontist",
      title: "Root Canal & Pain Relief Specialist",
      bio: "Dr. Nitish Goyal is a specialist in saving natural teeth through advanced, painless root canal treatment. He handles complex RCTs, re-RCTs, dental trauma, and microscopic endodontics with precision and care. Using rotary instruments, apex locators, and digital X-rays, he ensures treatments are completed in minimal sittings with maximum comfort. Known for his gentle touch and calm approach, Dr. Nitish helps patients overcome dental fear and keep their natural smile.",
      quote: "Save your tooth. Save your smile. Pain-free.",
      image: "/doctors/nitish.jpg",
    },
    {
      name: "Dr. Manisha | BDS",
      title: "General & Preventive Dentistry Expert",
      bio: "Dr. Manisha is committed to making dental care comfortable, preventive, and family-friendly. She specializes in teeth cleaning & polishing, dental fillings, pediatric dentistry, tooth extractions, fluoride treatments, and oral health education. With a gentle and reassuring approach, she focuses on early diagnosis and preserving natural teeth. At Dencity Dental Care, Dr. Manisha creates a calm, welcoming environment — especially for kids and first-time patients — because healthy habits start with the right care.",
      quote: "Prevention today, healthy smile tomorrow.",
      image: "/doctors/manisha.jpg",
    }
  ];

  return (
    <section className="bg-surface py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-gutter">
        <div className="mx-auto max-w-2xl text-center mb-16 md:mb-24">
          <h2 className="text-heading-1 mb-6 text-clinic-teal">
            Meet The Specialists Behind Your Smile
          </h2>
          <p className="text-body-lg text-muted max-w-2xl mx-auto">
            At Dencity Dental Care, you don’t need referrals. Our in-house experts bring advanced care together under one roof in Suratgarh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
          {doctors.map((doctor, index) => (
            <div
              key={index}
              className="group flex flex-col overflow-hidden rounded-card bg-background shadow-soft hover:shadow-card transition-shadow duration-300 border border-black/5 dark:border-white/10"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface">
                {/* object-top: these are upper-body portraits — anchor to the top so the
                    4:3 crop keeps the face, never the torso. Grayscale → colour on hover. */}
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-top grayscale transition duration-700 ease-out group-hover:grayscale-0 group-hover:scale-[1.04]"
                />
                {/* Seat the portrait into the card with a soft floor gradient — subtle in
                    light, deeper in dark mode so the image melts into the card body. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background/40 to-transparent dark:from-background/70"
                />
              </div>
              
              <div className="flex flex-col flex-1 p-8 sm:p-10">
                <div className="mb-4">
                  <h3 className="text-heading-3 text-foreground mb-1">{doctor.name}</h3>
                  <p className="text-clinic-teal font-medium tracking-wide text-sm uppercase">{doctor.title}</p>
                </div>
                
                <p className="text-body-sm text-muted mb-8 flex-1">
                  {doctor.bio}
                </p>
                
                <div className="relative bg-surface rounded-button p-6 mt-auto">
                  <Quote className="absolute -top-3 -left-2 h-8 w-8 text-clinic-teal/20 rotate-180" />
                  <p className="relative z-10 text-body italic text-foreground/80 font-serif">
                    {doctor.quote}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
