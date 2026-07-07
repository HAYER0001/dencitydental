export type NavLink = {
  href: string;
  label: string;
};

export const navLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const signInLink: NavLink = { href: "/sign-in", label: "Sign in" };

export const bookLink: NavLink = { href: "/book", label: "Book Appointment" };
